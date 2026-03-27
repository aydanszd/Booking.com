import { FlightType } from "@/types/flight";

const BASE = "http://localhost:5000";
const API = `${BASE}/api/flights`;

export type FetchFlightsParams = {
    page: number;
    limit: number;
    origin?: string;
    destination?: string;
    airline?: string;
    cabin?: string;
};

export type FetchFlightsResponse = {
    flights: FlightType[];
    total: number;
};

export const flightApi = {
    getAll: async ({
        page,
        limit,
        origin,
        destination,
        airline,
        cabin,
    }: FetchFlightsParams): Promise<FetchFlightsResponse> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (origin) params.set("origin", origin);
        if (destination) params.set("destination", destination);
        if (airline) params.set("airline", airline);
        if (cabin) params.set("cabin", cabin);
        const res = await fetch(`${API}?${params}`);
        if (!res.ok) throw new Error("Məlumatlar yüklənmədi");
        return res.json();
    },

    create: async (fd: FormData): Promise<FlightType> => {
        const res = await fetch(API, { method: "POST", body: fd });
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.message || "Əlavə edilmədi");
        }
        return res.json();
    },

    update: async (id: string, fd: FormData): Promise<FlightType> => {
        const res = await fetch(`${API}/${id}`, { method: "PUT", body: fd });
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.message || "Yenilənmədi");
        }
        return res.json();
    },

    delete: async (id: string): Promise<void> => {
        const res = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Silinmədi");
    },
};