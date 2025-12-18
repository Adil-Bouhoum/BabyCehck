<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class StandardVaccine extends Model
{
    /**
     * Mass assignable attributes
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
     * Attribute casting
     */
    protected $casts = [
        'recommended_age_months' => 'integer',
        'doses' => 'integer',
        'days_between_doses' => 'integer',
        'is_mandatory' => 'boolean',
        'countries' => 'array',
        'disease_protected' => 'array',
        'side_effects' => 'array'
    ];

    /**
     * Relation with administrated vaccinations
     */
    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    /**
     * Check if vaccine is applicable in a given country
     */
    public function isApplicableInCountry(string $countryCode): bool
    {
        if (empty($this->countries)) {
            return true;
        }

        $countryCode = strtoupper($countryCode);
        return in_array($countryCode, array_map('strtoupper', $this->countries ?? []));
    }

    /**
     * Get recommended date for a baby and dose
     */
    public function getRecommendedDateForBaby(Baby $baby, int $doseNumber = 1): Carbon
    {
        $baseDate = $baby->birth_date->copy()->addMonths($this->recommended_age_months);

        if ($doseNumber > 1 && $this->days_between_doses) {
            $baseDate->addDays(($doseNumber - 1) * $this->days_between_doses);
        }

        return $baseDate;
    }

    /**
     * Get formatted recommended age
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
            $years = intdiv($this->recommended_age_months, 12);
            $months = $this->recommended_age_months % 12;

            if ($months == 0) {
                return $years . ' an' . ($years > 1 ? 's' : '');
            } else {
                return $years . ' an' . ($years > 1 ? 's' : '') . ' et ' . $months . ' mois';
            }
        }
    }

    /**
     * Check if vaccine is overdue for a baby
     */
    public function isOverdueForBaby(Baby $baby): bool
    {
        $babyAgeMonths = $baby->birth_date->diffInMonths(now());

        if ($babyAgeMonths > $this->recommended_age_months) {
            $hasVaccination = $baby->vaccinations()
                ->where('standard_vaccine_id', $this->id)
                ->where('status', 'completed')
                ->exists();

            return !$hasVaccination;
        }

        return false;
    }

    /**
     * Scope: Only mandatory vaccines
     */
    public function scopeMandatory($query)
    {
        return $query->where('is_mandatory', true);
    }

    /**
     * Scope: Only recommended vaccines
     */
    public function scopeRecommended($query)
    {
        return $query->where('is_mandatory', false);
    }

    /**
     * Scope: Vaccines by maximum age
     */
    public function scopeByMaxAge($query, int $maxAgeMonths)
    {
        return $query->where('recommended_age_months', '<=', $maxAgeMonths);
    }

    /**
     * Get coverage rate for multiple babies
     */
    public function getCoverageRate($babies): float
    {
        if ($babies->isEmpty()) {
            return 0;
        }

        $fullyVaccinatedCount = 0;

        foreach ($babies as $baby) {
            $completedDoses = $baby->vaccinations()
                ->where('standard_vaccine_id', $this->id)
                ->where('status', 'completed')
                ->count();

            if ($completedDoses >= $this->doses) {
                $fullyVaccinatedCount++;
            }
        }

        return ($fullyVaccinatedCount / $babies->count()) * 100;
    }
}
