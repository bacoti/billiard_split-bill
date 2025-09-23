<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// UBAH NAMA CLASS
class GameSession extends Model
{
    use HasFactory;

    // TAMBAHKAN BARIS INI UNTUK MENUNJUK KE NAMA TABEL BARU
    protected $table = 'game_sessions';

    protected $fillable = [
        'user_id',
        'name',
        'rental_fee', // Ganti nama
        'pb1_percent',       // Tambahkan
        'service_percent',   // Tambahkan
        'tip_amount',        // Tambahkan
        'service_charge',
        'discount',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function billiardTables()
    {
        // Ganti 'session_id' menjadi 'game_session_id' jika Anda mengubah nama kolomnya
        return $this->hasMany(BilliardTable::class, 'session_id'); 
    }

    public function members()
    {
         // Ganti 'session_id' menjadi 'game_session_id' jika Anda mengubah nama kolomnya
        return $this->hasMany(Member::class, 'session_id');
    }
}