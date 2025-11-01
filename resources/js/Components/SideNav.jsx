import { Link } from '@inertiajs/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, History, LogOut, Users } from 'lucide-react';

export default function SideNav({ user, open, onOpenChange }) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-full max-w-xs p-0">
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-xl">Billiard Split Bill</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full pb-6">
                    <nav className="flex-grow px-4 space-y-2">
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

                    <div className="border-t mt-auto p-4 space-y-4">
                         <div className="text-base font-medium">{user.name}</div>
                         <Button asChild variant="outline" className="w-full justify-start text-base">
                            <Link href={route('logout')} method="post" as="button">
                                <LogOut className="mr-3 h-5 w-5" />
                                Keluar
                            </Link>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}