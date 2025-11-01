import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Toaster, toast } from 'sonner';
import { PlusCircle, Trash2, Eye, TrendingUp, Users, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/Components/ui/sheet";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import StatCard from '@/Components/StatCard';
import EmptyState from '@/Components/EmptyState';
import SearchFilter from '@/Components/SearchFilter';
import { TableSkeleton } from '@/Components/Skeleton';
import FormField from '@/Components/FormField';
import DynamicFormArray from '@/Components/DynamicFormArray';
import { validateRequired, validateNumber, validateArrayItems } from '@/lib/formValidation';


export default function Dashboard({ auth }) {
    // State utama
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    
    // State untuk form baru
    const [sessionName, setSessionName] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [serviceCharge, setServiceCharge] = useState('0');
    const [discount, setDiscount] = useState('0');
    const [tables, setTables] = useState([{ table_number: '', duration_hours: '' }]);
    const [members, setMembers] = useState([{ name: '' }]);
    
    // State untuk validation
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const [isLoading, setIsLoading] = useState(false);

    // Fetch data sesi saat komponen dimuat
    useEffect(() => {
        fetchSessions();
    }, []);

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate session name
        if (!sessionName.trim()) {
            newErrors.sessionName = 'Nama sesi harus diisi';
        }

        // Validate hourly rate
        if (!hourlyRate) {
            newErrors.hourlyRate = 'Tarif per jam harus diisi';
        } else if (isNaN(hourlyRate) || parseFloat(hourlyRate) <= 0) {
            newErrors.hourlyRate = 'Tarif per jam harus berupa angka positif';
        }

        // Validate tables
        const tableErrors = validateArrayItems(tables, ['table_number', 'duration_hours'], 'Meja');
        if (Object.keys(tableErrors).length > 0) {
            Object.assign(newErrors, tableErrors);
        }

        // Validate members
        const memberErrors = validateArrayItems(members, ['name'], 'Anggota');
        if (Object.keys(memberErrors).length > 0) {
            Object.assign(newErrors, memberErrors);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Filter sessions ketika search value berubah
    useEffect(() => {
        if (searchValue.trim() === '') {
            setFilteredSessions(sessions);
        } else {
            const filtered = sessions.filter(session =>
                session.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredSessions(filtered);
        }
    }, [searchValue, sessions]);

    // Calculate stats
    const stats = {
        totalSessions: sessions.length,
        totalMembers: sessions.reduce((sum, session) => sum + (session.members?.length || 0), 0),
        totalRevenue: sessions.reduce((sum, session) => sum + (session.total_bill || 0), 0),
    };

    const fetchSessions = async () => {
        try {
            setIsFetching(true);
            const response = await axios.get('/api/game-sessions');
            setSessions(response.data);
        } catch (error) {
            toast.error('Gagal memuat data sesi.');
            console.error(error);
        } finally {
            setIsFetching(false);
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
        // Clear error untuk field ini ketika user mulai mengedit
        if (errors[`${index}.table_number`] || errors[`${index}.duration_hours`]) {
            setTouched(prev => ({ ...prev, [`tables.${index}`]: true }));
        }
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
        
        // Validate form first
        if (!validateForm()) {
            toast.error('Harap perbaiki error pada form');
            return;
        }

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
            setErrors({});
            setTouched({});
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

            <div className="py-6 sm:py-12">
                {/* Stats Cards */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <StatCard
                            icon={TrendingUp}
                            label="Total Sesi"
                            value={stats.totalSessions}
                            subtext="Sesi permainan dibuat"
                        />
                        <StatCard
                            icon={Users}
                            label="Total Anggota"
                            value={stats.totalMembers}
                            subtext="Anggota yang hadir"
                        />
                        <StatCard
                            icon={Wallet}
                            label="Total Pendapatan"
                            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
                            subtext="Dari semua sesi"
                        />
                    </div>
                </div>

                {/* Form dan List */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Kolom Kiri: Form Input */}
                    <div className="md:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Buat Sesi Baru</CardTitle>
                                <CardDescription>Isi detail permainan untuk menghitung tagihan.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6">
                                    <FormField
                                        id="sessionName"
                                        label="Nama Sesi"
                                        placeholder="Contoh: Main Minggu Malam"
                                        value={sessionName}
                                        onChange={(e) => setSessionName(e.target.value)}
                                        error={errors.sessionName}
                                        helperText="Berikan nama yang deskriptif untuk sesi ini"
                                        required
                                    />
                                    
                                    <FormField
                                        id="hourlyRate"
                                        label="Tarif per Jam (Rp)"
                                        type="number"
                                        placeholder="50000"
                                        value={hourlyRate}
                                        onChange={(e) => setHourlyRate(e.target.value)}
                                        error={errors.hourlyRate}
                                        helperText="Masukkan tarif per jam untuk perhitungan"
                                        required
                                        min="1"
                                    />

                                    <DynamicFormArray
                                        label="Data Meja"
                                        items={tables}
                                        onAdd={addTableField}
                                        onRemove={removeTableField}
                                        onChange={handleTableChange}
                                        fields={[
                                            { name: 'table_number', placeholder: 'Nomor Meja', type: 'text', required: true },
                                            { name: 'duration_hours', placeholder: 'Durasi (jam)', type: 'number', required: true }
                                        ]}
                                        errors={errors}
                                        helperText="Daftar meja yang digunakan"
                                        addButtonLabel="Tambah Meja"
                                    />

                                    <DynamicFormArray
                                        label="Anggota Hadir"
                                        items={members}
                                        onAdd={addMemberField}
                                        onRemove={removeMemberField}
                                        onChange={handleMemberChange}
                                        fields={[
                                            { name: 'name', placeholder: 'Nama Anggota', type: 'text', required: true }
                                        ]}
                                        errors={errors}
                                        helperText="Daftar anggota yang hadir"
                                        addButtonLabel="Tambah Anggota"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            id="serviceCharge"
                                            label="Service Charge (Rp)"
                                            type="number"
                                            value={serviceCharge}
                                            onChange={(e) => setServiceCharge(e.target.value)}
                                            error={errors.serviceCharge}
                                            min="0"
                                        />
                                        <FormField
                                            id="discount"
                                            label="Diskon (Rp)"
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(e.target.value)}
                                            error={errors.discount}
                                            min="0"
                                        />
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
                            <CardContent className="space-y-4">
                                <SearchFilter
                                    placeholder="Cari nama sesi..."
                                    onSearch={setSearchValue}
                                    showFilters={false}
                                />
                                
                                {isFetching ? (
                                    <TableSkeleton rows={3} />
                                ) : filteredSessions.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama Sesi</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredSessions.map(session => (
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
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <EmptyState
                                        icon={Eye}
                                        title={searchValue ? "Sesi tidak ditemukan" : "Belum ada sesi"}
                                        description={
                                            searchValue 
                                                ? `Tidak ada sesi yang cocok dengan "${searchValue}"`
                                                : "Mulai dengan membuat sesi baru di form sebelah kiri"
                                        }
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sheet untuk menampilkan detail hasil split bill */}
            <Sheet open={!!selectedSessionDetails} onOpenChange={(open) => !open && setSelectedSessionDetails(null)}>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{selectedSessionDetails?.session.name || 'Detail Sesi'}</SheetTitle>
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
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Memuat detail...</p>
                        </div>
                    </div>
                )}
              </SheetContent>
            </Sheet>
        </AuthenticatedLayout>
    );
}