import { Link } from '@inertiajs/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/Components/ui/sheet";
import { Button } from '@/Components/ui/button';
import { Home, PlusCircle, History, LogOut, Users } from 'lucide-react';

export default function SideNav({ user, open, onOpenChange }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full max-w-xs p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 flex-shrink-0">
                    <SheetTitle className="text-xl">Billiard Split Bill</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col flex-grow overflow-y-auto">
                    <nav className="px-4 space-y-2 py-4 flex-grow">
                        <Button asChild variant={route().current('session.history') ? 'secondary' : 'ghost'} className="w-full justify-start text-base">
                            <Link href={route('session.history')}>
                                <History className="mr-3 h-5 w-5" />
                                Riwayat Sesi
                            </Link>
                        </Button>
                        <Button asChild variant={route().current('session.create') ? 'secondary' : 'ghost'} className="w-full justify-start text-base">
                            <Link href={route('session.create')}>
                                <PlusCircle className="mr-3 h-5 w-5" />
                                Buat Sesi Baru
                            </Link>
                        </Button>
                        <Button asChild variant={route().current('players.index') ? 'secondary' : 'ghost'} className="w-full justify-start text-base">
                            <Link href={route('players.index')}>
                                <Users className="mr-3 h-5 w-5" />
                                Manajemen Anggota
                            </Link>
                        </Button>
                    </nav>
                </div>

                    <div className="border-t p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50 flex-shrink-0">
                         <div className="text-sm text-gray-600 dark:text-gray-400 px-2">Akun</div>
                         <div className="text-base font-semibold text-gray-900 dark:text-gray-100 px-2">{user.name}</div>
                         <Button asChild className="w-full justify-start text-base bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700">
                            <Link href={route('logout')} method="post" as="button">
                                <LogOut className="mr-3 h-5 w-5" />
                                Keluar
                            </Link>
                        </Button>
                    </div>
            </SheetContent>
        </Sheet>
    );
}