<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\StandardVaccine;

class Vaccination extends Model
{
    protected $fillable = [
        'baby_id',
        'standard_vaccine_id',
        'vaccine_name',
        'vaccination_date',
        'due_date',
        'dose_number',
        'status',
        'notes',
        'lot_number',
        'clinic'
    ];

    protected $casts = [
        'vaccination_date' => 'date',
        'due_date' => 'date',
        'dose_number' => 'integer'
    ];

    /**
     * Relation avec le bébé.
     */
    public function baby(): BelongsTo
    {
        return $this->belongsTo(Baby::class);
    }

    /**
     * Relation avec le vaccin standard.
     */
    public function standardVaccine(): BelongsTo
    {
        return $this->belongsTo(StandardVaccine::class);
    }

    /**
     * Scope pour les vaccins standard.
     */
    public function scopeStandard($query)
    {
        return $query->whereNotNull('standard_vaccine_id');
    }

    /**
     * Scope pour les vaccins personnalisés.
     */
    public function scopeCustom($query)
    {
        return $query->whereNull('standard_vaccine_id');
    }

    /**
     * Scope pour les vaccins à venir.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'scheduled')
            ->where('due_date', '>=', now()->toDateString())
            ->orderBy('due_date', 'asc');
    }

    /**
     * Scope pour les vaccins en retard.
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', 'scheduled')
            ->where('due_date', '<', now()->toDateString())
            ->orderBy('due_date', 'asc');
    }

    /**
     * Scope pour les vaccins complétés.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Vérifier si c'est un vaccin personnalisé.
     */
    public function getIsCustomAttribute(): bool
    {
        return is_null($this->standard_vaccine_id);
    }

    /**
     * Obtenir le nom complet du vaccin.
     */
    public function getFullNameAttribute(): string
    {
        if ($this->is_custom) {
            return $this->vaccine_name;
        }

        $name = $this->standardVaccine->display_name ?? $this->vaccine_name;

        if ($this->standardVaccine && $this->standardVaccine->doses > 1) {
            $name .= " (Dose {$this->dose_number}/{$this->standardVaccine->doses})";
        }

        return $name;
    }

    /**
     * Vérifier si la vaccination est en retard.
     */
    public function getIsOverdueAttribute(): bool
    {
        return $this->status === 'scheduled' &&
            $this->due_date &&
            $this->due_date->isPast();
    }

    /**
     * Obtenir le nombre de jours de retard.
     */
    public function getDaysOverdueAttribute(): ?int
    {
        if ($this->is_overdue) {
            return now()->diffInDays($this->due_date);
        }

        return null;
    }
}
