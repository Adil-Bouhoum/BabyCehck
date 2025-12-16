<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MedicalRecordController extends Controller
{
    /**
     * Récupérer tous les dossiers médicaux d'un bébé.
     *
     * @param \App\Models\Baby $baby
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Baby $baby)
    {
        $records = $baby->medicalRecords()
            ->orderBy('diagnosis_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $records
        ]);
    }

    /**
     * Ajouter un dossier médical.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Baby $baby
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'condition' => 'required|string|max:200',
            'diagnosis_date' => 'required|date|before_or_equal:today',
            'medication' => 'nullable|string|max:200',
            'dosage' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,resolved,chronic'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $record = $baby->medicalRecords()->create([
                'condition' => $request->condition,
                'diagnosis_date' => $request->diagnosis_date,
                'medication' => $request->medication,
                'dosage' => $request->dosage,
                'notes' => $request->notes,
                'status' => $request->status
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier médical ajouté avec succès',
                'data' => $record
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'ajout du dossier médical',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour un dossier médical.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Baby $baby
     * @param \App\Models\MedicalRecord $medicalRecord
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Baby $baby, MedicalRecord $medicalRecord)
    {
        // Vérifier que le dossier médical appartient bien au bébé
        if ($medicalRecord->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ce dossier médical ne correspond pas au bébé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'condition' => 'sometimes|required|string|max:200',
            'diagnosis_date' => 'sometimes|required|date|before_or_equal:today',
            'medication' => 'nullable|string|max:200',
            'dosage' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'status' => 'sometimes|required|in:active,resolved,chronic'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $medicalRecord->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier médical mis à jour avec succès',
                'data' => $medicalRecord
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la mise à jour du dossier médical',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un dossier médical.
     *
     * @param \App\Models\Baby $baby
     * @param \App\Models\MedicalRecord $medicalRecord
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Baby $baby, MedicalRecord $medicalRecord)
    {
        // Vérifier que le dossier médical appartient bien au bébé
        if ($medicalRecord->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ce dossier médical ne correspond pas au bébé'
            ], 404);
        }

        try {
            $medicalRecord->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Dossier médical supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la suppression du dossier médical',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les statistiques médicales.
     *
     * @param \App\Models\Baby $baby
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Baby $baby)
    {
        $stats = [
            'total' => $baby->medicalRecords()->count(),
            'active' => $baby->medicalRecords()->active()->count(),
            'resolved' => $baby->medicalRecords()->resolved()->count(),
            'chronic' => $baby->medicalRecords()->chronic()->count(),
            'with_medication' => $baby->medicalRecords()->whereNotNull('medication')->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}
