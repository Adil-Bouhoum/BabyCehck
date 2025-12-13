<?php
// test.php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

echo "Laravel chargé: " . app()->version() . "\n";
echo "Fichier api.php existe: " . (file_exists(__DIR__ . '/routes/api.php') ? 'OUI' : 'NON') . "\n";

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::create('/api/test', 'GET')
);

echo "Status: " . $response->getStatusCode() . "\n";
echo "Contenu: " . $response->getContent() . "\n";
