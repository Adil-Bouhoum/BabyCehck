<?php

namespace App\Observers;

use App\Models\Baby;

class BabyObserver
{
    /**
     * Handle the Baby "created" event.
     */
    public function created(Baby $baby): void
    {
        //
    }

    /**
     * Handle the Baby "updated" event.
     */
    public function updated(Baby $baby): void
    {
        //
    }

    /**
     * Handle the Baby "deleted" event.
     */
    public function deleted(Baby $baby): void
    {
        //
    }

    /**
     * Handle the Baby "restored" event.
     */
    public function restored(Baby $baby): void
    {
        //
    }

    /**
     * Handle the Baby "force deleted" event.
     */
    public function forceDeleted(Baby $baby): void
    {
        //
    }
}
