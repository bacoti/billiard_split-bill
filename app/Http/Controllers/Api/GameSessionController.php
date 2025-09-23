<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GameSession;
use Illuminate\Http\Request;

// UBAH NAMA CLASS
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
            'rental_fee' => 'required|numeric|min:0', // Diubah dari tarif per jam
            'pb1_percent' => 'required|numeric|min:0|max:100',
            'service_percent' => 'required|numeric|min:0|max:100',
            'tip_amount' => 'required|numeric|min:0',
            'players' => 'required|array|min:1',
            'players.*.id' => 'required|exists:players,id', // Validasi ID pemain
            'players.*.name' => 'required|string',
            'players.*.start_time' => 'required|date_format:H:i',
            'players.*.end_time' => 'required|date_format:H:i|after:players.*.start_time',
        ]);

        $session = $request->user()->gameSessions()->create([
            'name' => $validated['name'],
            'rental_fee' => $validated['rental_fee'],
            'pb1_percent' => $validated['pb1_percent'],
            'service_percent' => $validated['service_percent'],
            'tip_amount' => $validated['tip_amount'],
        ]);
        
        foreach ($validated['players'] as $playerData) {
            $session->members()->create($playerData);
        }

        return response()->json($session, 201);
    }

    // Ganti parameter $session menjadi $gameSession untuk kejelasan
    public function show(Request $request, GameSession $gameSession)
    {
        if ($request->user()->id !== $gameSession->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gameSession->load(['members']);
        
        // Kalkulasi biaya sewa sekarang langsung dari nilai yang disimpan
        $rentalCost = $gameSession->rental_fee;
        $pb1Amount = $rentalCost * ($gameSession->pb1_percent / 100);
        $serviceAmount = $rentalCost * ($gameSession->service_percent / 100);
        
        $grandTotal = $rentalCost + $pb1Amount + $serviceAmount + $gameSession->tip_amount;

        $memberCount = $gameSession->members->count();
        $billPerMember = $memberCount > 0 ? $grandTotal / $memberCount : 0;

        return response()->json([
            'session' => $gameSession,
            'calculation' => [
                'rental_cost' => round($rentalCost, 2),
                'pb1_amount' => round($pb1Amount, 2),
                'service_amount' => round($serviceAmount, 2),
                'tip_amount' => round($gameSession->tip_amount, 2),
                'grand_total' => round($grandTotal, 2),
                'member_count' => $memberCount,
                'bill_per_member' => round($billPerMember, 2),
            ]
        ]);
    }

    // Ganti parameter $session menjadi $gameSession
    public function destroy(Request $request, GameSession $gameSession)
    {
        if ($request->user()->id !== $gameSession->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gameSession->delete();

        return response()->json(['message' => 'Session deleted successfully']);
    }
}