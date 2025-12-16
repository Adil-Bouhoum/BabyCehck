<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('growth_records', function (Blueprint $table) {
            // Supprimer si la table est vide
            Schema::dropIfExists('growth_records');
        });

        // Recréer avec la structure correcte
        Schema::create('growth_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('baby_id')->constrained()->onDelete('cascade');
            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 5, 2)->nullable();
            $table->decimal('head_circumference', 5, 2)->nullable();
            $table->date('measurement_date');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['baby_id', 'measurement_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('growth_records');
    }
};
