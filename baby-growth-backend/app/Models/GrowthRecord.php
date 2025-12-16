<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrowthRecord extends Model
{
    protected $fillable = [
        'baby_id',
        'weight',
        'height',
        'head_circumference',
        'measurement_date',
        'notes'
    ];

    protected $casts = [
        'measurement_date' => 'date',
        'weight' => 'decimal:2',
        'height' => 'decimal:2',
        'head_circumference' => 'decimal:2'
    ];

    public function baby(): BelongsTo
    {
        return $this->belongsTo(Baby::class);
    }
}
