import { useState } from 'react';
import SideNav from '@/Components/SideNav';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner'; // Impor Toaster

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigation, setShowingNavigation] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sisipkan SideNav di sini */}
            <SideNav user={user} open={showingNavigation} onOpenChange={setShowingNavigation} />
            
            {/* Toaster untuk notifikasi global */}
            <Toaster richColors position="top-center" />

            <div className="flex flex-col">
                {/* Bar Atas Minimalis untuk Tombol Menu & Judul */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-30">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center min-w-0 flex-1">
                                {/* Tombol Hamburger Menu, hanya muncul di mobile */}
                                <Button
                                    onClick={() => setShowingNavigation(true)}
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 flex-shrink-0"
                                >
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Buka Menu</span>
                                </Button>
                                
                                {/* Judul Halaman */}
                                {header && (
                                     <div className="text-gray-800 dark:text-gray-200 font-semibold text-base sm:text-lg truncate">
                                         {header}
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Konten Halaman Utama */}
                <main className="flex-1 w-full overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
}