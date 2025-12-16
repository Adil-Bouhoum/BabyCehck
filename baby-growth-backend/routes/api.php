<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;
use App\Http\Controllers\Api\GrowthController;
use App\Http\Controllers\Api\VaccinationController;
use App\Http\Controllers\Api\MedicalRecordController;
use App\Http\Controllers\Api\MealPlanController;

// Route de test
Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API BabyCheck fonctionne!',
        'timestamp' => now()
    ]);
});

// Authentification (publiques)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par authentification
Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestion des bébés (CRUD)
    Route::apiResource('babies', BabyController::class);

    // Routes imbriquées pour chaque bébé
    Route::prefix('babies/{baby}')->group(function () {
        // Croissance (poids/taille/BMI)
        Route::apiResource('growth-records', GrowthController::class);
        Route::get('growth-records/stats/summary', [GrowthController::class, 'summary']);
        Route::get('growth-records/stats/bmi', [GrowthController::class, 'bmiHistory']);

        // Vaccinations
        Route::apiResource('vaccinations', VaccinationController::class);
        Route::get('vaccinations/calendar', [VaccinationController::class, 'calendar']);

        // Dossiers médicaux
        Route::apiResource('medical-records', MedicalRecordController::class);
        Route::get('medical-records/stats', [MedicalRecordController::class, 'stats']);

        // Planning repas
        Route::apiResource('meal-plans', MealPlanController::class);
        Route::get('meal-plans/day/{date}', [MealPlanController::class, 'getByDate']);
    });
});

// Fallback pour routes non trouvées
Route::fallback(function () {
    return response()->json([
        'error' => 'Route non trouvée',
        'message' => 'Vérifiez l\'URL de votre requête'
    ], 404);
});
