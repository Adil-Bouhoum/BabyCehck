<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Register all seeders that should run
        $this->call([
            StandardVaccineSeeder::class,
            // Add other seeders here as needed
        ]);
    }
}
