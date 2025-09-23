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
            'hourly_rate' => 'required|numeric|min:0',
            'tax_percent' => 'sometimes|numeric|min:0|max:100',
            'service_charge' => 'sometimes|numeric|min:0',
            'discount' => 'sometimes|numeric|min:0',
            'tables' => 'required|array|min:1',
            'tables.*.table_number' => 'required|string',
            'tables.*.duration_hours' => 'required|numeric|min:0',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string',
        ]);

        $session = $request->user()->gameSessions()->create([
            'name' => $validated['name'],
            'hourly_rate' => $validated['hourly_rate'],
            'tax_percent' => $validated['tax_percent'] ?? 10.0,
            'service_charge' => $validated['service_charge'] ?? 0,
            'discount' => $validated['discount'] ?? 0,
        ]);

        foreach ($validated['tables'] as $tableData) {
            $cost = $tableData['duration_hours'] * $session->hourly_rate;
            $session->billiardTables()->create([
                'table_number' => $tableData['table_number'],
                'duration_hours' => $tableData['duration_hours'],
                'cost' => $cost,
            ]);
        }

        foreach ($validated['members'] as $memberData) {
            $session->members()->create([
                'name' => $memberData['name'],
            ]);
        }

        return response()->json($session->load(['billiardTables', 'members']), 201);
    }

    // Ganti parameter $session menjadi $gameSession untuk kejelasan
    public function show(Request $request, GameSession $gameSession)
    {
        if ($request->user()->id !== $gameSession->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $gameSession->load(['billiardTables', 'members']);
        $subtotal = $gameSession->billiardTables->sum('cost');
        $taxAmount = $subtotal * ($gameSession->tax_percent / 100);
        $total = $subtotal + $taxAmount + $gameSession->service_charge - $gameSession->discount;
        $memberCount = $gameSession->members->count();
        $splitBill = $memberCount > 0 ? $total / $memberCount : 0;

        return response()->json([
            'session' => $gameSession,
            'calculation' => [
                'subtotal' => round($subtotal, 2),
                'tax_amount' => round($taxAmount, 2),
                'total_bill' => round($total, 2),
                'member_count' => $memberCount,
                'bill_per_member' => round($splitBill, 2),
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