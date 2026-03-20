import { CarType } from "@/types/car";

const BASE = "http://localhost:5000";
const API = `${BASE}/api/cars`;

export type FetchCarsParams = {
    page: number;
    limit: number;
    category?: string;
};

export type FetchCarsResponse = {
    cars: CarType[];
    total: number;
};

export const carApi = {
    getAll: async ({ page, limit, category }: FetchCarsParams): Promise<FetchCarsResponse> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (category) params.set("category", category);
        const res = await fetch(`${API}?${params}`);
        if (!res.ok) throw new Error("Məlumatlar yüklənmədi");
        return res.json();
    },

    create: async (fd: FormData): Promise<CarType> => {
        const res = await fetch(API, { method: "POST", body: fd });
        if (!res.ok) {
            const d = await res.json();
            throw new Error(d.message || "Əlavə edilmədi");
        }
        return res.json();
    },

    update: async (id: string, fd: FormData): Promise<CarType> => {
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

export const buildCarFormData = (values: Omit<CarType, "_id" | "rating">, files: File[]): FormData => {
    const fd = new FormData();
    const { images, ...rest } = values;

    Object.entries(rest).forEach(([k, v]) => {
        if (typeof v === "object" && !Array.isArray(v)) {
            fd.append(k, JSON.stringify(v));
        } else if (Array.isArray(v)) {
            fd.append(k, JSON.stringify(v));
        } else {
            fd.append(k, String(v));
        }
    });

    files.forEach((f) => fd.append("images", f));
    return fd;
};