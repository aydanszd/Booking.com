'use client';
import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { Toaster } from 'sonner';
import { Building } from '@/types/building';
import { useBuildings } from '@/hooks/useBuildings';
import BuildingStats from '@/components/BuildingStats';
import BuildingTable from '@/components/BuildingTable';
import BuildingModal from '@/components/modals/BuildingModal';

export default function BuildingsPage() {
    const { buildings, total, loading, fetchBuildings, deleteBuilding } = useBuildings();
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<Building | null>(null);

    useEffect(() => { fetchBuildings(); }, [fetchBuildings]);

    useEffect(() => {
        const t = setTimeout(() => fetchBuildings(search), 400);
        return () => clearTimeout(t);
    }, [search, fetchBuildings]);

    const openAdd = () => { setEditItem(null); setShowModal(true); };
    const openEdit = (b: Building) => { setEditItem(b); setShowModal(true); };

    const handleDelete = async (id: string) => {
        if (!confirm('Silmək istədiyinizə əminsiniz?')) return;
        await deleteBuilding(id);
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            <div className="space-y-5">

                <BuildingStats buildings={buildings} total={total} />

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                            <Search size={13} className="text-gray-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search buildings..."
                                className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
                            />
                        </div>
                        <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors">
                            <Filter size={13} /> Filter
                        </button>
                        <button onClick={openAdd}
                            className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">
                            + Add Building
                        </button>
                    </div>

                    <BuildingTable
                        buildings={buildings}
                        loading={loading}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                    />
                </div>

                <BuildingModal
                    open={showModal}
                    editItem={editItem}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => fetchBuildings()}
                />
            </div>
        </>
    );
}
