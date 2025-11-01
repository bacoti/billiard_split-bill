import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export default function SearchFilter({ 
    onSearch, 
    onFilter,
    placeholder = 'Cari...',
    showFilters = false
}) {
    const [searchValue, setSearchValue] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const handleSearch = (value) => {
        setSearchValue(value);
        onSearch?.(value);
    };

    const handleFilter = () => {
        onFilter?.({
            search: searchValue,
            dateFrom,
            dateTo
        });
    };

    const handleClear = () => {
        setSearchValue('');
        setDateFrom('');
        setDateTo('');
        onSearch?.('');
        onFilter?.({ search: '', dateFrom: '', dateTo: '' });
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchValue && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClear}
                        title="Hapus pencarian"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {showFilters && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? 'Sembunyikan Filter' : 'Filter Lanjutan'}
                </Button>
            )}

            {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dari Tanggal</label>
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sampai Tanggal</label>
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={handleFilter} 
                        className="sm:col-span-2"
                        size="sm"
                    >
                        Terapkan Filter
                    </Button>
                </div>
            )}
        </div>
    );
}
