<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Baby extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'gender',
        'birth_date',
        'photo',
        'birth_weight',
        'birth_height',
        'notes'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'birth_weight' => 'decimal:2',
        'birth_height' => 'decimal:2'
    ];

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function growthRecords(): HasMany
    {
        return $this->hasMany(GrowthRecord::class);
    }

    public function vaccinations(): HasMany
    {
        return $this->hasMany(Vaccination::class);
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function mealPlans(): HasMany
    {
        return $this->hasMany(MealPlan::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(Milestone::class);
    }

    // Accesseurs (helpers)
    public function getAgeInMonthsAttribute(): int
    {
        return $this->birth_date->diffInMonths(Carbon::now());
    }

    public function getAgeInDaysAttribute(): int
    {
        return $this->birth_date->diffInDays(Carbon::now());
    }

    public function getFormattedAgeAttribute(): string
    {
        $months = $this->age_in_months;
        $years = floor($months / 12);
        $remainingMonths = $months % 12;

        if ($years > 0) {
            return $years . ' an' . ($years > 1 ? 's' : '') .
                ($remainingMonths > 0 ? ' et ' . $remainingMonths . ' mois' : '');
        }

        return $months . ' mois';
    }

    // Dernier poids enregistré
    public function getLatestWeightAttribute()
    {
        return $this->growthRecords()->latest('measurement_date')->first()?->weight;
    }

    // Dernière taille enregistrée
    public function getLatestHeightAttribute()
    {
        return $this->growthRecords()->latest('measurement_date')->first()?->height;
    }
}
