import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Checkbox } from "@/Components/ui/checkbox";

export default function CreateSession({ auth }) {
    // State untuk detail sesi utama
    const [sessionName, setSessionName] = useState('');
    const [rentalFee, setRentalFee] = useState('');
    const [pb1Percent, setPb1Percent] = useState('10');
    const [servicePercent, setServicePercent] = useState('5');
    const [tipAmount, setTipAmount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    // State untuk manajemen pemain
    const [availablePlayers, setAvailablePlayers] = useState([]); // Daftar semua pemain dari DB
    const [attendingPlayers, setAttendingPlayers] = useState([]); // Daftar pemain yang dipilih untuk sesi ini

    // Ambil daftar semua pemain saat halaman dimuat
    useEffect(() => {
        axios.get(route('api.players.index'))
            .then(response => {
                setAvailablePlayers(response.data);
            })
            .catch(() => {
                toast.error('Gagal memuat daftar anggota tetap.');
            });
    }, []);
    
    // Fungsi untuk menambah/menghapus pemain dari daftar hadir
    const handlePlayerSelection = (player, checked) => {
        if (checked) {
            // Tambahkan pemain ke daftar hadir dengan waktu default
            setAttendingPlayers(prev => [...prev, { ...player, start_time: '', end_time: '' }]);
        } else {
            // Hapus pemain dari daftar hadir
            setAttendingPlayers(prev => prev.filter(p => p.id !== player.id));
        }
    };

    // Fungsi untuk mengubah waktu main pemain yang hadir
    const handleTimeChange = (playerId, field, value) => {
        setAttendingPlayers(prev => 
            prev.map(p => 
                p.id === playerId ? { ...p, [field]: value } : p
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi frontend sederhana
        if (attendingPlayers.length === 0) {
            toast.error('Pilih minimal satu pemain yang hadir.');
            return;
        }
        for (const player of attendingPlayers) {
            if (!player.start_time || !player.end_time) {
                toast.error(`Harap isi waktu main untuk ${player.name}.`);
                return;
            }
        }
        
        setIsLoading(true);
        const payload = { 
            name: sessionName, 
            rental_fee: rentalFee,
            pb1_percent: pb1Percent,
            service_percent: servicePercent,
            tip_amount: tipAmount,
            players: attendingPlayers, 
        };

        try {
            await axios.post(route('api.game-sessions.store'), payload);
            toast.success('Sesi baru berhasil dibuat!');
            router.get(route('session.history'));
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                errorMessages.forEach(msg => toast.error(msg));
            } else {
                toast.error('Terjadi kesalahan saat membuat sesi.');
            }
            setIsLoading(false);
        }
    };
    
    return (
        <AuthenticatedLayout user={auth.user} header="Buat Sesi Baru">
            <Head title="Buat Sesi Baru" />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Detail Sesi Permainan</CardTitle>
                                <CardDescription>Isi detail sewa dan pilih pemain yang hadir.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Detail Sesi */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionName">Nama Sesi</Label>
                                        <Input id="sessionName" value={sessionName} onChange={(e) => setSessionName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rentalFee">Biaya Sewa Lantai (Harian)</Label>
                                        <Input id="rentalFee" type="number" placeholder="1000000" value={rentalFee} onChange={(e) => setRentalFee(e.target.value)} required min="1" />
                                    </div>
                                </div>
                                
                                {/* Pilih Pemain dari Daftar */}
                                <div className='space-y-3 border-t pt-6'>
                                    <Label className="text-lg font-semibold">Pilih Pemain</Label>
                                    <div className="space-y-3 p-4 border rounded-md max-h-60 overflow-y-auto">
                                        {availablePlayers.length > 0 ? availablePlayers.map(player => (
                                            <div key={player.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`player-${player.id}`}
                                                    onCheckedChange={(checked) => handlePlayerSelection(player, checked)}
                                                />
                                                <label htmlFor={`player-${player.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{player.name}</label>
                                            </div>
                                        )) : <p className="text-sm text-muted-foreground">Belum ada anggota. Silakan tambah di halaman Manajemen Anggota.</p>}
                                    </div>
                                </div>
                                
                                {/* Isi Waktu untuk Pemain yang Hadir */}
                                {attendingPlayers.length > 0 && (
                                    <div className="space-y-3 border-t pt-6">
                                        <Label className="text-lg font-semibold">Isi Waktu Main</Label>
                                        {attendingPlayers.map((player) => (
                                            <div key={player.id} className="flex flex-col sm:flex-row items-center gap-2 p-3 border rounded-md">
                                                <Label className="w-full sm:w-1/3 font-medium">{player.name}</Label>
                                                <div className="flex w-full sm:w-2/3 gap-2 items-center">
                                                    <Input name="start_time" type="time" onChange={e => handleTimeChange(player.id, 'start_time', e.target.value)} required />
                                                    <span className="text-muted-foreground">-</span>
                                                    <Input name="end_time" type="time" onChange={e => handleTimeChange(player.id, 'end_time', e.target.value)} required />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Biaya Tambahan */}
                                <div className="space-y-4 border-t pt-6">
                                    <Label className="text-lg font-semibold">Biaya Tambahan</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="pb1Percent">PB1 (%)</Label>
                                            <Input id="pb1Percent" type="number" step="0.1" value={pb1Percent} onChange={(e) => setPb1Percent(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="servicePercent">Service Charge (%)</Label>
                                            <Input id="servicePercent" type="number" step="0.1" value={servicePercent} onChange={(e) => setServicePercent(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="tipAmount">Tip / Tambahan (Rp)</Label>
                                            <Input id="tipAmount" type="number" value={tipAmount} onChange={(e) => setTipAmount(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full text-base py-6" disabled={isLoading}>
                                    {isLoading ? 'Menyimpan...' : 'Hitung & Simpan Sesi'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}