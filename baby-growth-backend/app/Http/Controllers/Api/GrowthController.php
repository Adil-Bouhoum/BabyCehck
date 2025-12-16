<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use App\Models\GrowthRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GrowthController extends Controller
{
    // Récupérer toutes les mesures d'un bébé
    public function index(Baby $baby)
    {
        $records = $baby->growthRecords()
            ->orderBy('measurement_date', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $records
        ]);
    }

    // Ajouter une mesure
    public function store(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'weight' => 'required|numeric|min:0|max:30',
            'height' => 'required|numeric|min:0|max:150',
            'head_circumference' => 'nullable|numeric|min:0|max:60',
            'measurement_date' => 'required|date',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $record = $baby->growthRecords()->create([
            'weight' => $request->weight,
            'height' => $request->height,
            'head_circumference' => $request->head_circumference,
            'measurement_date' => $request->measurement_date,
            'notes' => $request->notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mesure ajoutée avec succès',
            'data' => $record
        ], 201);
    }

    // Voir une mesure spécifique
    public function show(Baby $baby, GrowthRecord $growthRecord)
    {
        if ($growthRecord->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette mesure ne correspond pas au bébé'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $growthRecord
        ]);
    }

    // Mettre à jour une mesure
    public function update(Request $request, Baby $baby, GrowthRecord $growthRecord)
    {
        if ($growthRecord->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette mesure ne correspond pas au bébé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'weight' => 'sometimes|required|numeric|min:0|max:30',
            'height' => 'sometimes|required|numeric|min:0|max:150',
            'head_circumference' => 'nullable|numeric|min:0|max:60',
            'measurement_date' => 'sometimes|required|date',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $growthRecord->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Mesure mise à jour avec succès',
            'data' => $growthRecord
        ]);
    }

    // Supprimer une mesure
    public function destroy(Baby $baby, GrowthRecord $growthRecord)
    {
        if ($growthRecord->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette mesure ne correspond pas au bébé'
            ], 404);
        }

        $growthRecord->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Mesure supprimée avec succès'
        ]);
    }

    // Statistiques de croissance
    public function summary(Baby $baby)
    {
        $latestRecord = $baby->growthRecords()
            ->orderBy('measurement_date', 'desc')
            ->first();

        $firstRecord = $baby->growthRecords()
            ->orderBy('measurement_date', 'asc')
            ->first();

        $weightGain = null;
        $heightGain = null;

        if ($firstRecord && $latestRecord && $firstRecord->id !== $latestRecord->id) {
            $daysDiff = $firstRecord->measurement_date->diffInDays($latestRecord->measurement_date);
            if ($daysDiff > 0) {
                $weightGain = ($latestRecord->weight - $firstRecord->weight) / ($daysDiff / 30.44); // kg par mois
                $heightGain = ($latestRecord->height - $firstRecord->height) / ($daysDiff / 30.44); // cm par mois
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'latest_measurement' => $latestRecord,
                'weight_gain_per_month' => $weightGain ? round($weightGain, 2) : null,
                'height_gain_per_month' => $heightGain ? round($heightGain, 2) : null,
                'total_measurements' => $baby->growthRecords()->count()
            ]
        ]);
    }

    // Historique BMI
    public function bmiHistory(Baby $baby)
    {
        $records = $baby->growthRecords()
            ->orderBy('measurement_date', 'asc')
            ->get()
            ->map(function ($record) use ($baby) {
                $bmi = null;
                if ($record->height > 0) {
                    // Convertir cm en mètres pour le calcul BMI
                    $heightInMeters = $record->height / 100;
                    $bmi = $record->weight / ($heightInMeters * $heightInMeters);
                }

                // Calcul de l'âge en mois au moment de la mesure
                $ageAtMeasurement = $baby->birth_date->diffInMonths($record->measurement_date);

                return [
                    'date' => $record->measurement_date,
                    'age_months' => $ageAtMeasurement,
                    'weight' => $record->weight,
                    'height' => $record->height,
                    'bmi' => $bmi ? round($bmi, 1) : null,
                    'notes' => $record->notes
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $records
        ]);
    }
}
