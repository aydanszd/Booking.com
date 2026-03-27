import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
    timeout: 10000,
});

// Request interceptor — hər istəyə token əlavə et
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error('Zəhmət olmasa daxil olun');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/signin';
            }
        }
        if (error.response?.status === 403) {
            toast.error('Bu əməliyyat üçün icazəniz yoxdur');
        }
        return Promise.reject(error);
    }
);

const bookingApi = {
    createBooking: (data: any) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings'),
    getAllBookings: (params?: any) => api.get('/bookings/admin/all', { params }),
    getBooking: (id: string) => api.get(`/bookings/${id}`),
    cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
    updateBookingStatus: (id: string, data: { status: string }) => api.put(`/bookings/${id}/status`, data),
};

export default bookingApi;
