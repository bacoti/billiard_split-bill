<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'name',
        'start_time', // Tambahkan
        'end_time',   // Tambahkan
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}
