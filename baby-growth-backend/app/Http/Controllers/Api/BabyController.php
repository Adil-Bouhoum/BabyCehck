<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BabyController extends Controller
{
    // Liste des bébés de l'utilisateur connecté
    public function index(Request $request)
    {
        $babies = $request->user()->babies()
            ->with(['growthRecords' => function ($query) {
                $query->latest('measurement_date')->take(1);
            }])
            ->orderBy('birth_date', 'desc')
            ->get();

        // Ajouter les infos calculées
        $babies->each(function ($baby) {
            $baby->age_months = $baby->age_in_months;
            $baby->formatted_age = $baby->formatted_age;
            $baby->latest_weight = $baby->latest_weight;
            $baby->latest_height = $baby->latest_height;
        });

        return response()->json([
            'status' => 'success',
            'babies' => $babies
        ]);
    }

    // Détails d'un bébé
    public function show(Request $request, $id)
    {
        $baby = $request->user()->babies()->findOrFail($id);

        // Charger toutes les relations
        $baby->load([
            'growthRecords' => function ($query) {
                $query->orderBy('measurement_date', 'desc');
            },
            'vaccinations' => function ($query) {
                $query->orderBy('vaccination_date', 'desc');
            },
            'medicalRecords' => function ($query) {
                $query->orderBy('record_date', 'desc');
            },
            'mealPlans' => function ($query) {
                $query->orderBy('meal_date', 'desc');
            }
        ]);

        // Ajouter infos calculées
        $baby->age_months = $baby->age_in_months;
        $baby->age_days = $baby->age_in_days;
        $baby->formatted_age = $baby->formatted_age;
        $baby->latest_weight = $baby->latest_weight;
        $baby->latest_height = $baby->latest_height;

        return response()->json([
            'status' => 'success',
            'baby' => $baby
        ]);
    }

    // Ajouter un bébé
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'birth_date' => 'required|date|before_or_equal:today',
            'birth_weight' => 'nullable|numeric|min:0|max:10',
            'birth_height' => 'nullable|numeric|min:0|max:100',
            'photo' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $baby = $request->user()->babies()->create($validator->validated());

        // Créer un enregistrement de croissance initial si poids/taille fournis
        if ($request->birth_weight || $request->birth_height) {
            $baby->growthRecords()->create([
                'measurement_date' => $request->birth_date,
                'weight' => $request->birth_weight ?? 0,
                'height' => $request->birth_height ?? 0,
                'notes' => 'Mesures à la naissance'
            ]);
        }

        $baby->age_months = $baby->age_in_months;
        $baby->formatted_age = $baby->formatted_age;

        return response()->json([
            'status' => 'success',
            'message' => 'Bébé ajouté avec succès',
            'baby' => $baby
        ], 201);
    }

    // Modifier un bébé
    public function update(Request $request, $id)
    {
        $baby = $request->user()->babies()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'gender' => 'sometimes|required|in:male,female,other',
            'birth_date' => 'sometimes|required|date|before_or_equal:today',
            'birth_weight' => 'nullable|numeric|min:0|max:10',
            'birth_height' => 'nullable|numeric|min:0|max:100',
            'photo' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $baby->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Bébé modifié avec succès',
            'baby' => $baby
        ]);
    }

    // Supprimer un bébé
    public function destroy(Request $request, $id)
    {
        $baby = $request->user()->babies()->findOrFail($id);
        $babyName = $baby->name;

        $baby->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Bébé \"$babyName\" supprimé avec succès"
        ]);
    }
}
