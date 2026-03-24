import axios from 'axios';

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const IMG = (path: string) =>
    path?.startsWith('http') ? path : `http://localhost:5000${path}`;

// Define helper methods to keep consistency with my recent edits
const buildingApiMethods = {
    getBuildings: (params = {}) => api.get('/buildings', { params }),
    getBuilding: (id: string) => api.get(`/buildings/${id}`),
    createBuilding: (data: any) => api.post('/buildings', data),
    updateBuilding: (id: string, data: any) => api.put(`/buildings/${id}`, data),
    deleteBuilding: (id: string) => api.delete(`/buildings/${id}`),
};

// Also attach these methods to the axios instance itself
Object.assign(api, buildingApiMethods);

export const buildingApi = buildingApiMethods;
export default api;