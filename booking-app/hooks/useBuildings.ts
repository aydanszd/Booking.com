import { useState, useCallback } from 'react';
import { buildingApi as api } from '@/api/building';
import { Building } from '@/types/building';
import { toast } from 'sonner';

export function useBuildings() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    const fetchBuildings = useCallback(async (q = '', p = 1) => {
        setLoading(true);
        try {
            const params: Record<string, any> = { page: p, limit };
            if (q) params.city = q;
            
            const res = await api.getBuildings(params);
            console.log('API Buildings:', res.data);
            
            const data = res.data;
            setBuildings(data.buildings || []);
            setTotal(data.total || 0);
            setPage(data.page || p);
        } catch {
            toast.error('Binaları gətirmək olmadı');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBuilding = async (id: string) => {
        try {
            await api.deleteBuilding(id);
            toast.success('Bina silindi');
            fetchBuildings('', page);
        } catch {
            toast.error('Silmək olmadı');
        }
    };

    return { 
        buildings, total, loading, page, limit,
        fetchBuildings, deleteBuilding, setPage 
    };
}