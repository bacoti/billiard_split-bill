import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff, Check } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            alert('Anda harus setuju dengan syarat dan ketentuan');
            return;
        }
        post(route('register'), {
            preserveScroll: true,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = [
            { strength: 1, label: 'Lemah', color: 'bg-red-500' },
            { strength: 2, label: 'Sedang', color: 'bg-yellow-500' },
            { strength: 3, label: 'Kuat', color: 'bg-blue-500' },
            { strength: 4, label: 'Sangat Kuat', color: 'bg-green-500' },
        ];
        return levels[strength - 1] || { strength: 0, label: '', color: '' };
    };

    const passwordStrength = getPasswordStrength(data.password);
    const passwordsMatch = data.password === data.password_confirmation;

    return (
        <>
            <Head title="Daftar" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
                {/* Decorative blobs */}
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="w-full max-w-md relative z-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                            🎱 BilliarSplit
                        </Link>
                        <h1 className="mt-6 text-3xl font-bold text-white">
                            Buat Akun Baru
                        </h1>
                        <p className="mt-2 text-slate-300">
                            Bergabunglah dengan komunitas pemain billiard kami
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.name ? 'border-red-500' : 'border-slate-600'
                                    }`}
                                    placeholder="Nama Anda"
                                    autoComplete="name"
                                    autoFocus
                                    required
                                />
                                {errors.name && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.email ? 'border-red-500' : 'border-slate-600'
                                    }`}
                                    placeholder="nama@email.com"
                                    autoComplete="email"
                                    required
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.password ? 'border-red-500' : 'border-slate-600'
                                        }`}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {data.password && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((bar) => (
                                                <div
                                                    key={bar}
                                                    className={`flex-1 h-1 rounded-full transition-all ${
                                                        bar <= passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-slate-600'
                                                    }`}
                                                ></div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-300">
                                            Kekuatan: <span className="font-medium">{passwordStrength.label}</span>
                                        </p>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li className="flex items-center gap-1">
                                                <Check className={`h-3 w-3 ${data.password.length >= 8 ? 'text-green-400' : 'text-slate-600'}`} />
                                                Minimal 8 karakter
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <Check className={`h-3 w-3 ${/[a-z]/.test(data.password) && /[A-Z]/.test(data.password) ? 'text-green-400' : 'text-slate-600'}`} />
                                                Huruf besar dan kecil
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <Check className={`h-3 w-3 ${/[0-9]/.test(data.password) ? 'text-green-400' : 'text-slate-600'}`} />
                                                Angka
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {errors.password && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-slate-200 mb-2">
                                    Konfirmasi Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.password_confirmation || (data.password_confirmation && !passwordsMatch)
                                                ? 'border-red-500'
                                                : 'border-slate-600'
                                        }`}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                {data.password_confirmation && !passwordsMatch && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        Password tidak sama
                                    </div>
                                )}

                                {errors.password_confirmation && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.password_confirmation}
                                    </div>
                                )}
                            </div>

                            {/* Terms Agreement */}
                            <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-4 space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer mt-0.5"
                                        required
                                    />
                                    <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                                        Saya setuju dengan{' '}
                                        <Link href="#" className="text-blue-400 hover:text-blue-300 underline">
                                            Syarat & Ketentuan
                                        </Link>
                                        {' '}dan{' '}
                                        <Link href="#" className="text-blue-400 hover:text-blue-300 underline">
                                            Kebijakan Privasi
                                        </Link>
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !agreedToTerms || !passwordsMatch}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Membuat Akun...
                                    </>
                                ) : (
                                    'Buat Akun'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-800/50 text-slate-400">atau</span>
                            </div>
                        </div>

                        {/* Sign In Link */}
                        <p className="text-center text-slate-300">
                            Sudah punya akun?{' '}
                            <Link
                                href={route('login')}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Masuk sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Dengan mendaftar, Anda membuat akun baru
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Data Anda akan dilindungi dengan enkripsi tingkat enterprise
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
