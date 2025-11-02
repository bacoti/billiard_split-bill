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

// Root path - redirect to login jika belum auth, ke session.create jika sudah
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('session.create');
    }
    return redirect()->route('login');
});

// Welcome page (optional, bisa diakses dari /welcome)
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Halaman utama setelah login adalah buat sesi baru
Route::get('/dashboard', function () {
    return redirect()->route('session.create');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route khusus untuk halaman pembuatan sesi baru
Route::get('/session/create', function () {
    return Inertia::render('CreateSession', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('session.create');

// Route untuk halaman riwayat sesi
Route::get('/session/history', function () {
    return Inertia::render('SessionHistory', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('session.history');

Route::get('/players', function () {
    return Inertia::render('PlayerManagement', [
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('players.index');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

// Ensure Sanctum CSRF cookie endpoint is available
Route::middleware('web')->get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});