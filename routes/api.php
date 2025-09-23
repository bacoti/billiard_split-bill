<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameSessionController;
use App\Http\Controllers\Api\PlayerController;


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // HAPUS ATAU COMMENT SEMUA BARIS INI:
    // Route::get('/game-sessions', [GameSessionController::class, 'index']);
    // Route::post('/game-sessions', [GameSessionController::class, 'store']);
    // Route::get('/game-sessions/{gameSession}', [GameSessionController::class, 'show']);
    // Route::delete('/game-sessions/{gameSession}', [GameSessionController::class, 'destroy']);

    // GANTI DENGAN SATU BARIS DI BAWAH INI:
    Route::apiResource('game-sessions', GameSessionController::class)
         ->parameters(['game-sessions' => 'gameSession'])
         ->names('api.game-sessions');

    Route::apiResource('players', PlayerController::class)->names('api.players');

});