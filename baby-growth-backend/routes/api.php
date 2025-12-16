<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BabyController;

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

    // Routes futures (à développer)
    // Route::apiResource('babies.growth-records', GrowthRecordController::class);
    // Route::apiResource('babies.vaccinations', VaccinationController::class);
    // Route::apiResource('babies.medical-records', MedicalRecordController::class);
    // Route::apiResource('babies.meal-plans', MealPlanController::class);
});

// Fallback pour routes non trouvées
Route::fallback(function () {
    return response()->json([
        'error' => 'Route non trouvée',
        'message' => 'Vérifiez l\'URL de votre requête'
    ], 404);
});
