# Login & Register Pages - Documentation

## 📄 Overview

Halaman Login dan Register telah dirancang dengan standar UI/UX profesional yang matching dengan Welcome page. Keduanya menggunakan design system yang konsisten dengan gradient backgrounds, modern animations, dan dark mode support.

---

## 🎨 Design Features

### Shared Design Elements
- ✅ Gradient background (dark slate + gradient blobs)
- ✅ Decorative blob animations
- ✅ Centered card layout (max-w-md)
- ✅ Glass-morphism effect (backdrop blur)
- ✅ Professional typography & spacing
- ✅ Dark mode by default
- ✅ Mobile responsive
- ✅ Smooth transitions & animations

---

## 🔐 Login Page (`Auth/Login.jsx`)

### Features

#### 1. **Header Section**
- BilliarSplit logo dengan gradient text
- Headline: "Selamat Datang Kembali"
- Subtext: "Masuk ke akun Anda untuk melanjutkan"

#### 2. **Status Messages**
- Colored status message box (green background)
- For notifications & password reset confirmations

#### 3. **Email Field**
- Label & input dengan proper spacing
- Placeholder: "nama@email.com"
- Error highlighting (red border + icon)
- Real-time error messages
- Auto-focus on first load

#### 4. **Password Field**
- Label & input
- Toggle button untuk show/hide password
- Eye/Eye-Off icons dari Lucide
- Error highlighting & messages
- Proper password input autocomplete

#### 5. **Remember Me & Forgot Password**
- Checkbox untuk "Ingat saya"
- Link ke password reset page
- Proper hover states

#### 6. **Submit Button**
- Gradient background (blue → purple)
- Shadow & hover effects
- Loading state dengan spinner
- Disabled state when processing
- Full width

#### 7. **Sign Up Link**
- Divider dengan "atau" text
- Link ke register page
- Smooth transition

#### 8. **Footer Links**
- Back to home link
- Email support link

### Form Handling
```jsx
const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = (e) => {
    e.preventDefault();
    post(route('login'), {
        onFinish: () => reset('password'),
    });
};
```

### Validation Features
- ✅ Error messages per field
- ✅ Red border highlighting
- ✅ Alert icon indicators
- ✅ Laravels built-in validation

---

## 📝 Register Page (`Auth/Register.jsx`)

### Features

#### 1. **Header Section**
- BilliarSplit logo dengan gradient
- Headline: "Buat Akun Baru"
- Subtext: "Bergabunglah dengan komunitas pemain billiard kami"

#### 2. **Name Field**
- Simple text input
- Placeholder: "Nama Anda"
- Error handling & validation

#### 3. **Email Field**
- Email type input
- Placeholder: "nama@email.com"
- Error handling

#### 4. **Password Field** (Advanced)
- Password toggle (show/hide)
- **Password Strength Indicator**:
  - Visual strength bars (4 levels)
  - Strength labels: Lemah → Sedang → Kuat → Sangat Kuat
  - Requirements checklist:
    - ✓ Minimal 8 karakter
    - ✓ Huruf besar dan kecil
    - ✓ Angka
  - Real-time feedback dengan check icons
  - Color-coded (red → yellow → blue → green)

#### 5. **Confirm Password Field**
- Toggle show/hide
- Real-time match validation
- Error message jika tidak sama
- Clear visual feedback

#### 6. **Terms & Conditions**
- Checkbox dengan multi-line text
- Links to Terms & Privacy Policy
- Required to submit
- Better styling dengan background box

#### 7. **Submit Button**
- Disabled state jika:
  - Processing
  - Terms tidak disetujui
  - Passwords tidak match
- Loading state dengan spinner
- Clear disabled state styling

#### 8. **Footer**
- Link ke login page
- Information about data protection
- Trust indicator text

### Form Handling
```jsx
const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const passwordsMatch = data.password === data.password_confirmation;
```

### Password Strength Logic
```jsx
const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Return strength level & styling
};
```

---

## 🎯 Key Features Comparison

