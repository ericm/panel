<?php

namespace Pterodactyl\Providers;

use SocialiteProviders\Manager\SocialiteWasCalled;
use Pterodactyl\Events\Server\Installed as ServerInstalledEvent;
use Pterodactyl\Notifications\ServerInstalled as ServerInstalledNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        ServerInstalledEvent::class => [
            ServerInstalledNotification::class,
        ],
    ];


    public function boot() {
        parent::boot();

        // Add dynamic Socialite providers from settings
        if (!app('config')->get('pterodactyl.auth.oauth.enabled')) return;

        $drivers = json_decode(app('config')->get('pterodactyl.auth.oauth.drivers'), true);

        $listeners = [];

        foreach ($drivers as $driver => $options) {
            if (array_has($options, 'listener')) array_push($listeners, $options['listener']);
        }

        foreach (array_unique($listeners) as $listener) {
            app('events')->listen(SocialiteWasCalled::class, $listener);
        }
    }
}
