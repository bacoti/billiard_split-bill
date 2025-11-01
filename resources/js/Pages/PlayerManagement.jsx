import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PlusCircle, Trash2, Edit, Users } from 'lucide-react';
import EmptyState from '@/Components/EmptyState';
import { TableSkeleton } from '@/Components/Skeleton';

export default function PlayerManagement({ auth }) {
    const [players, setPlayers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState({ name: '', phone_number: '' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(route('api.players.index'));
            setPlayers(response.data);
        } catch (error) {
            toast.error('Gagal memuat daftar anggota.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleOpenDialog = (player = null) => {
        setEditingPlayer(player);
        setFormData(player ? { name: player.name, phone_number: player.phone_number || '' } : { name: '', phone_number: '' });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiRoute = editingPlayer 
            ? route('api.players.update', editingPlayer.id) 
            : route('api.players.store');
        const method = editingPlayer ? 'put' : 'post';

        try {
            await axios[method](apiRoute, formData);
            toast.success(`Anggota berhasil ${editingPlayer ? 'diperbarui' : 'ditambahkan'}.`);
            fetchPlayers();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error('Terjadi kesalahan.');
        }
    };

    const handleDelete = async (playerId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus anggota ini?')) return;
        try {
            await axios.delete(route('api.players.destroy', playerId));
            toast.success('Anggota berhasil dihapus.');
            fetchPlayers();
        } catch (error) {
            toast.error('Gagal menghapus anggota.');
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header="Manajemen Anggota">
            <Head title="Manajemen Anggota" />
            <div className="py-6 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Daftar Anggota Tetap</CardTitle>
                                <CardDescription>Tambah, edit, atau hapus anggota yang sering bermain.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenDialog()}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Tambah Anggota
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <TableSkeleton rows={3} />
                            ) : players.length > 0 ? (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>No. Telepon</TableHead><TableHead className="text-right">Aksi</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {players.map(player => (
                                            <TableRow key={player.id}>
                                                <TableCell className="font-medium">{player.name}</TableCell>
                                                <TableCell>{player.phone_number || '-'}</TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(player)}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(player.id)}><Trash2 className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <EmptyState
                                    icon={Users}
                                    title="Belum ada anggota"
                                    description="Tambahkan anggota tetap Anda untuk mempermudah pembuatan sesi permainan"
                                    actionLabel="Tambah Anggota Pertama"
                                    onAction={() => handleOpenDialog()}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{editingPlayer ? 'Edit Anggota' : 'Tambah Anggota Baru'}</DialogTitle>
                            <DialogDescription>Isi detail anggota di bawah ini.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input id="name" value={formData.name} onChange={handleFormChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Nomor Telepon (Opsional)</Label>
                                <Input id="phone_number" value={formData.phone_number} onChange={handleFormChange} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingPlayer ? 'Simpan Perubahan' : 'Tambah'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}