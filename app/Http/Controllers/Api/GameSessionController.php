<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class GameSessionController extends Controller
{
    public function index(Request $request)
    {
        $sessions = $request->user()->gameSessions()->latest()->get();
        return response()->json($sessions);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rental_fee' => 'required|numeric|gt:0',
            'pb1_percent' => 'required|numeric|min:0|max:100',
            'service_percent' => 'required|numeric|min:0|max:100',
            'tip_amount' => 'required|numeric|min:0',
            'players' => 'required|array|min:1',
            'players.*.id' => 'required|exists:players,id',
            'players.*.name' => 'required|string',
            'players.*.start_time' => 'required|date_format:H:i',
            'players.*.end_time' => 'required|date_format:H:i',
        ]);

        // ==================================================================
        // == PEMERIKSAAN MANUAL SEBAGAI LAPISAN PENGAMAN TAMBAHAN ==
        // ==================================================================
        if ((float) $validated['rental_fee'] <= 0) {
            // Baris ini seharusnya tidak pernah tercapai jika validasi gt:0 berjalan,
            // tapi kita tambahkan untuk memastikan 100% tidak ada data 0 yang masuk.
            throw ValidationException::withMessages([
                'rental_fee' => 'Biaya Sewa harus merupakan angka dan lebih besar dari 0.',
            ]);
        }

        $session = $request->user()->gameSessions()->create([
            'name' => $validated['name'],
            'rental_fee' => $validated['rental_fee'],
            'pb1_percent' => $validated['pb1_percent'],
            'service_percent' => $validated['service_percent'],
            'tip_amount' => $validated['tip_amount'],
        ]);
        
        foreach ($validated['players'] as $playerData) {
            $session->members()->create([
                'name' => $playerData['name'],
                'start_time' => $playerData['start_time'],
                'end_time' => $playerData['end_time'],
            ]);
        }

        return response()->json($session, 201);
    }

    public function show(Request $request, GameSession $gameSession)
    {
        try {
            if ($request->user()->id !== $gameSession->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $gameSession->load(['members']);

            $rentalCost = $gameSession->rental_fee;
            $pb1Amount = $rentalCost * ($gameSession->pb1_percent / 100);
            $serviceAmount = $rentalCost * ($gameSession->service_percent / 100);
            $grandTotal = $rentalCost + $pb1Amount + $serviceAmount + $gameSession->tip_amount;

            $calculateDuration = function ($startTime, $endTime) {
                if (!$startTime || !$endTime) {
                    return 0;
                }
                try {
                    // Parse times as time-only strings and attach a consistent base date (today)
                    $base = Carbon::today();
                    $start = $base->copy()->setTimeFromTimeString(substr($startTime, 0, 8));
                    $end = $base->copy()->setTimeFromTimeString(substr($endTime, 0, 8));

                    // If end is before or equal to start, assume it passed midnight -> add one day
                    if ($end->lessThanOrEqualTo($start)) {
                        $end->addDay();
                    }

                    $minutes = $end->diffInMinutes($start);
                    return $minutes >= 0 ? $minutes : 0;
                } catch (\Exception $e) {
                    return 0;
                }
            };

            $totalMinutesPlayed = $gameSession->members->reduce(function ($carry, $member) use ($calculateDuration) {
                return $carry + $calculateDuration($member->start_time, $member->end_time);
            }, 0);

            // Calculate durations using manual parsing to avoid timezone/Carbon surprises
            $durations = $gameSession->members->mapWithKeys(function ($member) use ($calculateDuration) {
                $start = $member->start_time;
                $end = $member->end_time;
                // parse HH:MM or HH:MM:SS into minutes since midnight
                $parseMinutes = function ($time) {
                    if (!$time) return 0;
                    $parts = explode(':', substr($time, 0, 8));
                    $h = isset($parts[0]) ? (int)$parts[0] : 0;
                    $m = isset($parts[1]) ? (int)$parts[1] : 0;
                    $s = isset($parts[2]) ? (int)$parts[2] : 0;
                    return $h * 60 + $m + (int)floor($s/60);
                };

                $startMin = $parseMinutes($start);
                $endMin = $parseMinutes($end);

                // if end is less than or equal to start, assume it crossed midnight
                if ($endMin <= $startMin) {
                    $endMin += 24 * 60;
                }

                $minutes = max(0, $endMin - $startMin);
                return [$member->id => $minutes];
            });

            $totalMinutesPlayed = $durations->sum();

            // Rounding settings (in currency units, default to 100)
            $rounding = 100;

            // First compute raw bills
            $rawBills = $gameSession->members->mapWithKeys(function ($member) use ($durations, $totalMinutesPlayed, $grandTotal, $gameSession) {
                $durationMinutes = $durations->get($member->id, 0);
                if ($totalMinutesPlayed > 0) {
                    $contributionRatio = $durationMinutes / $totalMinutesPlayed;
                    $value = $grandTotal * $contributionRatio;
                } else {
                    $value = $grandTotal / max(1, $gameSession->members->count());
                }
                return [$member->id => $value];
            });

            // Round each bill to nearest $rounding and compute residual to match rounded grand total
            $roundedBills = $rawBills->map(function ($val) use ($rounding) {
                return round($val / $rounding) * $rounding;
            });

            $roundedSum = $roundedBills->sum();
            $targetTotal = round($grandTotal / $rounding) * $rounding;
            $diff = $targetTotal - $roundedSum;

            if ($diff !== 0) {
                // Adjust the member with the largest raw bill by the difference
                $maxId = $rawBills->sortDesc()->keys()->first();
                $roundedBills[$maxId] = $roundedBills[$maxId] + $diff;
            }

            // Assign bills back to members (as numbers)
            $gameSession->members->each(function ($member) use ($roundedBills) {
                $member->bill = (float) $roundedBills->get($member->id, 0);
            });

            return response()->json([
                'session' => $gameSession,
                'calculation' => [
                    'rental_cost' => round($rentalCost, 2),
                    'pb1_amount' => round($pb1Amount, 2),
                    'service_amount' => round($serviceAmount, 2),
                    'tip_amount' => round($gameSession->tip_amount, 2),
                    'grand_total' => round($grandTotal, 2),
                    'member_count' => $gameSession->members->count(),
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in GameSession show: ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error'], 500);
        }
    }

    public function destroy(Request $request, GameSession $gameSession)
    {
        if ($request->user()->id !== $gameSession->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $gameSession->delete();
        return response()->json(['message' => 'Session deleted successfully']);
    }
}