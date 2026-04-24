import axios from 'axios';
import { toast } from 'sonner';
import { BASE } from '@/utils/imageUrl';

// Bütün booking sorğuları üçün vahid axios instance.
// baseURL bir yerdə saxlanır ki, endpoint dəyişəndə 20+ yerdə deyil, burada dəyişdirilsin.
const api = axios.create({
    baseURL: `${BASE}/api`,
    timeout: 10000,
});

// Request interceptor — hər outgoing sorğuya avtomatik JWT token əlavə edir.
// Bu olmasaydı, hər api çağırışında manual olaraq
// headers: { Authorization: `Bearer ${token}` } yazmaq lazım olardı.
// typeof window yoxlaması SSR zamanı localStorage-a müraciəti bloklayır —
// Next.js server tərəfdə window mövcud deyil, yoxlanmasa crash verir.
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

// Response interceptor — bütün API xətalarını mərkəzləşdirilmiş idarə edir.
// 401: token etibarsızdır və ya vaxtı keçib → localStorage təmizlənir, login-ə yönləndirilir.
// 403: token var amma icazə yoxdur (admin deyil) → toast göstərilir.
// Bu olmasaydı, hər axios çağırışında .catch() bloku yazıb eyni məntiqi təkrarlamaq lazım olardı.
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
