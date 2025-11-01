import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            preserveScroll: true,
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Masuk" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                            Selamat Datang Kembali
                        </h1>
                        <p className="mt-2 text-slate-300">
                            Masuk ke akun Anda untuk melanjutkan
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-300 text-sm">
                            {status}
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 shadow-2xl">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
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
                                        autoComplete="username"
                                        required
                                        autoFocus
                                    />
                                </div>
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
                                        autoComplete="current-password"
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
                                {errors.password && (
                                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                    />
                                    <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors">
                                        Ingat saya
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-slate-800/50 text-slate-400">atau</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <p className="text-center text-slate-300">
                            Belum punya akun?{' '}
                            <Link
                                href={route('register')}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Daftar sekarang
                            </Link>
                        </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400">
                            Memiliki masalah login?
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                            <Link
                                href="/"
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                Kembali ke Home
                            </Link>
                            <span className="text-slate-600">•</span>
                            <a
                                href="mailto:support@billiarsplit.id"
                                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                            >
                                Email Bantuan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
