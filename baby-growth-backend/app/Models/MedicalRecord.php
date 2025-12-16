<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicalRecord extends Model
{
    /**
     * Les attributs qui sont assignables en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'baby_id',
        'condition',
        'diagnosis_date',
        'record_date',
        'medication',
        'dosage',
        'notes',
        'status'
    ];

    /**
     * Les attributs qui doivent être castés.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'diagnosis_date' => 'date',
    ];

    /**
     * Relation avec le bébé.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function baby(): BelongsTo
    {
        return $this->belongsTo(Baby::class);
    }

    /**
     * Scope pour les conditions actives.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope pour les conditions résolues.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    /**
     * Scope pour les conditions chroniques.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeChronic($query)
    {
        return $query->where('status', 'chronic');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Si record_date n'est pas défini, utiliser diagnosis_date
            if (empty($model->record_date)) {
                $model->record_date = $model->diagnosis_date;
            }
        });
    }

    /**
     * Vérifier si la condition est active.
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
