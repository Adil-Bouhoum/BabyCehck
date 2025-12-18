<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Baby;
use App\Models\Vaccination;
use App\Models\StandardVaccine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VaccinationController extends Controller
{
    /**
     * Get all vaccinations for a baby
     */
    public function index(Baby $baby)
    {
        $vaccinations = $baby->vaccinations()
            ->with('standardVaccine')
            ->orderBy('vaccination_date', 'desc')
            ->get()
            ->map(function ($vax) {
                return $this->formatVaccination($vax);
            });

        return response()->json([
            'status' => 'success',
            'data' => $vaccinations
        ]);
    }

    /**
     * Create a custom vaccination
     */
    public function store(Request $request, Baby $baby)
    {
        $validator = Validator::make($request->all(), [
            'vaccine_name' => 'required|string|max:100',
            'vaccination_date' => 'required|date',
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
            'dose_number' => 1,
            'status' => 'completed',
            'notes' => $request->notes,
            'lot_number' => $request->lot_number,
            'clinic' => $request->clinic,
            'standard_vaccine_id' => null // Custom vaccination
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination added successfully',
            'data' => $this->formatVaccination($vaccination)
        ], 201);
    }

    /**
     * Update a vaccination
     */
    public function update(Request $request, Baby $baby, Vaccination $vaccination)
    {
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vaccination does not belong to this baby'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'vaccine_name' => 'sometimes|required|string|max:100',
            'vaccination_date' => 'sometimes|required|date',
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
            'notes',
            'lot_number',
            'clinic'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination updated successfully',
            'data' => $this->formatVaccination($vaccination)
        ]);
    }

    /**
     * Show a single vaccination
     */
    public function show(Baby $baby, Vaccination $vaccination)
    {
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vaccination does not belong to this baby'
            ], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $this->formatVaccination($vaccination->load('standardVaccine'))
        ]);
    }

    /**
     * Delete a vaccination
     */
    public function destroy(Baby $baby, Vaccination $vaccination)
    {
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vaccination does not belong to this baby'
            ], 403);
        }

        $vaccination->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination deleted successfully'
        ]);
    }

    /**
     * Get vaccination calendar with all planned and administered doses
     */
    public function calendar(Baby $baby)
    {
        $babyAgeMonths = $baby->birth_date->diffInMonths(now());
        $standardVaccines = StandardVaccine::orderBy('recommended_age_months')->get();
        $administeredVaccines = $baby->vaccinations()
            ->whereNotNull('standard_vaccine_id')
            ->get()
            ->groupBy('standard_vaccine_id');

        $calendar = [];

        // Generate calendar entries for each standard vaccine
        foreach ($standardVaccines as $vaccine) {
            $administeredDoses = $administeredVaccines[$vaccine->id] ?? collect();

            for ($doseNum = 1; $doseNum <= $vaccine->doses; $doseNum++) {
                $recommendedDate = $this->calculateRecommendedDate($baby, $vaccine, $doseNum);
                // Find the vaccination record for this dose
                $administered = $administeredDoses->firstWhere('dose_number', $doseNum);

                if ($administered) {
                    // Use the actual status from the database
                    $status = $administered->status;
                } else {
                    $status = $recommendedDate->isPast() ? 'overdue' : 'scheduled';
                }

                $calendar[] = [
                    'id' => $administered?->id,  // This will be the Vaccination model's ID if it exists
                    'vaccine_id' => $vaccine->id,
                    'vaccine_name' => $vaccine->display_name,
                    'description' => $vaccine->description,
                    'dose_number' => $doseNum,
                    'total_doses' => $vaccine->doses,
                    'recommended_date' => $recommendedDate->format('Y-m-d'),
                    'vaccination_date' => $administered?->vaccination_date?->format('Y-m-d'),
                    'status' => $status,
                    'is_mandatory' => (bool) $vaccine->is_mandatory,
                    'is_custom' => false,
                    'notes' => $administered?->notes,
                    'lot_number' => $administered?->lot_number,
                    'clinic' => $administered?->clinic,
                    'standard_vaccine_id' => $vaccine->id  // Include for reference
                ];
            }
        }

        // Add custom vaccinations
        $customVaccines = $baby->vaccinations()
            ->whereNull('standard_vaccine_id')
            ->get();

        foreach ($customVaccines as $vaccine) {
            $calendar[] = [
                'id' => $vaccine->id,
                'vaccine_id' => null,
                'vaccine_name' => $vaccine->vaccine_name,
                'description' => null,
                'dose_number' => 1,
                'total_doses' => 1,
                'recommended_date' => null,
                'vaccination_date' => $vaccine->vaccination_date->format('Y-m-d'),
                'status' => $vaccine->status,
                'is_mandatory' => false,
                'is_custom' => true,
                'notes' => $vaccine->notes,
                'lot_number' => $vaccine->lot_number,
                'clinic' => $vaccine->clinic
            ];
        }

        // Sort by date (vaccination date if exists, otherwise recommended date)
        usort($calendar, function ($a, $b) {
            $dateA = $a['vaccination_date'] ?? $a['recommended_date'];
            $dateB = $b['vaccination_date'] ?? $b['recommended_date'];

            if (!$dateA || !$dateB) return 0;
            return strtotime($dateA) <=> strtotime($dateB);
        });

        return response()->json([
            'status' => 'success',
            'baby_name' => $baby->name,
            'baby_birth_date' => $baby->birth_date->format('Y-m-d'),
            'baby_age_months' => $babyAgeMonths,
            'calendar' => $calendar
        ]);
    }

    /**
     * Get recommended vaccinations for the baby's current age
     */
    public function recommended(Baby $baby)
    {
        $ageMonths = $baby->birth_date->diffInMonths(now());

        // Get vaccines that should have been done by now but haven't been
        $recommended = StandardVaccine::where('recommended_age_months', '<=', $ageMonths)
            ->get()
            ->filter(function ($vaccine) use ($baby) {
                // Check if all doses have been completed
                $administeredDoses = $baby->vaccinations()
                    ->where('standard_vaccine_id', $vaccine->id)
                    ->where('status', 'completed')
                    ->count();

                return $administeredDoses < $vaccine->doses;
            })
            ->values();

        return response()->json([
            'status' => 'success',
            'baby_age_months' => $ageMonths,
            'recommended' => $recommended,
            'data' => $recommended
        ]);
    }

    /**
     * Add a standard vaccine dose
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

        // Validate dose number
        if ($request->dose_number > $standard->doses) {
            return response()->json([
                'status' => 'error',
                'message' => "Invalid dose number. This vaccine requires {$standard->doses} dose(s)."
            ], 422);
        }

        // Check if this dose was already administered
        $existing = $baby->vaccinations()
            ->where('standard_vaccine_id', $standard->id)
            ->where('dose_number', $request->dose_number)
            ->first();

        if ($existing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dose ' . $request->dose_number . ' for this vaccine is already recorded.'
            ], 422);
        }

        $vaccination = $baby->vaccinations()->create([
            'standard_vaccine_id' => $standard->id,
            'vaccine_name' => $standard->display_name,
            'vaccination_date' => $request->vaccination_date,
            'dose_number' => $request->dose_number,
            'status' => 'completed',
            'notes' => $request->notes,
            'lot_number' => $request->lot_number,
            'clinic' => $request->clinic
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination recorded successfully',
            'data' => $this->formatVaccination($vaccination->load('standardVaccine'))
        ], 201);
    }

    /**
     * Calculate recommended date for a vaccine dose
     */
    private function calculateRecommendedDate(Baby $baby, StandardVaccine $vaccine, int $doseNumber): Carbon
    {
        $baseDate = $baby->birth_date->copy()->addMonths($vaccine->recommended_age_months);

        if ($doseNumber > 1 && $vaccine->days_between_doses) {
            $baseDate->addDays(($doseNumber - 1) * $vaccine->days_between_doses);
        }

        return $baseDate;
    }

    /**
     * Format vaccination for API response
     */
    private function formatVaccination(Vaccination $vax): array
    {
        $data = [
            'id' => $vax->id,
            'vaccine_name' => $vax->vaccine_name,
            'vaccination_date' => $vax->vaccination_date->format('Y-m-d'),
            'dose_number' => $vax->dose_number,
            'status' => $vax->status,
            'notes' => $vax->notes,
            'lot_number' => $vax->lot_number,
            'clinic' => $vax->clinic,
            'is_custom' => is_null($vax->standard_vaccine_id),
        ];

        if ($vax->standardVaccine) {
            $data['is_custom'] = false;
            $data['vaccine_id'] = $vax->standardVaccine->id;
            $data['total_doses'] = $vax->standardVaccine->doses;
            $data['is_mandatory'] = $vax->standardVaccine->is_mandatory;
            $data['full_name'] = "{$vax->vaccine_name} (Dose {$vax->dose_number}/{$vax->standardVaccine->doses})";
        } else {
            $data['total_doses'] = 1;
            $data['is_mandatory'] = false;
            $data['full_name'] = $vax->vaccine_name;
        }

        return $data;
    }

    /**
     * Update vaccination status
     */
    public function updateStatus(Request $request, Baby $baby, Vaccination $vaccination)
    {
        // Vérification d'appartenance
        if ($vaccination->baby_id !== $baby->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vaccination does not belong to this baby'
            ], 403);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:scheduled,completed,cancelled',
            'vaccination_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Préparation des données de mise à jour
        $updateData = ['status' => $request->status];

        // Gestion des dates selon le statut
        if ($request->has('vaccination_date') && $request->vaccination_date) {
            $updateData['vaccination_date'] = $request->vaccination_date;
        }

        if ($request->has('due_date') && $request->due_date) {
            $updateData['due_date'] = $request->due_date;
        }

        // Ajouter les notes si fournies
        if ($request->has('notes')) {
            $updateData['notes'] = $request->notes;
        }

        // Mise à jour
        $vaccination->update($updateData);

        // Recharger avec les relations
        $vaccination->load('standardVaccine');

        return response()->json([
            'status' => 'success',
            'message' => 'Vaccination status updated successfully',
            'data' => $this->formatVaccination($vaccination)
        ]);
    }
}
