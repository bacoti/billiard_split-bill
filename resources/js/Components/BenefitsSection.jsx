import React from 'react';
import { Zap, Users, DollarSign, Heart } from 'lucide-react';

const benefits = [
    {
        icon: Zap,
        title: 'Hemat Waktu',
        description: 'Tidak perlu lagi mencubit kertas, menulis catatan, atau berdebat tentang pembagian biaya. Semuanya dihitung otomatis dalam hitungan detik.',
        stat: '5 Menit',
        context: 'Waktu yang dihemat per sesi'
    },
    {
        icon: Users,
        title: 'Transparansi Penuh',
        description: 'Semua pemain bisa melihat kalkulasi detail mereka. Tidak ada biaya tersembunyi, semua jelas dan terbuka untuk masing-masing orang.',
        stat: '100%',
        context: 'Transparansi biaya'
    },
    {
        icon: DollarSign,
        title: 'Bayar dengan Adil',
        description: 'Setiap orang membayar sesuai durasi bermain mereka. Sistem proporsi yang adil untuk semua, tidak ada yang dirugikan.',
        stat: 'Rp 0',
        context: 'Selisih perhitungan'
    },
    {
        icon: Heart,
        title: 'Hubungan Tetap Baik',
        description: 'Dengan sistem yang jelas dan adil, tidak akan ada lagi ketidaksepakatan atau konflik dalam pembagian biaya antar teman.',
        stat: '99%',
        context: 'Kepuasan pengguna'
    }
];

export default function BenefitsSection() {
    return (
        <section className="py-20 sm:py-32 bg-white dark:bg-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-16 sm:mb-20">
                    <span className="inline-block px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                        KEUNTUNGAN UTAMA
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                        Rasakan Manfaat Nyata
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            dalam Setiap Permainan
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Dari pengematan waktu hingga hubungan yang lebih harmonis dengan teman-teman Anda
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="relative group"
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            {/* Content */}
                            <div className="relative z-10 p-6 sm:p-8 space-y-6">
                                {/* Icon and stat */}
                                <div className="flex items-start justify-between">
                                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <benefit.icon className="h-7 w-7" />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                                            {benefit.stat}
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            {benefit.context}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-3">
                                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>

                                {/* Link */}
                                <button className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1">
                                    Pelajari selengkapnya
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>

                            {/* Border */}
                            <div className="absolute inset-0 rounded-2xl border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 sm:mt-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Siap untuk mengalami perbedaannya?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                        Lebih dari 1000 pemain billiard telah merasakan kemudahan dan keadilan sistem kami.
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                        Mulai Sekarang - Gratis
                    </button>
                </div>
            </div>
        </section>
    );
}
