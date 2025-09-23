import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Toaster, toast } from 'sonner';
import { PlusCircle, Trash2, Eye } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import jsPDF from 'jspdf';
import 'jspdf-autotable';


export default function Dashboard({ auth }) {
    // State utama
    const [sessions, setSessions] = useState([]);
    const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
    
    // State untuk form baru
    const [sessionName, setSessionName] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [serviceCharge, setServiceCharge] = useState('0');
    const [discount, setDiscount] = useState('0');
    const [tables, setTables] = useState([{ table_number: '', duration_hours: '' }]);
    const [members, setMembers] = useState([{ name: '' }]);
    
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data sesi saat komponen dimuat
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get('/api/game-sessions');
            setSessions(response.data);
        } catch (error) {
            toast.error('Gagal memuat data sesi.');
            console.error(error);
        }
    };

    const fetchSessionDetails = async (sessionId) => {
        try {
            const response = await axios.get(`/api/game-sessions/${sessionId}`);
            setSelectedSessionDetails(response.data);
        } catch (error) {
            toast.error('Gagal memuat detail sesi.');
            console.error(error);
        }
    };
    
    // Handler untuk form Table
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

    // Handler untuk form Member
    const handleMemberChange = (index, event) => {
        const values = [...members];
        values[index].name = event.target.value;
        setMembers(values);
    };

    const addMemberField = () => {
        setMembers([...members, { name: '' }]);
    };

    const removeMemberField = (index) => {
        if (members.length > 1) {
            const values = [...members];
            values.splice(index, 1);
            setMembers(values);
        }
    };

    // Reset form
    const resetForm = () => {
        setSessionName('');
        setHourlyRate('');
        setServiceCharge('0');
        setDiscount('0');
        setTables([{ table_number: '', duration_hours: '' }]);
        setMembers([{ name: '' }]);
    };

    // Handler untuk submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name: sessionName,
            hourly_rate: hourlyRate,
            service_charge: serviceCharge,
            discount: discount,
            tables: tables,
            members: members,
        };

        try {
            await axios.post('/api/game-sessions', payload);
            toast.success('Sesi baru berhasil dibuat!');
            fetchSessions();
            resetForm();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                errorMessages.forEach(msg => toast.error(msg));
            } else {
                toast.error('Terjadi kesalahan saat membuat sesi.');
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Hapus Sesi
    const handleDeleteSession = async (sessionId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus sesi ini?')) return;
        
        try {
            await axios.delete(`/api/game-sessions/${sessionId}`);
            toast.success('Sesi berhasil dihapus.');
            fetchSessions();
            if(selectedSessionDetails?.session.id === sessionId) {
                setSelectedSessionDetails(null);
            }
        } catch (error) {
             toast.error('Gagal menghapus sesi.');
             console.error(error);
        }
    }

    // Fungsi Ekspor PDF
    const handleExportPDF = () => {
        if (!selectedSessionDetails) return;

        const doc = new jsPDF();
        const { session, calculation } = selectedSessionDetails;

        doc.setFontSize(20);
        doc.text(session.name, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Tanggal: ${new Date(session.created_at).toLocaleString('id-ID')}`, 14, 30);

        doc.autoTable({
            startY: 40,
            head: [['Deskripsi', 'Jumlah']],
            body: [
                ['Subtotal Meja', `Rp ${calculation.subtotal.toLocaleString('id-ID')}`],
                [`Pajak (${session.tax_percent}%)`, `Rp ${calculation.tax_amount.toLocaleString('id-ID')}`],
                ['Service Charge', `Rp ${Number(session.service_charge).toLocaleString('id-ID')}`],
                ['Diskon', `- Rp ${Number(session.discount).toLocaleString('id-ID')}`],
            ],
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] },
        });
        
        let finalY = doc.lastAutoTable.finalY;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('TOTAL TAGIHAN:', 14, finalY + 10);
        doc.text(`Rp ${calculation.total_bill.toLocaleString('id-ID')}`, 200, finalY + 10, { align: 'right' });
        
        doc.setFont(undefined, 'normal');
        doc.autoTable({
            startY: finalY + 20,
            head: [['Nama Anggota', 'Bayar Masing-Masing']],
            body: session.members.map(member => [
                member.name,
                `Rp ${calculation.bill_per_member.toLocaleString('id-ID')}`
            ]),
            theme: 'striped',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] },
        });

        doc.save(`split-bill-${session.name.replace(/\s+/g, '-')}.pdf`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Billiard Split Bill</h2>}
        >
            <Head title="Dashboard" />
            <Toaster richColors position="top-center" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Kolom Kiri: Form Input */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Buat Sesi Baru</CardTitle>
                                <CardDescription>Isi detail permainan untuk menghitung tagihan.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionName">Nama Sesi</Label>
                                        <Input id="sessionName" placeholder="Contoh: Main Minggu Malam" value={sessionName} onChange={(e) => setSessionName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyRate">Tarif per Jam (Rp)</Label>
                                        <Input id="hourlyRate" type="number" placeholder="50000" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
                                    </div>
                                    <div className='space-y-3'>
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
                                    <div className='space-y-3'>
                                        <Label>Anggota Hadir</Label>
                                        {members.map((member, index) => (
                                             <div key={index} className="flex items-center gap-2">
                                                 <Input name="name" placeholder={`Nama Anggota ${index + 1}`} value={member.name} onChange={e => handleMemberChange(index, e)} required />
                                                 <Button type="button" variant="destructive" size="icon" onClick={() => removeMemberField(index)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                             </div>
                                        ))}
                                         <Button type="button" variant="outline" size="sm" onClick={addMemberField}>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota
                                        </Button>
                                    </div>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="serviceCharge">Service Charge (Rp)</Label>
                                            <Input id="serviceCharge" type="number" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="discount">Diskon (Rp)</Label>
                                            <Input id="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Menyimpan...' : 'Hitung & Simpan Sesi'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                    {/* Kolom Kanan: Daftar Sesi */}
                    <div className="md:col-span-2">
                         <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Sesi</CardTitle>
                                <CardDescription>Lihat sesi permainan yang sudah Anda simpan.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Sesi</TableHead>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions.length > 0 ? sessions.map(session => (
                                            <TableRow key={session.id}>
                                                <TableCell className="font-medium">{session.name}</TableCell>
                                                <TableCell>{new Date(session.created_at).toLocaleDateString('id-ID')}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Sheet>
                                                      <SheetTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => fetchSessionDetails(session.id)}>
                                                            <Eye className="h-4 w-4 mr-2"/> Lihat Hasil
                                                        </Button>
                                                      </SheetTrigger>
                                                    </Sheet>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : (
                                            <TableRow>
                                                <TableCell colSpan="3" className="text-center">Belum ada sesi.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sheet untuk menampilkan detail hasil split bill */}
            <Sheet open={!!selectedSessionDetails} onOpenChange={(open) => !open && setSelectedSessionDetails(null)}>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{selectedSessionDetails?.session.name}</SheetTitle>
                  <SheetDescription>
                    Detail perhitungan dan pembagian tagihan.
                  </SheetDescription>
                </SheetHeader>
                {selectedSessionDetails ? (
                    <div className="mt-6 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Rincian Tagihan</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Subtotal Meja</span><span>Rp {selectedSessionDetails.calculation.subtotal.toLocaleString('id-ID')}</span></div>
                                    <div className="flex justify-between"><span>Pajak (PB1 {selectedSessionDetails.session.tax_percent}%)</span><span>Rp {selectedSessionDetails.calculation.tax_amount.toLocaleString('id-ID')}</span></div>
                                    <div className="flex justify-between"><span>Service Charge</span><span>Rp {Number(selectedSessionDetails.session.service_charge).toLocaleString('id-ID')}</span></div>
                                    <div className="flex justify-between text-red-500"><span>Diskon</span><span>- Rp {Number(selectedSessionDetails.session.discount).toLocaleString('id-ID')}</span></div>
                                    <hr className="my-2"/>
                                    <div className="flex justify-between font-bold text-base"><span>TOTAL TAGIHAN</span><span>Rp {selectedSessionDetails.calculation.total_bill.toLocaleString('id-ID')}</span></div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Pembagian per Anggota</CardTitle>
                                <CardDescription>Total tagihan dibagi {selectedSessionDetails.calculation.member_count} orang.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-sm text-muted-foreground">Masing-masing bayar</p>
                                    <p className="text-3xl font-bold">Rp {selectedSessionDetails.calculation.bill_per_member.toLocaleString('id-ID')}</p>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Anggota</TableHead>
                                            <TableHead className="text-right">Nominal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedSessionDetails.session.members.map(member => (
                                            <TableRow key={member.id}>
                                                <TableCell>{member.name}</TableCell>
                                                <TableCell className="text-right font-mono">Rp {selectedSessionDetails.calculation.bill_per_member.toLocaleString('id-ID')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <div className="mt-6">
                            <Button onClick={handleExportPDF} className="w-full">
                                Ekspor ke PDF
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p>Memuat detail...</p>
                )}
              </SheetContent>
            </Sheet>
        </AuthenticatedLayout>
    );
}