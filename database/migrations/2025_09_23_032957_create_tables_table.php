<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->id();
            // UBAH BARIS INI
            $table->foreignId('session_id')->constrained('game_sessions')->onDelete('cascade');
            $table->string('table_number');
            $table->decimal('duration_hours', 8, 2);
            $table->decimal('cost', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tables');
    }
};