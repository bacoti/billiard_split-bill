import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateSession({ auth }) {
    // State untuk detail sesi
    const [sessionName, setSessionName] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [serviceCharge, setServiceCharge] = useState('0');
    const [discount, setDiscount] = useState('0');
    const [tables, setTables] = useState([{ table_number: '', duration_hours: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    // State baru untuk manajemen anggota
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    // Mengambil daftar anggota dari database saat halaman dimuat
    useEffect(() => {
        axios.get(route('api.players.index'))
            .then(response => {
                setAvailablePlayers(response.data);
            })
            .catch(() => {
                toast.error('Gagal memuat daftar anggota tetap.');
            });
    }, []);

    const handleTableChange = (index, event) => {
        const values = [...tables];
        values[index][event.target.name] = event.target.value;
        setTables(values);
    };

    const addTableField = () => {
        setTables([...tables, { table_number: '', duration_hours: '' }]);
    };

    const removeTableField = (index) => {
        if (tables.length > 1) {
            const values = [...tables];
            values.splice(index, 1);
            setTables(values);
        }
    };

    // Handler baru untuk memilih anggota dari checkbox
    const handlePlayerSelection = (player, checked) => {
        if (checked) {
            setSelectedPlayers(prev => [...prev, player]);
        } else {
            setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedPlayers.length === 0) {
            toast.error('Pilih minimal satu anggota yang hadir.');
            return;
        }
        
        setIsLoading(true);
        const payload = { 
            name: sessionName, 
            hourly_rate: hourlyRate, 
            service_charge: serviceCharge, 
            discount: discount, 
            tables, 
            members: selectedPlayers.map(p => ({ name: p.name })) // Mengirim nama dari anggota yang dipilih
        };

        try {
            await axios.post(route('api.game-sessions.store'), payload);
            toast.success('Sesi baru berhasil dibuat!');
            router.get(route('dashboard')); // Redirect ke halaman riwayat
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                errorMessages.forEach(msg => toast.error(msg));
            } else {
                toast.error('Terjadi kesalahan saat membuat sesi.');
            }
            console.error(error);
            setIsLoading(false);
        }
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Buat Sesi Baru"
        >
            <Head title="Buat Sesi Baru" />
            
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                    <Card>
                        <form onSubmit={handleSubmit}>
                            <CardHeader>
                                <CardTitle>Detail Permainan</CardTitle>
                                <CardDescription>Isi semua data di bawah ini untuk menghitung tagihan secara otomatis.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionName">Nama Sesi</Label>
                                    <Input id="sessionName" placeholder="Contoh: Main Malam Minggu" value={sessionName} onChange={(e) => setSessionName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hourlyRate">Tarif per Jam (Rp)</Label>
                                    <Input id="hourlyRate" type="number" placeholder="50000" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
                                </div>
                                <div className='space-y-3 border-t pt-6'>
                                    <Label>Data Meja</Label>
                                    {tables.map((table, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input name="table_number" placeholder={`Meja #${index + 1}`} value={table.table_number} onChange={e => handleTableChange(index, e)} required className="w-1/3" />
                                            <Input name="duration_hours" type="number" step="0.1" placeholder="Durasi (jam)" value={table.duration_hours} onChange={e => handleTableChange(index, e)} required className="w-2/3" />
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeTableField(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={addTableField}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Meja
                                    </Button>
                                </div>
                                
                                {/* Bagian Anggota Hadir yang Baru */}
                                <div className='space-y-3 border-t pt-6'>
                                    <Label>Pilih Anggota Hadir</Label>
                                    <div className="space-y-3 p-4 border rounded-md max-h-60 overflow-y-auto">
                                        {availablePlayers.length > 0 ? availablePlayers.map(player => (
                                            <div key={player.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`player-${player.id}`}
                                                    onCheckedChange={(checked) => handlePlayerSelection(player, checked)}
                                                />
                                                <label
                                                    htmlFor={`player-${player.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {player.name}
                                                </label>
                                            </div>
                                        )) : <p className="text-sm text-muted-foreground">Belum ada anggota. Silakan tambah di halaman Manajemen Anggota.</p>}
                                    </div>
                                </div>

                                 <div className="grid grid-cols-2 gap-4 border-t pt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="serviceCharge">Service Charge (Rp)</Label>
                                        <Input id="serviceCharge" type="number" placeholder="0" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discount">Diskon (Rp)</Label>
                                        <Input id="discount" type="number" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
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