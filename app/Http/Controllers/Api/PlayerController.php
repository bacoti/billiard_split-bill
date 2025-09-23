<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PlayerController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->players()->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $player = $request->user()->players()->create($validated);

        return response()->json($player, 201);
    }

    public function update(Request $request, Player $player)
    {
        if ($request->user()->id !== $player->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $player->update($validated);

        return response()->json($player);
    }

    public function destroy(Request $request, Player $player)
    {
        if ($request->user()->id !== $player->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $player->delete();

        return response()->json(['message' => 'Player deleted successfully']);
    }
}