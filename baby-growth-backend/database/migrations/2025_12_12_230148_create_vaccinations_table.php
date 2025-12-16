<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vaccinations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('baby_id')->constrained()->onDelete('cascade');
            $table->foreignId('standard_vaccine_id')->nullable()->constrained('standard_vaccines')->onDelete('set null');
            $table->string('vaccine_name');
            $table->integer('dose_number')->default(1);
            $table->date('vaccination_date');
            $table->date('due_date')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'overdue'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->string('lot_number')->nullable();
            $table->string('clinic')->nullable();
            $table->timestamps();

            $table->index(['baby_id', 'vaccination_date']);
            $table->index(['baby_id', 'status']);
            $table->index(['baby_id', 'standard_vaccine_id', 'dose_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccinations');
    }
};
