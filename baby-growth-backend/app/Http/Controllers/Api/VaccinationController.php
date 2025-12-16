<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use App\Models\Vaccination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\StandardVaccine;
use Carbon\Carbon;


class VaccinationController extends Controller
{
    // Récupérer toutes les vaccinations d'un bébé
    public function index(Baby $baby)
    {
        $vaccinations = $baby->vaccinations()
            ->orderBy('vaccination_date', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $vaccinations
        ]);
    }

    // Ajouter une vaccination
    public function store(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'vaccine_name' => 'required|string|max:100',
            'vaccination_date' => 'required|date',
            'due_date' => 'nullable|date|after:vaccination_date',
            'status' => 'required|in:scheduled,completed,overdue',
            'notes' => 'nullable|string',
            'lot_number' => 'nullable|string|max:50',
            'clinic' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vaccination = $baby->vaccinations()->create([
            'vaccine_name' => $request->vaccine_name,
            'vaccination_date' => $request->vaccination_date,
            'due_date' => $request->due_date,
            'status' => $request->status,
            'notes' => $request->notes,
            'lot_number' => $request->lot_number,
            'clinic' => $request->clinic
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination ajoutée avec succès',
            'data' => $vaccination
        ], 201);
    }

    // Mettre à jour une vaccination
    public function update(Request $request, Baby $baby, Vaccination $vaccination)
    {
        // Vérifier que la vaccination appartient bien au bébé
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette vaccination ne correspond pas au bébé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'vaccine_name' => 'sometimes|required|string|max:100',
            'vaccination_date' => 'sometimes|required|date',
            'due_date' => 'nullable|date|after:vaccination_date',
            'status' => 'sometimes|required|in:scheduled,completed,overdue',
            'notes' => 'nullable|string',
            'lot_number' => 'nullable|string|max:50',
            'clinic' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $vaccination->update($request->only([
            'vaccine_name',
            'vaccination_date',
            'due_date',
            'status',
            'notes',
            'lot_number',
            'clinic'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination mise à jour avec succès',
            'data' => $vaccination
        ]);
    }

    // Supprimer une vaccination
    public function destroy(Baby $baby, Vaccination $vaccination)
    {
        // Vérifier que la vaccination appartient bien au bébé
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette vaccination ne correspond pas au bébé'
            ], 404);
        }

        $vaccination->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination supprimée avec succès'
        ]);
    }

    // Calendrier des vaccinations
    public function calendar(Baby $baby)
    {
        // 1. Récupérer tous les vaccins standard
        $standardVaccines = StandardVaccine::orderBy('recommended_age_months')->get();

        // 2. Récupérer les vaccins déjà administrés AVEC la relation
        $administeredVaccines = $baby->vaccinations()
            ->with('standardVaccine')
            ->get();

        // 3. Créer un tableau pour les doses administrées par vaccin standard
        $administeredByStandard = [];
        foreach ($administeredVaccines as $vax) {
            if ($vax->standard_vaccine_id) {
                if (!isset($administeredByStandard[$vax->standard_vaccine_id])) {
                    $administeredByStandard[$vax->standard_vaccine_id] = [];
                }
                $administeredByStandard[$vax->standard_vaccine_id][] = $vax;
            }
        }

        // 4. Générer le calendrier
        $calendar = [];
        $today = now();

        foreach ($standardVaccines as $standard) {
            $administered = $administeredByStandard[$standard->id] ?? [];
            $completedDoses = count($administered);

            // Pour chaque dose de ce vaccin
            for ($dose = 1; $dose <= $standard->doses; $dose++) {
                // Calculer la date recommandée
                $recommendedDate = $baby->birth_date->addMonths($standard->recommended_age_months);
                if ($standard->days_between_doses && $dose > 1) {
                    $recommendedDate = $recommendedDate->addDays(($dose - 1) * $standard->days_between_doses);
                }

                // Chercher si cette dose est déjà administrée
                $administeredDose = null;
                foreach ($administered as $vax) {
                    if ($vax->dose_number == $dose) {
                        $administeredDose = $vax;
                        break;
                    }
                }

                // Déterminer le statut
                if ($administeredDose) {
                    $status = 'completed';
                    $actualDate = $administeredDose->vaccination_date;
                } else {
                    if ($recommendedDate->isPast()) {
                        $status = 'overdue';
                    } else {
                        $status = 'scheduled';
                    }
                    $actualDate = null;
                }

                $calendar[] = [
                    'standard_vaccine_id' => $standard->id,
                    'vaccine_name' => $standard->display_name,
                    'dose_number' => $dose,
                    'total_doses' => $standard->doses,
                    'recommended_date' => $recommendedDate->format('Y-m-d'),
                    'status' => $status,
                    'actual_date' => $actualDate ? $actualDate->format('Y-m-d') : null,
                    'is_mandatory' => (bool)$standard->is_mandatory,
                    'description' => $standard->description,
                    'age_months' => $standard->recommended_age_months,
                    'is_custom' => false
                ];
            }
        }

        // 5. Ajouter les vaccins personnalisés
        $customVaccines = $baby->vaccinations()
            ->whereNull('standard_vaccine_id')
            ->get()
            ->map(function ($vaccine) {
                return [
                    'id' => $vaccine->id,
                    'vaccine_name' => $vaccine->vaccine_name,
                    'dose_number' => $vaccine->dose_number,
                    'total_doses' => 1,
                    'recommended_date' => $vaccine->due_date ? $vaccine->due_date->format('Y-m-d') : null,
                    'status' => $vaccine->status,
                    'actual_date' => $vaccine->vaccination_date ? $vaccine->vaccination_date->format('Y-m-d') : null,
                    'is_mandatory' => false,
                    'description' => 'Vaccin personnalisé',
                    'is_custom' => true
                ];
            })->toArray();

        $calendar = array_merge($calendar, $customVaccines);

        // Trier par date recommandée
        usort($calendar, function ($a, $b) {
            $dateA = $a['actual_date'] ?? $a['recommended_date'];
            $dateB = $b['actual_date'] ?? $b['recommended_date'];

            if (!$dateA && !$dateB) return 0;
            if (!$dateA) return 1;
            if (!$dateB) return -1;

            return strtotime($dateA) <=> strtotime($dateB);
        });

        return response()->json([
            'status' => 'success',
            'baby_name' => $baby->name,
            'baby_birth_date' => $baby->birth_date->format('Y-m-d'),
            'baby_age_months' => $baby->birth_date->diffInMonths($today),
            'calendar' => $calendar
        ]);
    }

    /**
     * Obtenir la liste des vaccins recommandés pour l'âge actuel
     */
    public function recommended(Baby $baby)
    {
        $ageMonths = $baby->birth_date->diffInMonths(Carbon::now());

        $recommended = StandardVaccine::where('recommended_age_months', '<=', $ageMonths)
            ->whereNotIn('id', function ($query) use ($baby) {
                $query->select('standard_vaccine_id')
                    ->from('vaccinations')
                    ->where('baby_id', $baby->id)
                    ->whereNotNull('standard_vaccine_id');
            })
            ->orderBy('recommended_age_months')
            ->get();

        return response()->json([
            'status' => 'success',
            'age_months' => $ageMonths,
            'recommended_vaccines' => $recommended
        ]);
    }

    /**
     * Ajouter un vaccin depuis la liste standard
     */
    public function addFromStandard(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'standard_vaccine_id' => 'required|exists:standard_vaccines,id',
            'vaccination_date' => 'required|date',
            'dose_number' => 'required|integer|min:1',
            'notes' => 'nullable|string',
            'lot_number' => 'nullable|string|max:50',
            'clinic' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $standard = StandardVaccine::find($request->standard_vaccine_id);

        // Vérifier que la dose est valide
        if ($request->dose_number > $standard->doses) {
            return response()->json([
                'status' => 'error',
                'message' => 'Numéro de dose invalide pour ce vaccin'
            ], 422);
        }

        $vaccination = $baby->vaccinations()->create([
            'standard_vaccine_id' => $request->standard_vaccine_id,
            'vaccine_name' => $standard->display_name,
            'vaccination_date' => $request->vaccination_date,
            'due_date' => null, // Pas besoin pour les vaccins standard administrés
            'dose_number' => $request->dose_number,
            'status' => 'completed',
            'notes' => $request->notes,
            'lot_number' => $request->lot_number,
            'clinic' => $request->clinic
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccin ajouté avec succès',
            'data' => $vaccination
        ], 201);
    }
}
