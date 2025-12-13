<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API fonctionne!',
        'timestamp' => now()
    ]);
});

Route::fallback(function () {
    return response()->json(['error' => 'Route non trouvée'], 404);
});

// Authentification
Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

// Routes protégées (nécessitent un token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [App\Http\Controllers\Api\AuthController::class, 'user']);
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);

    // TEST route protégée
    Route::get('/protected-test', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'message' => 'Vous êtes authentifié!',
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->name
        ]);
    });
});
