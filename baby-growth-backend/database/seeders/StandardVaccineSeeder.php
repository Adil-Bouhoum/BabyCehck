<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StandardVaccineSeeder extends Seeder
{
    public function run(): void
    {
        $vaccines = [
            // Vaccins recommandés en France
            [
                'name' => 'BCG',
                'display_name' => 'Vaccin BCG (Tuberculose)',
                'description' => 'Recommandé pour les enfants à risque élevé de tuberculose',
                'recommended_age_months' => 0,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => false,
                'countries' => json_encode(['FR', 'BE']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'DTaP-IPV-Hib-HepB',
                'display_name' => 'Vaccin hexavalent (6-en-1)',
                'description' => 'Diphtérie, Tétanos, Coqueluche, Poliomyélite, Haemophilus influenzae b, Hépatite B',
                'recommended_age_months' => 2,
                'doses' => 3,
                'days_between_doses' => 30,
                'is_mandatory' => true,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'PCV13',
                'display_name' => 'Vaccin pneumococcique',
                'description' => 'Protège contre les infections à pneumocoques (méningite, pneumonie)',
                'recommended_age_months' => 2,
                'doses' => 3,
                'days_between_doses' => 30,
                'is_mandatory' => true,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'ROTAVIRUS',
                'display_name' => 'Vaccin contre le rotavirus',
                'description' => 'Protège contre les gastro-entérites à rotavirus',
                'recommended_age_months' => 2,
                'doses' => 2,
                'days_between_doses' => 30,
                'is_mandatory' => false,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'MENINGO_B',
                'display_name' => 'Vaccin méningocoque B',
                'description' => 'Protège contre la méningite à méningocoque B',
                'recommended_age_months' => 2,
                'doses' => 3,
                'days_between_doses' => 60,
                'is_mandatory' => false,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'ROR',
                'display_name' => 'Vaccin ROR (Rougeole-Oreillons-Rubéole)',
                'description' => 'Vaccin combiné contre la rougeole, les oreillons et la rubéole',
                'recommended_age_months' => 12,
                'doses' => 2,
                'days_between_doses' => 365,
                'is_mandatory' => true,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'MENINGO_C',
                'display_name' => 'Vaccin méningocoque C',
                'description' => 'Protège contre la méningite à méningocoque C',
                'recommended_age_months' => 12,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['FR']),
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        DB::table('standard_vaccines')->insert($vaccines);
    }
}
