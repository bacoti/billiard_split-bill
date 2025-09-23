<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route; // TAMBAHKAN BARIS INI
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Halaman Landing Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Halaman utama setelah login adalah Riwayat Sesi
Route::get('/dashboard', function () {
    return Inertia::render('SessionHistory');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route khusus untuk halaman pembuatan sesi baru
Route::get('/session/create', function () {
    return Inertia::render('CreateSession');
})->middleware(['auth', 'verified'])->name('session.create');

Route::get('/players', function () {
    return Inertia::render('PlayerManagement');
})->middleware(['auth', 'verified'])->name('players.index');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';