| Feature | Login | Register |
|---------|-------|----------|
| Password Toggle | ✅ | ✅ (x2) |
| Password Strength | - | ✅ Advanced |
| Remember Me | ✅ | - |
| Forgot Password | ✅ | - |
| Terms Agreement | - | ✅ |
| Form Validation | ✅ | ✅ Enhanced |
| Error Messages | ✅ | ✅ Detailed |
| Loading State | ✅ | ✅ |
| Mobile Optimized | ✅ | ✅ |

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** (< 640px): Full width, single column
- **Tablet** (640px - 1024px): Centered card with padding
- **Desktop** (> 1024px): Max-w-md centered

### Mobile Features
- Full-height viewport usage
- Large touch targets (py-3 = 48px height)
- Full-width inputs
- Proper padding on small screens
- Scrollable on small height devices

---

## 🌙 Dark Mode

Kedua halaman fully dark mode by default:
- Gradient backgrounds (slate-900 → slate-800)
- Dark input backgrounds (slate-700/50)
- Light text colors (white, slate-300)
- Light border colors (slate-600)
- All text properly readable

---

## ✨ Visual Effects

### Animations
- Blob animations (floating, delayed)
- Smooth transitions (duration-300)
- Focus ring effects (ring-2 ring-blue-500)
- Loading spinner animation
- Hover effects on links

### Glass Morphism
```css
bg-slate-800/50 backdrop-blur-xl border border-slate-700/50
```

---

## 🔄 Form State Management

### Login Form
```jsx
{
    email: '',
    password: '',
    remember: false
}
```

### Register Form
```jsx
{
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
}
```

### Password Show/Hide
```jsx
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
```

### Agreement State
```jsx
const [agreedToTerms, setAgreedToTerms] = useState(false);
```

---

## 🎭 Error Handling

### Error Display
- Red border on invalid fields
- Error icon (AlertCircle) 
- Descriptive error message
- Color: text-red-400

### Example
```jsx
{errors.email && (
    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
        <AlertCircle className="h-4 w-4" />
        {errors.email}
    </div>
)}
```

---

## 🔐 Security Features

### Input Autocomplete
```jsx
autoComplete="username"      // Login email
autoComplete="email"         // Register email
autoComplete="current-password"   // Login password
autoComplete="new-password"  // Register password
```

### Password Reset
- Passwords cleared on successful login
- Reset via `onFinish` callback

### Validation
- Email format validation (required, email type)
- Password requirements (strength indicators)
- Password confirmation matching
- Terms agreement required

---

## 📐 Layout Structure

### Both Pages
```
┌─────────────────────────────┐
│      Background Blobs        │
│                             │
│      ┌─────────────────┐    │
│      │  Header/Logo    │    │
│      ├─────────────────┤    │
│      │   Form Card     │    │
│      │  - Inputs       │    │
│      │  - Buttons      │    │
│      ├─────────────────┤    │
│      │  Divider        │    │
│      ├─────────────────┤    │
│      │  Sign Up/Login  │    │
│      └─────────────────┘    │
│                             │
│      Footer Links           │
└─────────────────────────────┘
```

---

## 🎯 UX Best Practices

✅ **Accessibility**
- Proper label associations (htmlFor)
- Semantic HTML (form, input, button, label)
- ARIA-compliant focus management
- Keyboard navigation support

✅ **User Feedback**
- Real-time validation
- Clear error messages
- Loading state indication
- Success feedback

✅ **Mobile Optimization**
- Touch-friendly buttons (44x44px)
- Large font on mobile (16px)
- Full-width inputs
- Proper spacing

✅ **Performance**
- Lazy form validation
- Smooth transitions (GPU-accelerated)
- Minimal re-renders
- CSS-based animations

---

## 🔗 Navigation

### From Welcome Page
```jsx
// Login button opens login modal or redirects to /login
<button onClick={() => toggleDialog('login', true)}>
    Masuk
</button>
// OR for direct page navigation
<Link href={route('login')}>Masuk</Link>

// Register button opens signup modal or redirects to /register
<button onClick={() => toggleDialog('signup', true)}>
    Daftar
</button>
// OR for direct page navigation
<Link href={route('register')}>Daftar</Link>
```

