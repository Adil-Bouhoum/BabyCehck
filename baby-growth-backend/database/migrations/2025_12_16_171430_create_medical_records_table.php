<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('baby_id')->constrained()->onDelete('cascade');
            $table->string('condition'); // Maladie/condition médicale
            $table->date('diagnosis_date');
            $table->string('medication')->nullable(); // Médicament prescrit
            $table->string('dosage')->nullable(); // Posologie
            $table->text('notes')->nullable();
            $table->enum('status', ['active', 'resolved', 'chronic'])->default('active');
            $table->timestamps();

            $table->index(['baby_id', 'diagnosis_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_records');
    }
};
