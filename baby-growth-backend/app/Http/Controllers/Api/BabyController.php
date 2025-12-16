<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BabyController extends Controller
{
    // Liste des bébés de l'utilisateur
    public function index(Request $request)
    {
        $babies = $request->user()->babies()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $babies
        ]);
    }

    // Ajouter un bébé
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'birth_date' => 'required|date|before:today',
            'gender' => 'required|in:male,female,other',
            'birth_weight' => 'nullable|numeric|min:0|max:10',
            'birth_height' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $baby = $request->user()->babies()->create([
            'name' => $request->name,
            'birth_date' => $request->birth_date,
            'gender' => $request->gender,
            'birth_weight' => $request->birth_weight,
            'birth_height' => $request->birth_height,
            'notes' => $request->notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bébé ajouté avec succès',
            'data' => $baby
        ], 201);
    }

    // Voir un bébé spécifique
    public function show(Request $request, Baby $baby)
    {
        // Vérifier que le bébé appartient à l'utilisateur
        if ($baby->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $baby
        ]);
    }

    // Mettre à jour un bébé
    public function update(Request $request, Baby $baby)
    {
        // Vérifier que le bébé appartient à l'utilisateur
        if ($baby->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'birth_date' => 'sometimes|required|date|before:today',
            'gender' => 'sometimes|required|in:male,female,other',
            'birth_weight' => 'nullable|numeric|min:0|max:10',
            'birth_height' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $baby->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Bébé mis à jour avec succès',
            'data' => $baby
        ]);
    }

    // Supprimer un bébé (et toutes ses données associées)
    public function destroy(Request $request, Baby $baby)
    {
        // Vérifier que le bébé appartient à l'utilisateur
        if ($baby->user_id !== $request->user()->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès non autorisé'
            ], 403);
        }

        // Les relations cascade dans la base supprimeront automatiquement
        // growth_records, vaccinations, medical_records, meal_plans
        $baby->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Bébé et toutes ses données supprimés avec succès'
        ]);
    }
}
