<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use App\Models\MealPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MealPlanController extends Controller
{
    // Récupérer tous les repas
    public function index(Baby $baby)
    {
        $mealPlans = $baby->mealPlans()
            ->orderBy('meal_date', 'desc')
            ->orderBy('meal_type', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $mealPlans
        ]);
    }

    // Ajouter un repas
    public function store(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'meal_date' => 'required|date',
            'meal_type' => 'required|in:breakfast,lunch,snack,dinner',
            'food_name' => 'required|string|max:200',
            'quantity' => 'nullable|string|max:50',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $mealPlan = $baby->mealPlans()->create([
            'meal_date' => $request->meal_date,
            'meal_type' => $request->meal_type,
            'food_name' => $request->food_name,
            'quantity' => $request->quantity,
            'notes' => $request->notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Repas ajouté avec succès',
            'data' => $mealPlan
        ], 201);
    }

    // Récupérer les repas d'une journée spécifique
    public function getByDate(Baby $baby, $date)
    {
        $validator = Validator::make(['date' => $date], [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Date invalide'
            ], 422);
        }

        $mealPlans = $baby->mealPlans()
            ->whereDate('meal_date', $date)
            ->orderBy('meal_type', 'asc')
            ->get();

        // Grouper par type de repas
        $grouped = [
            'breakfast' => [],
            'lunch' => [],
            'snack' => [],
            'dinner' => []
        ];

        foreach ($mealPlans as $meal) {
            $grouped[$meal->meal_type][] = $meal;
        }

        return response()->json([
            'status' => 'success',
            'date' => $date,
            'data' => $grouped
        ]);
    }

    // Mettre à jour un repas
    public function update(Request $request, Baby $baby, MealPlan $mealPlan)
    {
        if ($mealPlan->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ce repas ne correspond pas au bébé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'meal_date' => 'sometimes|required|date',
            'meal_type' => 'sometimes|required|in:breakfast,lunch,snack,dinner',
            'food_name' => 'sometimes|required|string|max:200',
            'quantity' => 'nullable|string|max:50',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $mealPlan->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Repas mis à jour avec succès',
            'data' => $mealPlan
        ]);
    }

    // Supprimer un repas
    public function destroy(Baby $baby, MealPlan $mealPlan)
    {
        if ($mealPlan->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ce repas ne correspond pas au bébé'
            ], 404);
        }

        $mealPlan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Repas supprimé avec succès'
        ]);
    }
}
