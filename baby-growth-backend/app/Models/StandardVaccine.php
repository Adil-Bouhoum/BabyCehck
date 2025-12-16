<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StandardVaccine extends Model
{
    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'recommended_age_months',
        'doses',
        'days_between_doses',
        'is_mandatory',
        'countries',
        'disease_protected',
        'side_effects',
        'notes'
    ];

    /**
     * Les attributs qui doivent être castés.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'recommended_age_months' => 'integer',
        'doses' => 'integer',
        'days_between_doses' => 'integer',
        'is_mandatory' => 'boolean',
        'countries' => 'array',
        'side_effects' => 'array'
    ];

    /**
     * Relation avec les vaccinations administrées.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    /**
     * Obtenir la date recommandée pour un bébé donné.
     *
     * @param \App\Models\Baby $baby
     * @param int $doseNumber
     * @return \Carbon\Carbon
     */
    public function getRecommendedDateForBaby(Baby $baby, int $doseNumber = 1): \Carbon\Carbon
    {
        $baseDate = $baby->birth_date->addMonths($this->recommended_age_months);

        if ($doseNumber > 1 && $this->days_between_doses) {
            $daysToAdd = ($doseNumber - 1) * $this->days_between_doses;
            return $baseDate->addDays($daysToAdd);
        }

        return $baseDate;
    }

    /**
     * Vérifier si le vaccin est applicable dans un pays donné.
     *
     * @param string $countryCode
     * @return bool
     */
    public function isApplicableInCountry(string $countryCode): bool
    {
        if (empty($this->countries)) {
            return true; // Si aucun pays spécifié, applicable partout
        }

        return in_array(strtoupper($countryCode), array_map('strtoupper', $this->countries));
    }

    /**
     * Obtenir le statut pour un bébé donné.
     *
     * @param \App\Models\Baby $baby
     * @return array
     */
    public function getStatusForBaby(Baby $baby): array
    {
        $babyVaccinations = $baby->vaccinations()
            ->where('standard_vaccine_id', $this->id)
            ->orderBy('dose_number')
            ->get();

        $completedDoses = $babyVaccinations->where('status', 'completed')->count();
        $isComplete = $completedDoses >= $this->doses;

        $nextDose = null;
        if (!$isComplete) {
            $nextDoseNumber = $completedDoses + 1;
            $nextRecommendedDate = $this->getRecommendedDateForBaby($baby, $nextDoseNumber);

            $nextDose = [
                'dose_number' => $nextDoseNumber,
                'recommended_date' => $nextRecommendedDate->format('Y-m-d'),
                'is_overdue' => $nextRecommendedDate->isPast()
            ];
        }

        return [
            'vaccine_id' => $this->id,
            'vaccine_name' => $this->display_name,
            'total_doses' => $this->doses,
            'completed_doses' => $completedDoses,
            'is_complete' => $isComplete,
            'is_mandatory' => $this->is_mandatory,
            'next_dose' => $nextDose,
            'administered_doses' => $babyVaccinations->map(function ($vax) {
                return [
                    'dose_number' => $vax->dose_number,
                    'date' => $vax->vaccination_date->format('Y-m-d'),
                    'status' => $vax->status
                ];
            })
        ];
    }

    /**
     * Scope pour les vaccins obligatoires.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeMandatory($query)
    {
        return $query->where('is_mandatory', true);
    }

    /**
     * Scope pour les vaccins recommandés.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRecommended($query)
    {
        return $query->where('is_mandatory', false);
    }

    /**
     * Scope pour les vaccins par âge maximum.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $maxAgeMonths
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByMaxAge($query, int $maxAgeMonths)
    {
        return $query->where('recommended_age_months', '<=', $maxAgeMonths);
    }

    /**
     * Obtenir l'âge recommandé formaté.
     *
     * @return string
     */
    public function getFormattedAgeAttribute(): string
    {
        if ($this->recommended_age_months == 0) {
            return 'À la naissance';
        } elseif ($this->recommended_age_months == 1) {
            return '1 mois';
        } elseif ($this->recommended_age_months < 12) {
            return $this->recommended_age_months . ' mois';
        } else {
            $years = floor($this->recommended_age_months / 12);
            $months = $this->recommended_age_months % 12;

            if ($months == 0) {
                return $years . ' an' . ($years > 1 ? 's' : '');
            } else {
                return $years . ' an' . ($years > 1 ? 's' : '') . ' et ' . $months . ' mois';
            }
        }
    }

    /**
     * Vérifier si le vaccin est en retard pour un bébé.
     *
     * @param \App\Models\Baby $baby
     * @return bool
     */
    public function isOverdueForBaby(Baby $baby): bool
    {
        $babyAgeMonths = $baby->birth_date->diffInMonths(now());

        // Si le bébé a dépassé l'âge recommandé
        if ($babyAgeMonths > $this->recommended_age_months) {
            // Vérifier s'il a reçu au moins une dose
            $hasVaccination = $baby->vaccinations()
                ->where('standard_vaccine_id', $this->id)
                ->exists();

            return !$hasVaccination;
        }

        return false;
    }

    /**
     * Obtenir le pourcentage de couverture vaccinale pour ce vaccin.
     *
     * @param \Illuminate\Database\Eloquent\Collection $babies
     * @return float
     */
    public function getCoverageRate($babies): float
    {
        if ($babies->isEmpty()) {
            return 0;
        }

        $vaccinatedCount = 0;
        foreach ($babies as $baby) {
            $doseCount = $baby->vaccinations()
                ->where('standard_vaccine_id', $this->id)
                ->where('status', 'completed')
                ->count();

            if ($doseCount >= $this->doses) {
                $vaccinatedCount++;
            }
        }

        return ($vaccinatedCount / $babies->count()) * 100;
    }
}
