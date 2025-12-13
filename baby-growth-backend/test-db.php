<?php
require __DIR__ . '/vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'database' => 'baby_growth_db', // ton nom de DB
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8',
    'collation' => 'utf8_unicode_ci',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    // Test 1: Connexion DB
    Capsule::connection()->getPdo();
    echo "✓ DB Connecté\n";

    // Test 2: Table users existe
    if (Capsule::schema()->hasTable('users')) {
        echo "✓ Table 'users' existe\n";
    } else {
        echo "✗ Table 'users' MANQUANTE\n";
    }

    // Test 3: Table personal_access_tokens existe
    if (Capsule::schema()->hasTable('personal_access_tokens')) {
        echo "✓ Table 'personal_access_tokens' existe\n";
    } else {
        echo "✗ Table 'personal_access_tokens' MANQUANTE\n";
        echo "Exécute: php artisan migrate\n";
    }

    // Test 4: Peut créer un user
    $id = Capsule::table('users')->insertGetId([
        'name' => 'Test',
        'email' => 'test' . time() . '@test.com',
        'password' => password_hash('test123', PASSWORD_DEFAULT),
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    echo "✓ User créé (ID: $id)\n";
} catch (Exception $e) {
    echo "✗ ERREUR: " . $e->getMessage() . "\n";
}
