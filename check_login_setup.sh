#!/bin/bash

echo "======================================"
echo "BilliarSplit - Login Troubleshooting"
echo "======================================"
echo ""

# Check if Laravel is running
echo "1️⃣  Checking Laravel Server..."
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Laravel server is running on port 8000"
else
    echo "❌ Laravel server NOT running on port 8000"
    echo "   Start with: php artisan serve"
    exit 1
fi

echo ""

# Check if npm dev is running
echo "2️⃣  Checking Vite Dev Server..."
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 || lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Vite dev server is running"
else
    echo "❌ Vite dev server NOT running"
    echo "   Start with: npm run dev"
    exit 1
fi

echo ""

# Check database connection
echo "3️⃣  Checking Database Connection..."
php artisan tinker <<EOF 2>/dev/null
try {
    \DB::connection()->getPdo();
    echo "✅ Database connection OK\n";
} catch (\Exception \$e) {
    echo "❌ Database connection failed\n";
    echo "Error: " . \$e->getMessage() . "\n";
}
exit;
EOF

echo ""

# Check if users table exists
echo "4️⃣  Checking Users Table..."
php artisan tinker <<EOF 2>/dev/null
try {
    \DB::select("SELECT COUNT(*) as count FROM users");
    \$count = \DB::table('users')->count();
    echo "✅ Users table exists with $count users\n";
} catch (\Exception \$e) {
    echo "❌ Users table issue\n";
    echo "   Run: php artisan migrate\n";
}
exit;
EOF

echo ""

# Check for test user
echo "5️⃣  Looking for Test Users..."
php artisan tinker <<EOF 2>/dev/null
\$users = \DB::table('users')->limit(5)->get();
if (\$users->count() > 0) {
    echo "✅ Found " . \$users->count() . " user(s):\n";
    foreach (\$users as \$user) {
        echo "   - " . \$user->email . " (" . \$user->name . ")\n";
    }
} else {
    echo "⚠️  No users found in database\n";
    echo "   Register a new account or run: php artisan db:seed\n";
}
exit;
EOF

echo ""
echo "======================================"
echo "Check Complete!"
echo "======================================"
