import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import HeroSection from '../Components/HeroSection';
import FeaturesSection from '../Components/FeaturesSection';
import BenefitsSection from '../Components/BenefitsSection';
import SocialProofSection from '../Components/SocialProofSection';
import Footer from '../Components/Footer';
import {
    ModalDialog,
    SuccessDialog,
    ConfirmationDialog
} from '../Components/DialogComponents';
import { ScrollReveal } from '../Components/AnimationComponents';

export default function Welcome({ auth }) {
    // Dialog states
    const [dialogs, setDialogs] = useState({
        login: false,
        signup: false,
        success: false,
    });

    // Form states
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });

    // Toggle dialogs
    const toggleDialog = (dialog, value) => {
        setDialogs(prev => ({ ...prev, [dialog]: value }));
    };

    // Handle login
    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login:', loginForm);
        toggleDialog('login', false);
        toggleDialog('success', true);
    };

    // Handle signup
    const handleSignup = (e) => {
        e.preventDefault();
        console.log('Signup:', signupForm);
        toggleDialog('signup', false);
        toggleDialog('success', true);
    };

    return (
        <>
            <Head title="Welcome to BilliarSplit" />
            <div className="min-h-screen bg-white dark:bg-slate-900">
                {/* Navigation Bar */}
                <nav className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                                🎱 BilliarSplit
                            </div>

                            {/* Nav Links */}
                            <div className="hidden md:flex items-center gap-8">
                                <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    Fitur
                                </a>
                                <a href="#benefits" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    Keuntungan
                                </a>
                                <a href="#proof" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                    Testimoni
                                </a>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => toggleDialog('login', true)}
                                            className="px-4 py-2 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                                        >
                                            Masuk
                                        </button>
                                        <button
                                            onClick={() => toggleDialog('signup', true)}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all text-sm font-medium"
                                        >
                                            Daftar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <ScrollReveal direction="up">
                    <HeroSection
                        onGetStarted={() => toggleDialog('signup', true)}
                    />
                </ScrollReveal>

                {/* Features Section */}
                <ScrollReveal direction="up" delay={200}>
                    <section id="features">
                        <FeaturesSection />
                    </section>
                </ScrollReveal>

                {/* Benefits Section */}
                <ScrollReveal direction="up" delay={400}>
                    <section id="benefits">
                        <BenefitsSection />
                    </section>
                </ScrollReveal>

                {/* Social Proof Section */}
                <ScrollReveal direction="up" delay={600}>
                    <section id="proof">
                        <SocialProofSection />
                    </section>
                </ScrollReveal>

                {/* CTA Section sebelum Footer */}
                <section className="py-20 sm:py-32 bg-gradient-to-br from-blue-600 to-purple-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Mulai Bagikan Biaya Billiard dengan Adil Hari Ini
                        </h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                            Bergabunglah dengan ribuan pemain billiard yang telah merasakan kemudahan dan transparansi sistem kami.
                        </p>
                        <button
                            onClick={() => toggleDialog('signup', true)}
                            className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300 inline-block hover:shadow-xl"
                        >
                            Daftar Gratis Sekarang
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <Footer />

                {/* ===== DIALOG COMPONENTS ===== */}

                {/* Login Modal */}
                <ModalDialog
                    isOpen={dialogs.login}
                    onClose={() => toggleDialog('login', false)}
                    title="Masuk ke Akun Anda"
                    size="md"
                >
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={loginForm.email}
                                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Ingat saya</span>
                            </label>
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                Lupa password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-6"
                        >
                            Masuk
                        </button>

                        <p className="text-center text-slate-600 dark:text-slate-400">
                            Belum punya akun?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    toggleDialog('login', false);
                                    toggleDialog('signup', true);
                                }}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
                            >
                                Daftar sekarang
                            </button>
                        </p>
                    </form>
                </ModalDialog>

                {/* Signup Modal */}
                <ModalDialog
                    isOpen={dialogs.signup}
                    onClose={() => toggleDialog('signup', false)}
                    title="Buat Akun Baru"
                    size="md"
                >
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                required
                                value={signupForm.name}
                                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nama Anda"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={signupForm.email}
                                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <label className="flex items-center gap-2 pt-2">
                            <input type="checkbox" required className="rounded" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Saya setuju dengan{' '}
                                <button type="button" className="text-blue-600 hover:underline">
                                    Syarat & Ketentuan
                                </button>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-6"
                        >
                            Buat Akun
                        </button>

                        <p className="text-center text-slate-600 dark:text-slate-400">
                            Sudah punya akun?{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    toggleDialog('signup', false);
                                    toggleDialog('login', true);
                                }}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
                            >
                                Masuk sekarang
                            </button>
                        </p>
                    </form>
                </ModalDialog>

                {/* Success Dialog */}
                <SuccessDialog
                    isOpen={dialogs.success}
                    onClose={() => toggleDialog('success', false)}
                    title="Berhasil!"
                    message="Selamat datang di BilliarSplit. Akun Anda siap digunakan."
                    autoCloseTime={3000}
                />
            </div>
        </>
    );
}
