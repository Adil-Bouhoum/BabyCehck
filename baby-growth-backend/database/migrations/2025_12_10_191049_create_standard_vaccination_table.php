<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('standard_vaccines', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Code court: "BCG", "DTaP-IPV-Hib-HepB"
            $table->string('display_name'); // Nom complet: "Vaccin BCG (Tuberculose)"
            $table->text('description')->nullable();
            $table->integer('recommended_age_months'); // Âge recommandé en mois
            $table->integer('doses')->default(1); // Nombre de doses
            $table->integer('days_between_doses')->nullable(); // Jours entre doses
            $table->boolean('is_mandatory')->default(true); // Obligatoire ou recommandé
            $table->json('countries')->nullable(); // Pays où applicable
            $table->string('disease_protected')->nullable(); // Maladies protégées
            $table->json('side_effects')->nullable(); // Effets secondaires courants
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('recommended_age_months');
            $table->index('is_mandatory');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('standard_vaccines');
    }
};
