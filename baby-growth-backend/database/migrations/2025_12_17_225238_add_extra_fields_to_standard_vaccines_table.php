<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('standard_vaccines', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('standard_vaccines', 'disease_protected')) {
                $table->json('disease_protected')->nullable()->after('countries');
            }

            if (!Schema::hasColumn('standard_vaccines', 'side_effects')) {
                $table->json('side_effects')->nullable()->after('disease_protected');
            }

            if (!Schema::hasColumn('standard_vaccines', 'notes')) {
                $table->text('notes')->nullable()->after('side_effects');
            }
        });
    }

    public function down(): void
    {
        Schema::table('standard_vaccines', function (Blueprint $table) {
            $table->dropColumn(['disease_protected', 'side_effects', 'notes']);
        });
    }
};
