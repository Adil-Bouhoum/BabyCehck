<?php

namespace App\Observers;

use App\Models\Baby;
use App\Models\StandardVaccine;
use App\Models\Vaccination;
use Carbon\Carbon;

class BabyObserver
{
    /**
     * Handle the Baby "created" event.
     * Automatically creates the vaccination schedule for the baby
     */
    public function created(Baby $baby): void
    {
        $this->createVaccinationSchedule($baby);
    }

    /**
     * Create vaccination schedule for a baby based on their birth date
     * and the standard vaccines for their country
     */
    private function createVaccinationSchedule(Baby $baby): void
    {
        // Get all standard vaccines for Morocco
        $standardVaccines = StandardVaccine::where('is_mandatory', true)
            ->orWhere('is_mandatory', false)
            ->get();

        $vaccinationRecords = [];

        foreach ($standardVaccines as $vaccine) {
            // Only include vaccines applicable to Morocco
            if (!$vaccine->isApplicableInCountry('MA')) {
                continue;
            }

            // Generate entries for each dose
            for ($doseNum = 1; $doseNum <= $vaccine->doses; $doseNum++) {
                $recommendedDate = $this->calculateRecommendedDate($baby, $vaccine, $doseNum);

                $vaccinationRecords[] = [
                    'baby_id' => $baby->id,
                    'standard_vaccine_id' => $vaccine->id,
                    'vaccine_name' => $vaccine->display_name,
                    'vaccination_date' => null, // Not yet administered
                    'dose_number' => $doseNum,
                    'status' => 'scheduled',
                    'notes' => null,
                    'lot_number' => null,
                    'clinic' => null,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
        }

        // Insert all vaccination records in chunks to avoid memory issues
        if (!empty($vaccinationRecords)) {
            Vaccination::insert($vaccinationRecords);
        }
    }

    /**
     * Calculate the recommended date for a vaccine dose
     */
    private function calculateRecommendedDate(Baby $baby, StandardVaccine $vaccine, int $doseNumber): ?Carbon
    {
        // Skip if no recommended age is set
        if ($vaccine->recommended_age_months === null) {
            return null;
        }

        $baseDate = $baby->birth_date->copy()->addMonths($vaccine->recommended_age_months);

        // Add days between doses if applicable
        if ($doseNumber > 1 && $vaccine->days_between_doses) {
            $baseDate->addDays(($doseNumber - 1) * $vaccine->days_between_doses);
        }

        return $baseDate;
    }

    /**
     * Handle the Baby "updated" event.
     * (Optional) Add any logic needed when baby info is updated
     */
    public function updated(Baby $baby): void
    {
        // You could add logic here to recalculate vaccination dates
        // if birth date changes, for example
    }

    /**
     * Handle the Baby "deleted" event.
     * Cascade delete is handled by database, but you can add extra logic if needed
     */
    public function deleted(Baby $baby): void
    {
        // Vaccinations are automatically deleted via cascade delete
        // but you can add logging or other logic here if needed
    }
}
