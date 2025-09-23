<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Memperbarui tabel game_sessions
        Schema::table('game_sessions', function (Blueprint $table) {
            // Kita ganti nama hourly_rate agar lebih jelas
            $table->renameColumn('hourly_rate', 'floor_hourly_rate'); 
            
            // Hapus kolom tax_percent lama
            $table->dropColumn('tax_percent');

            // Tambah kolom-kolom baru setelah floor_hourly_rate
            $table->decimal('pb1_percent', 5, 2)->default(0)->after('floor_hourly_rate');
            $table->decimal('service_percent', 5, 2)->default(0)->after('pb1_percent');
            $table->decimal('tip_amount', 15, 2)->default(0)->after('service_percent');
        });

        // Memperbarui tabel members
        Schema::table('members', function (Blueprint $table) {
            $table->time('start_time')->after('name');
            $table->time('end_time')->after('start_time');
        });
    }

    public function down(): void
    {
        // Logika untuk membatalkan perubahan (rollback)
        Schema::table('game_sessions', function (Blueprint $table) {
            $table->renameColumn('floor_hourly_rate', 'hourly_rate');
            $table->decimal('tax_percent', 5, 2)->default(10.00);
            $table->dropColumn(['pb1_percent', 'service_percent', 'tip_amount']);
        });

        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time']);
        });
    }
};