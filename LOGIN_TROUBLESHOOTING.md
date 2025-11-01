# Login/Register Troubleshooting Guide

## ❌ Masalah: Tidak Bisa Login

### 🔍 Hal yang Perlu Dicheck

#### 1. **Database Connection**
```bash
# Pastikan database sudah running
# Check file `.env`
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=billiard_split_bill
DB_USERNAME=root
DB_PASSWORD=
```

#### 2. **Run Database Migrations**
```bash
php artisan migrate
```

#### 3. **Pastikan Users Table Sudah Terbuat**
```bash
# Check di database
SHOW TABLES;
DESC users;
```

#### 4. **Seed Database (Optional - untuk testing)**
```bash
php artisan db:seed
```

#### 5. **Check Server Logs**
```bash
# Terminal Laravel - lihat error messages
tail -f storage/logs/laravel.log

# Atau buka: storage/logs/laravel.log di editor
```

---

## 🔧 Fixes Applied

### Fix 1: Added `preserveScroll` to Form Submission
- **Why**: Prevents page scroll jump on error
- **Location**: Login.jsx line ~17, Register.jsx line ~24
- **Change**: Added `preserveScroll: true` to post options

```jsx
// Before
post(route('login'), {
    onFinish: () => reset('password'),
});

// After
post(route('login'), {
    preserveScroll: true,
    onFinish: () => reset('password'),
});
```

---

## 🧪 Testing Steps

### Test 1: Visit Login Page
1. Go to `http://localhost:8000/login`
2. Check if page loads correctly
3. Check browser console (F12) for errors

### Test 2: Test with Wrong Credentials
1. Email: `test@test.com`
2. Password: `wrong`
3. Click "Masuk"
4. Should show error message: "Credentials do not match our records"

### Test 3: Test with Valid Credentials
1. First register a test account:
   - Go to `/register`
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!` (must meet strength requirements)
   - Confirm password
   - Check terms
   - Click "Buat Akun"

2. Then try login:
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Should redirect to dashboard

### Test 4: Check "Remember Me"
1. Login with credentials
2. Check "Ingat saya" checkbox
3. Should stay logged in after browser close

---

## 📋 Common Error Messages

### "Credentials do not match our records"
- **Cause**: Email or password wrong
- **Fix**: Check spelling and try again

### "Validation failed"
- **Cause**: Email format invalid or empty fields
- **Fix**: Check error message under field, fill all required fields

### "Too many login attempts"
- **Cause**: Tried login 5+ times with wrong credentials
- **Fix**: Wait 1 minute and try again

### "The given data was invalid"
- **Cause**: Server validation failed
- **Fix**: Check browser console and Laravel logs for details

### Page stays on login after submit
- **Cause**: 
  1. CSRF token issue (Inertia should handle)
  2. Form didn't submit properly
  3. Server error occurred
- **Fix**: 
  1. Check browser console (F12) → Network tab
  2. Check Laravel logs
  3. Hard refresh browser (Ctrl+Shift+R)

---

## 🔐 Required Form Fields

### Login Form
```
Required:
- email (must be valid email format)
- password (any non-empty string)

Optional:
- remember (checkbox)
```

### Register Form
```
Required:
- name (non-empty string)
- email (valid email format, must be unique)
- password (min 8 chars, must include uppercase, lowercase, number)
- password_confirmation (must match password)
- terms_agreed (must be checked)
```

---

## 🐛 Browser DevTools Debugging

### Step 1: Open DevTools
- **Windows/Linux**: Press `F12` or `Ctrl+Shift+I`
- **Mac**: Press `Cmd+Option+I`

### Step 2: Check Console Tab
- Look for red error messages
- Note any warnings

### Step 3: Check Network Tab
1. Go to Network tab
2. Click Login button
3. Look for POST request to `/login`
4. Check response:
   - Status 200 = OK (check redirect)
   - Status 422 = Validation error (check response JSON)
   - Status 500 = Server error (check Laravel logs)

### Step 4: Check Response JSON
- Click the `/login` POST request
- Click "Response" tab
- If errors: See what validation failed

Example error response:
```json
{
    "message": "The given data was invalid",
    "errors": {
        "email": ["The email must be a valid email address."]
    }
}
```

---

## 🚀 Quick Fix Checklist

- [ ] Is PHP running? (`php artisan serve`)
- [ ] Is MySQL/DB running?
- [ ] Did you run migrations? (`php artisan migrate`)
- [ ] Is npm dev server running? (`npm run dev`)
- [ ] Did you refresh page? (`Ctrl+Shift+R`)
- [ ] Check browser console (F12)
- [ ] Check Laravel logs (`storage/logs/laravel.log`)
- [ ] Try in incognito window (no cache)
- [ ] Clear browser cache
- [ ] Test with test account (if seeded)

---

## 📝 Alternative Testing with API

### Create Test User via PHP
```php
// In Laravel tinker
php artisan tinker

>>> $user = App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test@test.com',
    'password' => bcrypt('password'),
]);
>>> exit
```

### Then Login
- Email: `test@test.com`
- Password: `password`

---

## 🆘 Still Not Working?

If login still not working after these steps:

1. **Check Laravel is running**
   ```bash
   php artisan serve
   ```

2. **Check npm is running**
   ```bash
   npm run dev
   ```

3. **Check migrations ran**
   ```bash
   php artisan migrate:status
   ```

4. **Reset everything**
   ```bash
   # Clear cache
   php artisan cache:clear
   php artisan config:clear
   php artisan view:clear
   
   # Rebuild database
   php artisan migrate:fresh
   php artisan db:seed
   ```

5. **Check .env file** (must exist and have DB credentials)

6. **Restart Laravel server**
   ```bash
   # Stop current server (Ctrl+C)
   php artisan serve
   ```

---

## ✅ Expected Behavior

### Successful Login
1. Submit login form with valid credentials
2. Page shows "Memproses..." with spinner
3. After 1-2 seconds, redirects to `/dashboard`
4. URL should be `http://localhost:8000/dashboard`
5. User authenticated ✅

### Successful Register
1. Submit register form with all valid data
2. Page shows "Membuat Akun..." with spinner
3. After 1-2 seconds, redirects to `/dashboard` (if no email verification)
4. Or redirects to email verification page (if email verification enabled)
5. New account created ✅

---

## 📞 Need More Help?

- Check Laravel Breeze documentation
- Check Inertia.js Form documentation
- Look at Laravel auth logs: `tail -f storage/logs/laravel.log`
- Check Network request/response in browser DevTools