### Navigation Links
```jsx
// From Login to Register
<Link href={route('register')}>Daftar sekarang</Link>

// From Register to Login
<Link href={route('login')}>Masuk sekarang</Link>

// Back to Home
<Link href="/">Kembali ke Home</Link>

// Forgot Password
<Link href={route('password.request')}>Lupa password?</Link>
```

---

## 🌐 Routes

```php
// In routes/auth.php
Route::get('login', [AuthenticatedSessionController::class, 'create'])
    ->name('login');
Route::post('login', [AuthenticatedSessionController::class, 'store']);

Route::get('register', [RegisteredUserController::class, 'create'])
    ->name('register');
Route::post('register', [RegisteredUserController::class, 'store']);
```

---

## 📝 Form Submission

### Login Submission
```jsx
post(route('login'), {
    onFinish: () => reset('password'),
});
// Redirects to dashboard on success
```

### Register Submission
```jsx
// Validate terms agreement first
if (!agreedToTerms) {
    alert('Anda harus setuju dengan syarat dan ketentuan');
    return;
}

post(route('register'), {
    onFinish: () => reset('password', 'password_confirmation'),
});
// Redirects to email verification or dashboard
```

---

## 🎨 Color System

| Color | Use | Example |
|-------|-----|---------|
| Blue-500 | Primary gradient start | Button, focus ring |
| Purple-600 | Primary gradient end | Button, focus ring |
| Red-400 | Error/danger | Error text, invalid border |
| Green-400 | Success indicator | Password strength check |
| Slate-900 | Dark background | Page background |
| Slate-800 | Card background | Form card, decorative |
| Slate-700 | Input background | Input fields |
| Slate-600 | Border color | Borders, dividers |
| White | Primary text | Headings, labels |
| Slate-300 | Secondary text | Descriptions |
| Slate-400 | Tertiary text | Helper text |

---

## 📚 Component Dependencies

### Login.jsx
- `useForm` from @inertiajs/react
- `Head` from @inertiajs/react
- `Link` from @inertiajs/react
- `AlertCircle`, `Eye`, `EyeOff` from lucide-react
- `useState` from react

### Register.jsx
- `useForm` from @inertiajs/react
- `Head` from @inertiajs/react
- `Link` from @inertiajs/react
- `AlertCircle`, `Eye`, `EyeOff`, `Check` from lucide-react
- `useState` from react

---

## 🔄 Future Enhancements

1. **Social Login**
   - Google OAuth
   - GitHub OAuth

2. **Two-Factor Authentication**
   - Email verification
   - Authenticator app

3. **Advanced Password Reset**
   - Email-based reset
   - Reset token handling

4. **Form Analytics**
   - Form start tracking
   - Completion tracking
   - Error tracking

5. **Internationalization**
   - Multi-language support
   - RTL layout

---

## ✅ Testing Checklist

### Login Page
- [ ] Email validation works
- [ ] Password toggle works
- [ ] Remember me checkbox works
- [ ] Forgot password link works
- [ ] Sign up link works
- [ ] Form submission works
- [ ] Error messages display
- [ ] Loading state shows
- [ ] Mobile layout responsive
- [ ] Dark mode correct

### Register Page
- [ ] All fields validate
- [ ] Password strength indicator works
- [ ] Password match validation works
- [ ] Show/hide toggles work
- [ ] Terms checkbox required
- [ ] Form submission works
- [ ] Success feedback shows
- [ ] Error messages display
- [ ] Mobile layout responsive
- [ ] Scrollable on small devices

---

## 🚀 Deployment Notes

1. Ensure CSRF token is included in form submission (Inertia handles this)
2. Validate email format on backend
3. Hash passwords before storage
4. Implement rate limiting for login attempts
5. Set proper CORS headers if needed
6. Enable HTTPS for production
7. Test email verification flow

---

## 📞 Support

For issues or questions:
- Check error messages in browser console
- Review Laravel validation errors
- Verify routes are correctly defined
- Check authentication middleware
- Review Inertia.js documentation

