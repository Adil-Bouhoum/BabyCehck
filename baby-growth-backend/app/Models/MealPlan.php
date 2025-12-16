<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlan extends Model
{
    protected $fillable = [
        'baby_id',
        'meal_date',
        'meal_type',
        'food_name',
        'quantity',
        'notes'
    ];

    protected $casts = [
        'meal_date' => 'date'
    ];

    public function baby(): BelongsTo
    {
        return $this->belongsTo(Baby::class);
    }
}
