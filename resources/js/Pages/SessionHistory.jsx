import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Eye, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function SessionHistory({ auth }) {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
    const [allPlayers, setAllPlayers] = useState([]);

    useEffect(() => {
        fetchSessions();
        fetchAllPlayers();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await axios.get(route('api.game-sessions.index'));
            setSessions(response.data);
        } catch (error) {
            toast.error('Gagal memuat data sesi.');
            console.error(error);
        }
    };

    const fetchAllPlayers = async () => {
        try {
            const response = await axios.get(route('api.players.index'));
            setAllPlayers(response.data);
        } catch (error) {
            console.error("Gagal memuat daftar semua anggota:", error);
        }
    };

    const fetchSessionDetails = async (sessionId) => {
        try {
            const response = await axios.get(route('api.game-sessions.show', sessionId));
            setSelectedSessionDetails(response.data);
        } catch (error) {
            toast.error('Gagal memuat detail sesi.');
            console.error(error);
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus sesi ini?')) return;
        try {
            await axios.delete(route('api.game-sessions.destroy', sessionId));
            toast.success('Sesi berhasil dihapus.');
            fetchSessions();
            if (selectedSessionDetails?.session.id === sessionId) {
                setSelectedSessionDetails(null);
            }
        } catch (error) {
            toast.error('Gagal menghapus sesi.');
            console.error(error);
        }
    }

    const handleExportPDF = () => {
        if (!selectedSessionDetails) return;

        const doc = new jsPDF();
        const { session, calculation } = selectedSessionDetails;

        doc.setFontSize(20);
        doc.text(session.name, 14, 22);
        // ... (sisa kode PDF tidak berubah)
        doc.save(`split-bill-${session.name.replace(/\s+/g, '-')}.pdf`);
    };

    // ==================================================================
    // == FUNGSI YANG DIPERBARUI ADA DI SINI ==
    // ==================================================================
    const handleShareToWA = (memberName, billAmount) => {
        // 1. Validasi input dasar
        if (!memberName || !billAmount) {
            toast.error("Data tidak lengkap untuk membuat pesan WhatsApp.");
            return;
        }

        // 2. Cari detail anggota dan validasi nomor telepon
        const player = allPlayers.find(p => p.name === memberName);
        if (!player || !player.phone_number) {
            toast.error(`Nomor telepon untuk ${memberName} tidak ditemukan.`, {
                description: 'Harap perbarui data di halaman Manajemen Anggota.',
            });
            return;
        }

        // 3. Format nomor telepon dengan aman
        let phoneNumber = String(player.phone_number).replace(/\D/g, ''); // Hapus semua non-digit
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62')) {
            toast.error(`Format nomor telepon ${memberName} salah.`);
            return;
        }

        // 4. Siapkan semua bagian pesan dan pastikan tidak ada yang kosong
        const sessionName = selectedSessionDetails?.session?.name || 'sesi biliar';
        const adminName = auth?.user?.name || 'Admin';
        const formattedAmount = `Rp ${billAmount.toLocaleString('id-ID')}`;

        // 5. Buat template pesan (Gunakan array.join untuk menangani baris baru dengan lebih andal)
        const messageLines = [
            `Halo ${memberName}, info tagihan biliar sesi "${sessionName}" ya.`,
            ``, // Baris kosong
            `Total bayar kamu: *${formattedAmount}*.`,
            ``, // Baris kosong
            `Bisa transfer ke BCA 12345678 a.n. ${adminName}.`,
            ``, // Baris kosong
            `Makasih!`
        ];
        const message = messageLines.join('\n');
        
        // 6. Encode pesan dan buat URL final
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // 7. (Untuk Debugging) Cetak URL ke console
        console.log("Generated WhatsApp URL:", whatsappUrl);

        // 8. Buka link di tab baru
        window.open(whatsappUrl, '_blank');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header="Riwayat Sesi"
        >
            <Head title="Riwayat Sesi" />

            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Sesi Permainan</CardTitle>
                            <CardDescription>Lihat atau hapus sesi permainan yang sudah Anda simpan.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Detail Sesi</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.length > 0 ? sessions.map(session => (
                                        <TableRow key={session.id}>
                                            <TableCell>
                                                <div className="font-medium">{session.name}</div>
                                                <div className="text-sm text-muted-foreground">{new Date(session.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <Button variant="outline" size="icon" onClick={() => fetchSessionDetails(session.id)}>
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Lihat Detail</span>
                                                        </Button>
                                                    </SheetTrigger>
                                                </Sheet>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteSession(session.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Hapus Sesi</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan="2" className="text-center h-24">Belum ada sesi tersimpan.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

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
                                        <hr className="my-2" />
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
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedSessionDetails.session.members.map(member => (
                                                <TableRow key={member.id}>
                                                    <TableCell>
                                                        <div className="font-medium">{member.name}</div>
                                                        <div className="text-sm text-muted-foreground font-mono">
                                                            Rp {selectedSessionDetails.calculation.bill_per_member.toLocaleString('id-ID')}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleShareToWA(member.name, selectedSessionDetails.calculation.bill_per_member)}
                                                        >
                                                            <MessageSquare className="h-4 w-4 text-green-600" />
                                                            <span className="sr-only">Tagih via WhatsApp</span>
                                                        </Button>
                                                    </TableCell>
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