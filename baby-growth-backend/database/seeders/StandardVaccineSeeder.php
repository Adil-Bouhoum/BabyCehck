<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StandardVaccineSeeder extends Seeder
{
    /**
     * Moroccan National Immunization Program (Programme d'Immunisation du Maroc)
     * Based on official MSPS recommendations
     */
    public function run(): void
    {
        $vaccines = [
            // Birth - 0 months
            [
                'name' => 'BCG',
                'display_name' => 'BCG (Tuberculose)',
                'description' => 'Vaccin contre la tuberculose. Administration recommandée à la naissance.',
                'recommended_age_months' => 0,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA', 'MOROCCO']),
                'disease_protected' => json_encode(['Tuberculose']),
                'side_effects' => json_encode(['Rougeur au site d\'injection', 'Petite cicatrice']),
                'notes' => 'À faire dans les 24-48 heures après la naissance',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'HepB_BIRTH',
                'display_name' => 'Hépatite B (Dose à la naissance)',
                'description' => 'Première dose du vaccin contre l\'hépatite B.',
                'recommended_age_months' => 0,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Hépatite B']),
                'side_effects' => json_encode(['Fièvre légère', 'Douleur au site d\'injection']),
                'notes' => 'Première dose avant 24 heures, idéalement',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 2 months
            [
                'name' => 'DTaP_IPV_HepB_Hib',
                'display_name' => 'Pentavalent (DTaP-IPV-HepB-Hib)',
                'description' => 'Diphtérie, Tétanos, Coqueluche, Poliomyélite, Hépatite B, Haemophilus influenzae b',
                'recommended_age_months' => 2,
                'doses' => 3,
                'days_between_doses' => 30,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Diphtérie', 'Tétanos', 'Coqueluche', 'Poliomyélite', 'Hépatite B', 'Haemophilus influenzae b']),
                'side_effects' => json_encode(['Fièvre', 'Rougeur', 'Gonflement au site d\'injection']),
                'notes' => 'Vaccin combiné principal du programme marocain',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'PCV13',
                'display_name' => 'Pneumocoque 13-valent (PCV13)',
                'description' => 'Protège contre les infections à pneumocoques (méningite, pneumonie, otite)',
                'recommended_age_months' => 2,
                'doses' => 3,
                'days_between_doses' => 30,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Pneumonie', 'Méningite', 'Otite']),
                'side_effects' => json_encode(['Fièvre', 'Irritabilité', 'Douleur au site d\'injection']),
                'notes' => 'Introduction récente dans le programme marocain',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'OPV',
                'display_name' => 'Polio (OPV)',
                'description' => 'Vaccin oral contre la poliomyélite',
                'recommended_age_months' => 2,
                'doses' => 4,
                'days_between_doses' => 30,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Poliomyélite']),
                'side_effects' => json_encode(['Diarrhée légère', 'Malaise']),
                'notes' => 'Vaccin complémentaire au DTaP-IPV',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'ROTAVIRUS',
                'display_name' => 'Rotavirus',
                'description' => 'Protège contre les gastro-entérites à rotavirus',
                'recommended_age_months' => 2,
                'doses' => 2,
                'days_between_doses' => 30,
                'is_mandatory' => false,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Gastro-entérite à rotavirus']),
                'side_effects' => json_encode(['Diarrhée légère', 'Douleur abdominale']),
                'notes' => 'Recommandé mais pas obligatoire',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 4 months (Rappels)
            [
                'name' => 'DTaP_IPV_HepB_Hib_4M',
                'display_name' => 'Pentavalent - Rappel 2 (4 mois)',
                'description' => 'Deuxième dose du vaccin pentavalent',
                'recommended_age_months' => 4,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Diphtérie', 'Tétanos', 'Coqueluche', 'Poliomyélite', 'Hépatite B', 'Haemophilus influenzae b']),
                'side_effects' => json_encode(['Fièvre', 'Rougeur', 'Gonflement']),
                'notes' => 'Généralement combinée avec PCV13',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'PCV13_4M',
                'display_name' => 'Pneumocoque - Rappel 2 (4 mois)',
                'description' => 'Deuxième dose du pneumocoque',
                'recommended_age_months' => 4,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Pneumonie', 'Méningite', 'Otite']),
                'side_effects' => json_encode(['Fièvre', 'Irritabilité', 'Douleur']),
                'notes' => 'Généralement combinée avec pentavalent',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 6 months
            [
                'name' => 'DTaP_IPV_HepB_Hib_6M',
                'display_name' => 'Pentavalent - Rappel 3 (6 mois)',
                'description' => 'Troisième dose du vaccin pentavalent',
                'recommended_age_months' => 6,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Diphtérie', 'Tétanos', 'Coqueluche', 'Poliomyélite', 'Hépatite B', 'Haemophilus influenzae b']),
                'side_effects' => json_encode(['Fièvre', 'Rougeur', 'Gonflement']),
                'notes' => 'Dernière dose du primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'PCV13_6M',
                'display_name' => 'Pneumocoque - Rappel 3 (6 mois)',
                'description' => 'Troisième dose du pneumocoque',
                'recommended_age_months' => 6,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Pneumonie', 'Méningite', 'Otite']),
                'side_effects' => json_encode(['Fièvre', 'Irritabilité', 'Douleur']),
                'notes' => 'Dernière dose du primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'OPV_6M',
                'display_name' => 'Polio - Rappel 3 (6 mois)',
                'description' => 'Troisième dose OPV',
                'recommended_age_months' => 6,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Poliomyélite']),
                'side_effects' => json_encode(['Diarrhée légère']),
                'notes' => 'Dernière dose du primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'ROTAVIRUS_6M',
                'display_name' => 'Rotavirus - Rappel 2 (6 mois)',
                'description' => 'Deuxième et dernière dose du rotavirus',
                'recommended_age_months' => 6,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => false,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Gastro-entérite']),
                'side_effects' => json_encode(['Diarrhée légère']),
                'notes' => 'À terminer avant 6 mois',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'HepB_6M',
                'display_name' => 'Hépatite B (6 mois)',
                'description' => 'Rappel d\'hépatite B à 6 mois',
                'recommended_age_months' => 6,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Hépatite B']),
                'side_effects' => json_encode(['Fièvre légère']),
                'notes' => 'Peut être incluse dans le pentavalent',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 12 months
            [
                'name' => 'ROR',
                'display_name' => 'ROR (Rougeole-Oreillons-Rubéole)',
                'description' => 'Vaccin combiné contre la rougeole, les oreillons et la rubéole',
                'recommended_age_months' => 12,
                'doses' => 2,
                'days_between_doses' => 365,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Rougeole', 'Oreillons', 'Rubéole']),
                'side_effects' => json_encode(['Fièvre', 'Éruption légère', 'Douleur au site d\'injection']),
                'notes' => 'Première dose à 12 mois, deuxième à 18 mois ou après',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'MENINGO_C',
                'display_name' => 'Méningocoque C',
                'description' => 'Protège contre la méningite à méningocoque C',
                'recommended_age_months' => 12,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Méningite C']),
                'side_effects' => json_encode(['Fièvre', 'Douleur au site d\'injection']),
                'notes' => 'Introduction récente',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'PCV13_BOOSTER',
                'display_name' => 'Pneumocoque - Rappel (12 mois)',
                'description' => 'Rappel du pneumocoque à 12 mois',
                'recommended_age_months' => 12,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Pneumonie', 'Méningite']),
                'side_effects' => json_encode(['Fièvre', 'Irritabilité']),
                'notes' => 'Rappel recommandé après le primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 18 months
            [
                'name' => 'DTaP_IPV_18M',
                'display_name' => 'Pentavalent - Rappel (18 mois)',
                'description' => 'Premier rappel du pentavalent',
                'recommended_age_months' => 18,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Diphtérie', 'Tétanos', 'Coqueluche', 'Poliomyélite', 'Hépatite B', 'Haemophilus']),
                'side_effects' => json_encode(['Fièvre', 'Rougeur', 'Gonflement']),
                'notes' => 'Premier rappel avant l\'âge de 2 ans',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'OPV_18M',
                'display_name' => 'Polio - Rappel (18 mois)',
                'description' => 'Rappel OPV à 18 mois',
                'recommended_age_months' => 18,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Poliomyélite']),
                'side_effects' => json_encode(['Diarrhée légère']),
                'notes' => 'Rappel du primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'ROR_BOOSTER',
                'display_name' => 'ROR - Deuxième dose (18 mois)',
                'description' => 'Deuxième dose du ROR',
                'recommended_age_months' => 18,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Rougeole', 'Oreillons', 'Rubéole']),
                'side_effects' => json_encode(['Fièvre', 'Éruption légère']),
                'notes' => 'Deuxième dose (intervalle minimum 1 mois après la 1ère)',
                'created_at' => now(),
                'updated_at' => now()
            ],

            // 6 years (School entry)
            [
                'name' => 'DT_SCHOOL',
                'display_name' => 'Diphtérie-Tétanos (6 ans)',
                'description' => 'Rappel diphtérie-tétanos avant l\'école',
                'recommended_age_months' => 72,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Diphtérie', 'Tétanos']),
                'side_effects' => json_encode(['Fièvre légère', 'Rougeur']),
                'notes' => 'À l\'entrée à l\'école primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'OPV_SCHOOL',
                'display_name' => 'Polio - Rappel (6 ans)',
                'description' => 'Rappel polio avant l\'école',
                'recommended_age_months' => 72,
                'doses' => 1,
                'days_between_doses' => null,
                'is_mandatory' => true,
                'countries' => json_encode(['MA']),
                'disease_protected' => json_encode(['Poliomyélite']),
                'side_effects' => json_encode(['Diarrhée légère']),
                'notes' => 'À l\'entrée à l\'école primaire',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ];

        DB::table('standard_vaccines')->insert($vaccines);
    }
}
