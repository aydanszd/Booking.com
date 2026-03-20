import { useState, useCallback } from 'react';
import api from '@/api/building';
import { Building } from '@/types/building';
import { toast } from 'sonner';

export function useBuildings() {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchBuildings = useCallback(async (q = '') => {
        setLoading(true);
        try {
            const params: Record<string, string> = {};
            if (q) params.city = q;
            const res = await api.get('/buildings', { params });
            setBuildings(res.data.buildings);
            setTotal(res.data.total);
        } catch {
            toast.error('Binaları gətirmək olmadı');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBuilding = async (id: string) => {
        try {
            await api.delete(`/buildings/${id}`);
            toast.success('Bina silindi');
            fetchBuildings();
        } catch {
            toast.error('Silmək olmadı');
        }
    };

    return { buildings, total, loading, fetchBuildings, deleteBuilding };
}