<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameSession extends Model
{
    use HasFactory;

    protected $table = 'game_sessions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'rental_fee',
        'pb1_percent',
        'service_percent',
        'tip_amount',
        'service_charge',
        'discount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    // ==================================================================
    // == INI ADALAH BAGIAN KUNCI YANG HILANG DAN SEKARANG DITAMBAHKAN ==
    // ==================================================================
    protected $casts = [
        'rental_fee' => 'decimal:2',
        'pb1_percent' => 'decimal:2',
        'service_percent' => 'decimal:2',
        'tip_amount' => 'decimal:2',
        'service_charge' => 'decimal:2',
        'discount' => 'decimal:2',
    ];

    /**
     * Relasi ke User (pemilik sesi).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke Member (pemain dalam sesi ini).
     */
    public function members()
    {
        return $this->hasMany(Member::class, 'session_id');
    }
}