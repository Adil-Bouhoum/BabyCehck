<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // For MySQL
        Schema::table('vaccinations', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'completed', 'overdue', 'cancelled'])
                ->default('scheduled')
                ->change();
        });
    }

    public function down(): void
    {
        Schema::table('vaccinations', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'completed', 'overdue'])
                ->default('scheduled')
                ->change();
        });
    }
};
