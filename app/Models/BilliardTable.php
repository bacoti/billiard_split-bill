<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BilliardTable extends Model
{
    use HasFactory;

    // Eksplisit menunjuk ke tabel 'tables'
    protected $table = 'tables';

    protected $fillable = [
        'session_id',
        'table_number',
        'duration_hours',
        'cost',
    ];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }
}
