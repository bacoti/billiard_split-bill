# 🎯 New User Flow - Updated Routing

## ✨ Flow Baru

### User Baru / Belum Login
```
┌─────────────────────────────────────────┐
│ User akses http://localhost:8000/       │
└────────────┬────────────────────────────┘
             │
             ├─→ Redirect ke /login
             │   (karena belum authenticated)
             │
             └─→ User lihat Login Page
                 ├─ Email input
                 ├─ Password input
                 ├─ Remember me
                 └─ Sign up link
```

### User Login
```
┌─────────────────────────────────────────┐
│ User submit login form                  │
│ Email: test@example.com                 │
│ Password: password                      │
└────────────┬────────────────────────────┘
             │
             ├─→ Backend validate credentials
             │
             ├─→ Session regenerate
             │
             └─→ Redirect ke /session/create
                 (Create Session Page)
```

### User Register
```
┌─────────────────────────────────────────┐
│ User klik "Daftar sekarang"             │
│ atau akses /register                    │
└────────────┬────────────────────────────┘
             │
             ├─→ User isi form register
             │   ├─ Name
             │   ├─ Email
             │   ├─ Password
             │   ├─ Confirm password
             │   └─ Terms agreement
             │
             ├─→ Submit form
             │
             ├─→ Backend validate & create user
             │
             ├─→ Auto-login user
             │
             └─→ Redirect ke /session/create
                 (Create Session Page)
```

### User Sudah Login
```
┌─────────────────────────────────────────┐
│ User akses http://localhost:8000/       │
│ (root path)                             │
└────────────┬────────────────────────────┘
             │
             ├─→ Check authenticated
             │
             ├─→ Yes → Redirect ke /session/create
             │
             └─→ (authenticated, langsung ke create)
```

---

## 📋 Routing Summary

| URL | Method | Behavior |
|-----|--------|----------|
| `/` | GET | Redirect ke `/login` (if not auth) atau `/session/create` (if auth) |
| `/login` | GET | Show login page |
| `/login` | POST | Process login → redirect to `/session/create` |
| `/register` | GET | Show register page |
| `/register` | POST | Create user → auto-login → redirect to `/session/create` |
| `/session/create` | GET | Show create session page (requires auth) |
| `/dashboard` | GET | Redirect ke `/session/create` |
| `/welcome` | GET | Show welcome page (optional, old landing page) |
| `/players` | GET | Show player management |
| `/profile` | GET | Show user profile |

---

## 🔄 Changed Routes

### ✅ Before
```
/ → Welcome Page
/login → Login Page
/register → Register Page
/dashboard → Session History
After login → /dashboard
After register → /dashboard
```

### ✅ After (NEW)
```
/ → Redirect to /login (if not auth)
  OR /session/create (if auth)
/login → Login Page
/register → Register Page
/session/create → Create Session Page
After login → /session/create
After register → /session/create
/dashboard → Redirect to /session/create
/welcome → Optional (old welcome page)
```

---

## 🎯 Key Changes

### 1. Root Path (`/`)
- **Before**: Always show Welcome page
- **After**: 
  - If NOT logged in → Redirect to `/login`
  - If logged in → Redirect to `/session/create`

### 2. Login After Authentication
- **Before**: `route('dashboard')` → SessionHistory
- **After**: `route('session.create')` → CreateSession

### 3. Register After User Created
- **Before**: `route('dashboard')` → SessionHistory
- **After**: `route('session.create')` → CreateSession

### 4. Dashboard
- **Before**: SessionHistory page
- **After**: Redirect to `/session/create`

### 5. Welcome Page
- **Before**: Root path (`/`)
- **After**: Available at `/welcome` (optional)

---

## 📝 Updated Files

### 1. `routes/web.php`
```php
// Root path - redirect based on auth status
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('session.create');
    }
    return redirect()->route('login');
});

// Welcome page tetap ada di /welcome
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Dashboard redirect ke session.create
Route::get('/dashboard', function () {
    return redirect()->route('session.create');
})->middleware(['auth', 'verified'])->name('dashboard');
```

### 2. `app/Http/Controllers/Auth/AuthenticatedSessionController.php`
```php
public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();
    
    // Changed from route('dashboard') to route('session.create')
    return redirect()->intended(route('session.create', absolute: false));
}
```

### 3. `app/Http/Controllers/Auth/RegisteredUserController.php`
```php
public function store(Request $request): RedirectResponse
{
    // ... validation & user creation ...
    
    Auth::login($user);
    
    // Changed from route('dashboard') to route('session.create')
    return redirect(route('session.create', absolute: false));
}
```

