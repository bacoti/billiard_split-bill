import React from 'react';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Facebook } from 'lucide-react';

const footerLinks = {
    Product: [
        { label: 'Fitur', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Changelog', href: '#' }
    ],
    Company: [
        { label: 'About Us', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press Kit', href: '#' }
    ],
    Resources: [
        { label: 'Documentation', href: '#' },
        { label: 'Guides', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Community', href: '#' }
    ],
    Legal: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Cookies', href: '#' },
        { label: 'Contact', href: '#' }
    ]
};

const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600 dark:hover:text-blue-400' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500 dark:hover:text-sky-400' },
    { icon: Github, href: '#', label: 'Github', color: 'hover:text-slate-900 dark:hover:text-white' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700 dark:hover:text-blue-400' }
];

export default function Footer() {
    return (
        <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12 pb-12 border-b border-slate-800">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="text-xl font-bold text-white mb-4">
                            🎱 BilliarSplit
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Solusi cerdas untuk pembagian biaya billiard yang adil dan transparan.
                        </p>
                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Mail className="h-4 w-4" />
                                <span>support@billiarsplit.id</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Phone className="h-4 w-4" />
                                <span>+62 812-3456-7890</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <MapPin className="h-4 w-4" />
                                <span>Jakarta, Indonesia</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Sections */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8">
                    {/* Copyright */}
                    <div className="text-sm text-slate-400">
                        <p>© 2025 BilliarSplit. Semua hak dilindungi.</p>
                        <p className="mt-2">Dibuat dengan ❤️ untuk komunitas billiard Indonesia</p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                aria-label={social.label}
                                className={`h-10 w-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all ${social.color}`}
                            >
                                <social.icon className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Banner */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-lg font-semibold text-white mb-1">
                                Dapatkan Update Terbaru
                            </h4>
                            <p className="text-sm text-slate-400">
                                Subscribe untuk tips, fitur baru, dan update komunitas
                            </p>
                        </div>
                        <div className="flex gap-2 min-w-max">
                            <input
                                type="email"
                                placeholder="Email Anda"
                                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
