import React from 'react';
import { BarChart3, Users, Clock, Zap, Lock, TrendingUp } from 'lucide-react';

const features = [
    {
        icon: BarChart3,
        title: 'Kalkulasi Otomatis',
        description: 'Sistem cerdas yang otomatis menghitung biaya per pemain berdasarkan durasi bermain dan tarif tabel.',
        color: 'from-blue-400 to-blue-600',
        highlight: 'Akurasi 100%'
    },
    {
        icon: Users,
        title: 'Manajemen Pemain',
        description: 'Kelola grup pemain dengan mudah. Tambah, hapus, atau ubah pemain kapan saja tanpa rumit.',
        color: 'from-purple-400 to-purple-600',
        highlight: 'Fleksibel'
    },
    {
        icon: Clock,
        title: 'Tracking Waktu Real-time',
        description: 'Pantau durasi bermain setiap pemain secara real-time dengan notifikasi saat terjadi perubahan.',
        color: 'from-pink-400 to-pink-600',
        highlight: 'Live Update'
    },
    {
        icon: TrendingUp,
        title: 'Laporan & Statistik',
        description: 'Dapatkan laporan lengkap tentang riwayat permainan, biaya, dan tren pengeluaran Anda.',
        color: 'from-emerald-400 to-emerald-600',
        highlight: 'Insight Mendalam'
    },
    {
        icon: Lock,
        title: 'Data Aman & Terpercaya',
        description: 'Enkripsi tingkat enterprise untuk melindungi data pribadi dan riwayat transaksi Anda.',
        color: 'from-orange-400 to-orange-600',
        highlight: 'Terenkripsi'
    },
    {
        icon: Zap,
        title: 'Interface Intuitif',
        description: 'Desain yang user-friendly sehingga siapa pun bisa langsung menggunakan tanpa tutorial panjang.',
        color: 'from-yellow-400 to-yellow-600',
        highlight: 'Mudah Dipelajari'
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-20 sm:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center space-y-4 mb-16 sm:mb-20">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
                        Fitur Unggulan yang
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            Membuat Hidup Lebih Mudah
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Semua fitur yang Anda butuhkan untuk mengelola dan membagi biaya billiard dengan sempurna
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg"
                        >
                            {/* Corner accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-bl-full" style={{backgroundImage: `linear-gradient(to right, #3b82f6, #9333ea)`}}></div>

                            {/* Icon */}
                            <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}>
                                <feature.icon className="h-6 w-6" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 space-y-3">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <span className="ml-2 text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                                        {feature.highlight}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-16 sm:mt-20 text-center">
                    <p className="text-slate-600 dark:text-slate-300 mb-6">
                        Pengin tahu lebih detail tentang setiap fitur?
                    </p>
                    <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                        Jelajahi Dokumentasi Lengkap
                    </button>
                </div>
            </div>
        </section>
    );
}
