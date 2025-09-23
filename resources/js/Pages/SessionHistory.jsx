import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Trash2, Eye, MessageSquare, Copy, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function SessionHistory({ auth }) {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionDetails, setSelectedSessionDetails] = useState(null);
    const [allPlayers, setAllPlayers] = useState([]);
    const [groupMessage, setGroupMessage] = useState('');

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
            generateGroupMessage(response.data);
        } catch (error)
{
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
    };

    const handleShareToWA = (memberName, billAmount) => {
        if (!memberName || !billAmount) {
            toast.error("Data tidak lengkap untuk membuat pesan WhatsApp.");
            return;
        }
        const player = allPlayers.find(p => p.name === memberName);
        if (!player || !player.phone_number) {
            toast.error(`Nomor telepon untuk ${memberName} tidak ditemukan.`, {
                description: 'Harap perbarui data di halaman Manajemen Anggota.',
            });
            return;
        }
        let phoneNumber = String(player.phone_number).replace(/\D/g, '');
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '62' + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('62')) {
            toast.error(`Format nomor telepon ${memberName} salah.`);
            return;
        }
        const sessionName = selectedSessionDetails?.session?.name || 'sesi biliar';
        const adminName = auth?.user?.name || 'Admin';
        const formattedAmount = `Rp ${billAmount.toLocaleString('id-ID')}`;
        const messageLines = [
            `Halo ${memberName}, info tagihan biliar sesi "${sessionName}" ya.`,
            ``,
            `Total bayar kamu: *${formattedAmount}*.`,
            ``,
            `Bisa transfer ke BCA 12345678 a.n. ${adminName}.`,
            ``,
            `Makasih!`
        ];
        const message = messageLines.join('\n');
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        console.log("Generated WhatsApp URL:", whatsappUrl);
        window.open(whatsappUrl, '_blank');
    };
    
    const generateGroupMessage = (details) => {
        if (!details) return;
        const { session, calculation } = details;
        const formattedTotalBill = `Rp ${calculation.grand_total.toLocaleString('id-ID')}`;
        const formattedBillPerMember = `Rp ${calculation.bill_per_member.toLocaleString('id-ID')}`;
        const memberList = session.members.map((member, index) => 
            `${index + 1}. ${member.name}`
        ).join('\n');
        const messageLines = [
            `*-- 🎱 Bill Summary: ${session.name} --*`,
            ``,
            `Halo semua, berikut rincian biaya main biliar kita ya.`,
            ``,
            `*Total Tagihan Keseluruhan: ${formattedTotalBill}*`,
            `Total Pemain: ${calculation.member_count} orang`,
            ``,
            `Patungan per orang:`,
            `*${formattedBillPerMember}*`,
            ``,
            `--------------------`,
            `*Daftar Hadir:*`,
            memberList,
            `--------------------`,
            ``,
            `Mohon transfer ke rekening BCA 12345678 a.n. ${auth.user.name}.`,
            `Makasih semua! 🙏`
        ];
        setGroupMessage(messageLines.join('\n'));
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(groupMessage);
        toast.success("Pesan ringkasan berhasil disalin!");
        window.open('https://web.whatsapp.com', '_blank');
    };

    const handleExportPDF = () => {
        // Implementasi PDF jika diperlukan
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
                                <TableHeader><TableRow><TableHead>Detail Sesi</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
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
                                                            <Eye className="h-4 w-4" /><span className="sr-only">Lihat Detail</span>
                                                        </Button>
                                                    </SheetTrigger>
                                                </Sheet>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteSession(session.id)}>
                                                    <Trash2 className="h-4 w-4" /><span className="sr-only">Hapus Sesi</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : <TableRow><TableCell colSpan="2" className="text-center h-24">Belum ada sesi tersimpan.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={!!selectedSessionDetails} onOpenChange={(open) => {
                if (!open) setGroupMessage('');
                setSelectedSessionDetails(open ? selectedSessionDetails : null);
            }}>
              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{selectedSessionDetails?.session.name}</SheetTitle>
                  <SheetDescription>Rincian tagihan dan opsi untuk berbagi.</SheetDescription>
                </SheetHeader>
                {selectedSessionDetails ? (
                    <div className="mt-6 space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Rincian Tagihan</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Biaya Sewa</span>
                                        <span>Rp {selectedSessionDetails.calculation.rental_cost.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>PB1 ({selectedSessionDetails.session.pb1_percent}%)</span>
                                        <span>Rp {selectedSessionDetails.calculation.pb1_amount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Service ({selectedSessionDetails.session.service_percent}%)</span>
                                        <span>Rp {selectedSessionDetails.calculation.service_amount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tip / Tambahan</span>
                                        <span>Rp {selectedSessionDetails.calculation.tip_amount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="flex justify-between font-bold text-base">
                                        <span>TOTAL TAGIHAN</span>
                                        <span>Rp {selectedSessionDetails.calculation.grand_total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Pembagian per Anggota</CardTitle>
                                <CardDescription>Rincian per pemain yang hadir.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama & Waktu Main</TableHead>
                                            <TableHead className="text-right">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedSessionDetails.session.members.map(member => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <div className="font-medium">{member.name}</div>
                                                    {/* INI BAGIAN YANG DITAMBAHKAN */}
                                                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                        <Clock className="h-3 w-3 mr-1.5" />
                                                        {member.start_time.substring(0, 5)} - {member.end_time.substring(0, 5)}
                                                    </div>
                                                    <div className="text-sm font-mono mt-2">
                                                        Rp {selectedSessionDetails.calculation.bill_per_member.toLocaleString('id-ID')}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="icon" onClick={() => handleShareToWA(member.name, selectedSessionDetails.calculation.bill_per_member)}>
                                                        <MessageSquare className="h-4 w-4 text-green-600" /><span className="sr-only">Tagih via WhatsApp</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Bagikan ke Grup</CardTitle>
                                <CardDescription>Salin pesan ringkasan ini dan tempel di grup WhatsApp Anda.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="group-message">Pesan Ringkasan Grup</Label>
                                    <Textarea id="group-message" readOnly value={groupMessage} className="mt-2 h-48 text-xs sm:text-sm" />
                                </div>
                                <Button onClick={copyToClipboard} className="w-full">
                                    <Copy className="mr-2 h-4 w-4" /> Salin Pesan & Buka WA
                                </Button>
                            </CardContent>
                        </Card>
                        
                        <div className="mt-6">
                            <Button onClick={handleExportPDF} className="w-full">
                                Ekspor ke PDF
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="mt-6">Memuat detail...</p>
                )}
              </SheetContent>
            </Sheet>
        </AuthenticatedLayout>
    );
}