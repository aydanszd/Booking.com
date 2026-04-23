import { BASE } from '@/utils/imageUrl'
import axios from 'axios';

export const destinationApi = {
    getAll: () => axios.get(`${BASE}/api/destinations`),
    getOne: (id: string) => axios.get(`${BASE}/api/destinations/${id}`),
    create: (fd: FormData) => axios.post(`${BASE}/api/destinations`, fd),
    update: (id: string, fd: FormData) => axios.put(`${BASE}/api/destinations/${id}`, fd),
    delete: (id: string) => axios.delete(`${BASE}/api/destinations/${id}`),
};
