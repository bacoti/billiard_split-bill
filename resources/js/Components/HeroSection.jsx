import React from 'react';
import { ArrowRight, Check, Zap, Users, BarChart3, Lock } from 'lucide-react';

export default function HeroSection({ onGetStarted }) {
    return (
        <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-20">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-sm text-blue-200">Baru Diluncurkan - Fitur Terbaru 2025</span>
                    </div>

                    {/* Main Headline */}
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            Bagikan Biaya Billiard dengan
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Mudah & Adil
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Aplikasi pintar untuk menghitung dan membagi biaya bermain billiard secara proporsional. 
                            Tidak perlu repot lagi menghitung pembagian biaya!
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <button
                            onClick={onGetStarted}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Mulai Sekarang
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 bg-slate-700/50 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 backdrop-blur">
                            Pelajari Lebih Lanjut
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Akurat & Transparan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Mudah Digunakan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-400" />
                            <span>Hasil Instan</span>
                        </div>
                    </div>
                </div>

                {/* Illustration placeholder */}
                <div className="mt-20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-3xl"></div>
                    <div className="relative bg-gradient-to-br from-slate-700/40 to-slate-800/40 border border-slate-700/50 rounded-2xl p-8 sm:p-12 backdrop-blur-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 mx-auto flex items-center justify-center">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm text-slate-300">Hitung Otomatis</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 mx-auto flex items-center justify-center">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm text-slate-300">Bagikan ke Teman</p>
                            </div>
                            <div className="text-center space-y-2">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 mx-auto flex items-center justify-center">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <p className="text-sm text-slate-300">Super Cepat</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
