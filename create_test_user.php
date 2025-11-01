#!/usr/bin/env php
<?php

/**
 * Quick Test User Creator for BilliarSplit
 * 
 * Run: php create_test_user.php
 */

require __DIR__.'/vendor/autoload.php';
require __DIR__.'/bootstrap/app.php';

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Bootstrap the application
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Console\Kernel');
$kernel->bootstrap();

echo "\n🎱 BilliarSplit - Test User Creator\n";
echo "====================================\n\n";

// Check if user already exists
$existingUser = User::where('email', 'test@example.com')->first();

if ($existingUser) {
    echo "⚠️  User already exists!\n";
    echo "Email: " . $existingUser->email . "\n";
    echo "Name: " . $existingUser->name . "\n\n";
    
    echo "Credentials to login:\n";
    echo "├─ Email: test@example.com\n";
    echo "└─ Password: password123\n\n";
    exit(0);
}

// Create test user
try {
    $user = User::create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'email_verified_at' => now(),
    ]);

    echo "✅ Test user created successfully!\n\n";
    echo "Credentials to login:\n";
    echo "├─ Email: test@example.com\n";
    echo "└─ Password: password123\n\n";
    echo "Next steps:\n";
    echo "1. Go to: http://localhost:8000/login\n";
    echo "2. Enter email and password above\n";
    echo "3. Click 'Masuk'\n";
    echo "4. Should redirect to dashboard\n\n";

} catch (\Exception $e) {
    echo "❌ Error creating test user:\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    exit(1);
}
