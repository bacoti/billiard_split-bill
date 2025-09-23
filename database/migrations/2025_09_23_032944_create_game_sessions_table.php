<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // UBAH BARIS INI
        Schema::create('game_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('hourly_rate', 15, 2);
            $table->decimal('tax_percent', 5, 2)->default(10.00);
            $table->decimal('service_charge', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // UBAH BARIS INI JUGA
        Schema::dropIfExists('game_sessions');
    }
};