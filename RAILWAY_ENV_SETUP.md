# 🚂 Railway Environment Variables Setup

Copy semua variable di bawah ini ke Railway Environment Variables.
**PENTING**: Ganti nilai yang ditandai dengan `[GANTI_INI]`

## Step 1: Copy & Paste ke Railway

```env
APP_NAME="Billiard Split Bill"
APP_ENV="production"
APP_KEY="base64:28F8oP3odshx9VhNgW03beG9C1V7TuO5bFl4xekKZQ8="
APP_DEBUG="false"
APP_URL="https://billiardsplit-bill-production.up.railway.app"
APP_LOCALE="en"
APP_FALLBACK_LOCALE="en"
APP_FAKER_LOCALE="en_US"
APP_MAINTENANCE_DRIVER="file"
APP_TIMEZONE="Asia/Jakarta"
BCRYPT_ROUNDS="12"
PHP_CLI_SERVER_WORKERS="4"
LOG_CHANNEL="stack"
LOG_STACK="single"
LOG_DEPRECATIONS_CHANNEL="null"
LOG_LEVEL="error"
DB_CONNECTION="mysql"
DB_HOST="${MYSQLHOST}"
DB_PORT="${MYSQLPORT}"
DB_DATABASE="${MYSQLDATABASE}"
DB_USERNAME="${MYSQLUSER}"
DB_PASSWORD="${MYSQLPASSWORD}"
SESSION_DRIVER="database"
SESSION_LIFETIME="120"
SESSION_ENCRYPT="false"
SESSION_PATH="/"
SESSION_DOMAIN=".billiardsplit-bill-production.up.railway.app"
SESSION_SECURE_COOKIE="true"
SESSION_SAME_SITE="lax"
SANCTUM_STATEFUL_DOMAINS="billiardsplit-bill-production.up.railway.app"
BROADCAST_CONNECTION="log"
FILESYSTEM_DISK="local"
QUEUE_CONNECTION="database"
CACHE_STORE="database"
MEMCACHED_HOST="127.0.0.1"
REDIS_CLIENT="phpredis"
REDIS_HOST="127.0.0.1"
REDIS_PASSWORD="null"
REDIS_PORT="6379"
MAIL_MAILER="log"
MAIL_SCHEME="null"
MAIL_HOST="127.0.0.1"
MAIL_PORT="2525"
MAIL_USERNAME="null"
MAIL_PASSWORD="null"
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_DEFAULT_REGION="us-east-1"
AWS_BUCKET=""
AWS_USE_PATH_STYLE_ENDPOINT="false"
VITE_APP_NAME="${APP_NAME}"

## Step 2: Variables yang WAJIB di Update

Setelah paste ke Railway, update variable ini:

### ⚠️ Jika domain Railway kamu berbeda:
```env
APP_URL="https://[DOMAIN_RAILWAY_KAMU].up.railway.app"
SESSION_DOMAIN=".[DOMAIN_RAILWAY_KAMU].up.railway.app"
SANCTUM_STATEFUL_DOMAINS="[DOMAIN_RAILWAY_KAMU].up.railway.app"
```

### ⚠️ Jika sudah punya custom domain:
```env
APP_URL="https://yourdomain.com"
SESSION_DOMAIN=".yourdomain.com"
SANCTUM_STATEFUL_DOMAINS="yourdomain.com,www.yourdomain.com"
```

## Step 3: Verify di Railway

Setelah save environment variables, Railway akan auto-restart service.

Cek di Railway logs apakah ada error. Jika tidak ada error, website sudah siap!

## Troubleshooting

### Jika masih blank page:
1. Cek Railway logs untuk error PHP
2. Pastikan migration sudah jalan: `php artisan migrate --force`
3. Cek APP_KEY sudah benar

### Jika masih error 401 di API:
1. Pastikan `SESSION_SECURE_COOKIE="true"`
2. Pastikan `SANCTUM_STATEFUL_DOMAINS` sesuai domain Railway
3. Clear browser cache & cookies
4. Try hard reload (Ctrl+Shift+R)

### Jika Mixed Content Error:
1. Pastikan `APP_URL` pakai HTTPS (bukan HTTP)
2. Pastikan `APP_ENV="production"`
3. Build ulang: `npm run build` dan push ke git

---

**✅ DONE!** Website seharusnya sudah jalan normal di Railway.