---

## ✅ Testing New Flow

### Test 1: Access Root Without Login
1. Open `http://localhost:8000/`
2. **Expected**: Redirect to `/login`
3. **Result**: ✅ See login page

### Test 2: Access Root After Login
1. Login with `test@example.com` / `password`
2. Open `http://localhost:8000/`
3. **Expected**: Redirect to `/session/create`
4. **Result**: ✅ See create session page

### Test 3: Direct Login Redirect
1. Go to `/login`
2. Enter credentials & submit
3. **Expected**: Redirect to `/session/create`
4. **Result**: ✅ See create session page

### Test 4: Direct Register Redirect
1. Go to `/register`
2. Fill form & submit
3. **Expected**: Redirect to `/session/create`
4. **Result**: ✅ See create session page

### Test 5: Dashboard Redirect
1. Login first
2. Go to `/dashboard`
3. **Expected**: Redirect to `/session/create`
4. **Result**: ✅ See create session page

---

## 🎮 User Journey

### Complete User Journey - BARU

```
┌─────────────────────────────────┐
│ 1. User Visit Website           │
│    http://localhost:8000/       │
└────────────┬────────────────────┘
             │
             ├─→ Not Logged In?
             │   └─→ Redirect to /login
             │
             └─→ Already Logged In?
                 └─→ Redirect to /session/create
                     (Langsung buat sesi!)

┌─────────────────────────────────┐
│ 2. Login Page                   │
│    http://localhost:8000/login  │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Email: ___________         │ │
│ │ Password: ______ [👁️]     │ │
│ │ ☑️ Ingat saya              │ │
│ │ [Masuk]                    │ │
│ │                            │ │
│ │ atau                       │ │
│ │ Daftar sekarang            │ │
│ └─────────────────────────────┘ │
└────────────┬────────────────────┘
             │
             ├─→ Login Success
             │   └─→ Redirect to /session/create
             │
             └─→ Login Failed
                 └─→ Show error message
                     └─→ Retry

┌─────────────────────────────────┐
│ 3. Create Session Page          │
│    http://localhost:8000/       │
│    /session/create              │
├─────────────────────────────────┤
│ User bisa:                      │
│ - Isi nama sesi                 │
│ - Pilih meja billiard           │
│ - Tambah pemain                 │
│ - Set taruhan/rate              │
│ - Buat sesi                     │
└─────────────────────────────────┘
```

---

## 🚀 Benefits of New Flow

1. ✅ **Simpler**: Langsung ke create session, tidak perlu navigate
2. ✅ **Faster**: Login → Langsung bikin sesi
3. ✅ **Better UX**: User tidak confuse, clear purpose
4. ✅ **Clean**: Root path (`/`) intelligently redirect
5. ✅ **Flexible**: Still can access `/welcome` if needed

---

## 🔐 Protected Routes

Routes yang require authentication:
```php
/session/create     // Create session page
/players            // Player management
/profile            // User profile
/dashboard          // (redirect ke session.create)
```

Jika belum login & akses routes di atas:
→ Redirect ke `/login`

---

## 📱 Mobile Friendly

Flow ini juga bekerja di mobile:
1. User buka app → redirect ke login
2. Login → redirect ke create session
3. Create session → buat sesi
4. Maintain authenticated session

---

## ⚙️ How Middleware Works

### Guest Middleware (auth/login/register)
```php
Route::middleware('guest')->group(function () {
    Route::get('login', ...);
    Route::post('login', ...);
    Route::get('register', ...);
    Route::post('register', ...);
});
```
- Hanya accessible jika BELUM login
- Jika sudah login & akses /login → redirect ke session.create

### Auth Middleware (session.create, players, profile)
```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('session/create', ...);
    Route::get('players', ...);
});
```
- Hanya accessible jika SUDAH login
- Jika belum login & akses → redirect ke login

---

## 🎯 Next Steps

1. ✅ Test new flow (see Testing section)
2. ✅ Verify CreateSession page works
3. ✅ Test logout → redirect to login
4. ✅ Test register → langsung ke session create
5. ✅ Check responsive design on mobile

---

## 📞 Summary

**New Flow:**
- Website root (`/`) → Smart redirect (login or session.create)
- Login/Register → Redirect ke `/session/create`
- Dashboard → Redirect ke `/session/create`
- Welcome page → Available at `/welcome`

**User Experience:**
- User tidak pernah see welcome page
- Langsung ke login → create session → start playing!
- Simple & efficient workflow

