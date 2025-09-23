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
        if ($request->user()->id !== $gameSession->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gameSession->load(['members']);

        $rentalCost = $gameSession->rental_fee;
        $pb1Amount = $rentalCost * ($gameSession->pb1_percent / 100);
        $serviceAmount = $rentalCost * ($gameSession->service_percent / 100);
        $grandTotal = $rentalCost + $pb1Amount + $serviceAmount + $gameSession->tip_amount;

        $calculateDuration = function ($startTime, $endTime) {
            $start = Carbon::parse($startTime);
            $end = Carbon::parse($endTime);
            if ($end->lessThan($start)) {
                $end->addDay();
            }
            return $end->diffInMinutes($start);
        };

        $totalMinutesPlayed = $gameSession->members->reduce(function ($carry, $member) use ($calculateDuration) {
            return $carry + $calculateDuration($member->start_time, $member->end_time);
        }, 0);

        $gameSession->members->each(function ($member) use ($totalMinutesPlayed, $grandTotal, $calculateDuration) {
            if ($totalMinutesPlayed > 0) {
                $durationMinutes = $calculateDuration($member->start_time, $member->end_time);
                $contributionRatio = $durationMinutes / $totalMinutesPlayed;
                $member->bill = round($grandTotal * $contributionRatio, 2);
            } else {
                $member->bill = 0;
            }
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