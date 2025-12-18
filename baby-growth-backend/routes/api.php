<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\GrowthController;
use App\Http\Controllers\Api\VaccinationController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\MealPlanController;

// Health check
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'BabyCheck API is running!',
        'timestamp' => now()
    ]);
});

// Public authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth endpoints
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Baby management
    Route::apiResource('babies', BabyController::class);

    // Nested routes for each baby
    Route::prefix('babies/{baby}')->group(function () {
        // Growth tracking
        Route::apiResource('growth-records', GrowthController::class);
        Route::get('growth-records/stats/summary', [GrowthController::class, 'summary']);
        Route::get('growth-records/stats/bmi', [GrowthController::class, 'bmiHistory']);

        // Vaccinations - Custom routes BEFORE resource to avoid conflicts
        Route::get('vaccinations/calendar', [VaccinationController::class, 'calendar']);
        Route::get('vaccinations/recommended', [VaccinationController::class, 'recommended']);
        Route::post('vaccinations/from-standard', [VaccinationController::class, 'addFromStandard']);
        Route::apiResource('vaccinations', VaccinationController::class);

        // Medical records
        Route::apiResource('medical-records', MedicalRecordController::class);
        Route::get('medical-records/stats', [MedicalRecordController::class, 'stats']);

        // Meal planning
        Route::apiResource('meal-plans', MealPlanController::class);
        Route::get('meal-plans/day/{date}', [MealPlanController::class, 'getByDate']);
    });
});

// 404 handler
Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'Route not found',
        'path' => request()->path()
    ], 404);
});
