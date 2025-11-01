import React from 'react';
import { Star, Users, TrendingUp, Award } from 'lucide-react';

const testimonials = [
    {
        name: 'Ahmad Wijaya',
        role: 'Pecinta Billiard Jakarta',
        content: 'Aplikasi ini sangat membantu! Dulu saya sering berdebat dengan teman tentang pembagian biaya. Sekarang semua transparan dan adil.',
        rating: 5,
        avatar: '👨‍💼'
    },
    {
        name: 'Siti Nurhaliza',
        role: 'Owner Billiard Club Bandung',
        content: 'Pelanggan saya lebih puas karena kalkulasi yang jelas. Ini menjadi nilai tambah untuk bisnis saya.',
        rating: 5,
        avatar: '👩‍💼'
    },
    {
        name: 'Budi Santoso',
        role: 'Atlet Billiard Semi-Pro',
        content: 'Fitur tracking waktu real-time-nya sangat akurat. Sempurna untuk kompetisi dan latihan kelompok.',
        rating: 5,
        avatar: '🧑‍🤝‍🧑'
    },
    {
        name: 'Eka Putri',
        role: 'Mahasiswa, Yogyakarta',
        content: 'Interface-nya sangat mudah digunakan. Bahkan kakek saya yang tidak tech-savvy bisa langsung paham!',
        rating: 5,
        avatar: '👧'
    }
];

const stats = [
    {
        icon: Users,
        value: '1,250+',
        label: 'Pengguna Aktif',
        color: 'text-blue-600 dark:text-blue-400'
    },
    {
        icon: TrendingUp,
        value: '15,000+',
        label: 'Sesi Terhitung',
        color: 'text-purple-600 dark:text-purple-400'
    },
    {
        icon: Award,
        value: '4.9/5',
        label: 'Rating Aplikasi',
        color: 'text-pink-600 dark:text-pink-400'
    },
    {
        icon: Star,
        value: '98%',
        label: 'Kepuasan Pengguna',
        color: 'text-yellow-600 dark:text-yellow-400'
    }
];

export default function SocialProofSection() {
    return (
        <section className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-16 sm:mb-20">
                    <span className="inline-block px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-sm font-semibold">
                        KEPERCAYAAN PENGGUNA
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                        Dipercaya oleh Ribuan Pemain
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            Billiard di Seluruh Indonesia
                        </span>
                    </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 text-center border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                        >
                            <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.color} mx-auto mb-3`} />
                            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                {stat.value}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
                        Apa Kata Pengguna Kami
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-lg group"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-slate-700 dark:text-slate-200 leading-relaxed mb-6 italic">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <div className="text-2xl sm:text-3xl">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Quote icon background */}
                                <div className="absolute top-4 right-4 text-slate-100 dark:text-slate-700 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-1.002 0-2 .75-2 1.972V11c0 1-1 2-2 2s-1.022-1-1-2V5c0-1-1-1-1-1s-1 .75-1 1.972V20c0 1 0 3 1 4 1 0 0-1 1-1z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 sm:mt-20 text-center">
                    <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">
                        Bergabunglah dengan komunitas pemain billiard yang puas di seluruh Indonesia
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                            Daftar Gratis Sekarang
                        </button>
                        <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                            Lihat Lebih Banyak Review
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
