import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

const getAuthHeaders = () => {
    if (typeof window === "undefined") return { headers: {} };
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export default {
    createBooking: (data: any) => axios.post(API_URL, data, getAuthHeaders()),
    getMyBookings: () => axios.get(API_URL, getAuthHeaders()), // Base URL is getMyBookings
    getAllBookings: () => axios.get(API_URL + "/admin/all", getAuthHeaders()),
    getBooking: (id: string) => axios.get(`${API_URL}/${id}`, getAuthHeaders()),
    cancelBooking: (id: string) => axios.put(`${API_URL}/${id}/cancel`, {}, getAuthHeaders()),
};
