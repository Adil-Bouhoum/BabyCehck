<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Baby;
use App\Observers\BabyObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the BabyObserver to automatically create vaccination schedules
        Baby::observe(BabyObserver::class);
    }
}
