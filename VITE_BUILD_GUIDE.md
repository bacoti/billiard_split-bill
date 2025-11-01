# 🔧 Fix: Vite Manifest Not Found

## ❌ Masalah
```
Illuminate\Foundation\ViteManifestNotFoundException
Vite manifest not found at: D:\billiard_split-bill\public\build/manifest.json
```

## 🔍 Penyebab
Vite assets belum di-build. File `public/build/manifest.json` tidak ada.

## ✅ Solusi

### Option 1: Build Vite Assets (Recommended)
```bash
npm run build
```

Ini akan:
- Compile semua React/JS files
- Generate CSS bundle
- Create `public/build/manifest.json`
- Optimize untuk production

**Waktu**: ~30-60 detik

### Option 2: Run Dev Server dengan HMR
```bash
npm run dev
```

Ini akan:
- Start Vite dev server (port 5173/5174)
- Hot Module Replacement aktif
- Tidak perlu rebuild setiap ada perubahan

**Note**: Tetap perlu `php artisan serve` di terminal lain!

---

## 🚀 Setup Lengkap (Rekomendasi)

### Terminal 1: Laravel Server
```bash
php artisan serve
```

### Terminal 2: Vite Dev Server
```bash
npm run dev
```

### Hasil
- Laravel: http://localhost:8000
- Vite HMR: http://localhost:5173 (otomatis)
- Dev environment siap!

---

## 📋 File Structure

```
public/
├── build/                    ← OUTPUT dari npm run build
│   ├── manifest.json         ← Vite manifest (diperlukan)
│   ├── assets/
│   │   ├── app-*.js
│   │   ├── app-*.css
│   │   └── ...
│   └── ...
├── index.php
└── ...

resources/
├── js/
│   └── app.jsx              ← Entry point
├── css/
│   └── app.css              ← Main CSS
└── views/
    └── app.blade.php        ← Layout
```

---

## 🔄 Development Workflow

### Development (Dengan HMR)
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```
- Hot reload otomatis saat ada perubahan
- Tidak perlu refresh browser manual
- Faster development

### Production Build
```bash
npm run build
php artisan serve
```
- Optimized assets
- Minified & bundled
- Ready for deployment

---

## ✨ What to Do Now

### 1️⃣ Choose Development Method

**Option A: With HMR (Recommended)**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev

# Browser: http://localhost:8000
```

**Option B: Build Once**
```bash
npm run build
php artisan serve

# Browser: http://localhost:8000
```

### 2️⃣ Verify Setup

After running build or dev:
1. Check folder `public/build/` exists
2. Check `public/build/manifest.json` exists
3. Browser should NOT show Vite error

### 3️⃣ Test Login Page

1. Browser: http://localhost:8000/login
2. Should see login form (tidak ada error)
3. Form should display dengan styling yang benar

---

## 🐛 Troubleshooting

### Issue: Still Getting Vite Error
**Fix**: 
```bash
# Clear everything
rm -rf public/build/
npm run dev
# atau
npm run build
```

### Issue: HMR Not Working
**Fix**: Make sure Vite dev server running
```bash
# Check if running on port 5173/5174
lsof -i :5173
lsof -i :5174
```

### Issue: CSS Not Loading
**Fix**: 
```bash
# Rebuild
npm run build
# atau restart dev server
npm run dev
```

### Issue: JavaScript Errors
**Fix**: Check browser console (F12)
```
- Look for 404 errors
- Check network tab
- Check Laravel logs
```

---

## 📝 npm Scripts

```json
{
  "scripts": {
    "dev": "vite",                    // Dev server dengan HMR
    "build": "vite build",            // Production build
    "preview": "vite preview"         // Preview production build
  }
}
```

---

## 🎯 Quick Start

1. **Build assets** (first time only):
   ```bash
   npm run build
   ```

2. **Start Laravel server**:
   ```bash
   php artisan serve
   ```

3. **Open browser**:
   ```
   http://localhost:8000/login
   ```

4. **Should see** ✅ Login page dengan styling sempurna

---

## ✅ Success Indicators

✅ File `public/build/manifest.json` exists
✅ No Vite errors in browser
✅ Login page displays correctly
✅ CSS/JS loaded properly
✅ Form styling visible (dark background, gradients, etc.)

---

## 🚀 You're Ready!

After building or running dev server:
1. Go to http://localhost:8000/login
2. Login dengan credentials: test@example.com / password
3. Should redirect ke /session/create
4. Selesai! ✅

