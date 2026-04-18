"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SEEN_KEY = "admin_notif_seen";

type Section = "bookings" | "reviews" | "users" | "payments";

interface Counts { bookings: number; reviews: number; users: number; payments: number; }
interface Ctx {
    unseen: Counts;
    total: number;
    markSeen: (section: Section) => void;
    refresh: () => void;
}

const AdminNotificationsContext = createContext<Ctx | null>(null);

function loadSeen(): Counts {
    try {
        const s = localStorage.getItem(SEEN_KEY);
        if (s) return { bookings: 0, reviews: 0, users: 0, payments: 0, ...JSON.parse(s) };
    } catch {}
    return { bookings: 0, reviews: 0, users: 0, payments: 0 };
}

function saveSeen(seen: Counts) {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
}

export function AdminNotificationsProvider({ children }: { children: ReactNode }) {
    const [current, setCurrent] = useState<Counts>({ bookings: 0, reviews: 0, users: 0, payments: 0 });
    const [seen, setSeen] = useState<Counts>({ bookings: 0, reviews: 0, users: 0, payments: 0 });

    const fetchCounts = useCallback(async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const results = await Promise.allSettled([
            axios.get(`${BASE}/api/bookings/admin/all`, { headers }),
            axios.get(`${BASE}/api/admin/reviews`, { headers }),
            axios.get(`${BASE}/api/admin/users`, { headers }),
        ]);

        const bookings = results[0].status === "fulfilled"
            ? (results[0].value.data.bookings?.length ?? 0) : 0;
        const reviews = results[1].status === "fulfilled"
            ? (results[1].value.data?.length ?? 0) : 0;
        const users = results[2].status === "fulfilled"
            ? (results[2].value.data?.length ?? 0) : 0;

        setCurrent(prev => ({ ...prev, bookings, reviews, users }));
    }, []);

    useEffect(() => {
        setSeen(loadSeen());
        fetchCounts();
    }, [fetchCounts]);

    const unseen: Counts = {
        bookings: Math.max(0, current.bookings - seen.bookings),
        reviews:  Math.max(0, current.reviews  - seen.reviews),
        users:    Math.max(0, current.users     - seen.users),
        payments: Math.max(0, current.payments  - seen.payments),
    };

    const total = unseen.bookings + unseen.reviews + unseen.users + unseen.payments;

    const markSeen = useCallback((section: Section) => {
        setSeen(prev => {
            const next = { ...prev, [section]: current[section] };
            saveSeen(next);
            return next;
        });
    }, [current]);

    return (
        <AdminNotificationsContext.Provider value={{ unseen, total, markSeen, refresh: fetchCounts }}>
            {children}
        </AdminNotificationsContext.Provider>
    );
}

export function useAdminNotifications() {
    const ctx = useContext(AdminNotificationsContext);
    if (!ctx) throw new Error("useAdminNotifications must be inside AdminNotificationsProvider");
    return ctx;
}
