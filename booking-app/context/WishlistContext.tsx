"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface WishlistItem {
    id: string;
    type: "building" | "car" | "flight";
    title: string;
    image?: string;
    price: number;
    priceLabel: string;
    location?: string;
    rating?: number;
    href: string;
}

interface WishlistContextType {
    items: WishlistItem[];
    add: (item: WishlistItem) => void;
    remove: (id: string) => void;
    toggle: (item: WishlistItem) => void;
    has: (id: string) => boolean;
    count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

function getStorageKey(): string {
    try {
        const raw = localStorage.getItem("user");
        if (raw) {
            const user = JSON.parse(raw);
            if (user?._id) return `wishlist_${user._id}`;
        }
    } catch {
        // ignore
    }
    return "wishlist_guest";
}

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [storageKey, setStorageKey] = useState("wishlist_guest");

    // Load wishlist whenever the logged-in user changes
    useEffect(() => {
        const key = getStorageKey();
        setStorageKey(key);
        try {
            const stored = localStorage.getItem(key);
            setItems(stored ? JSON.parse(stored) : []);
        } catch {
            setItems([]);
        }
    }, []);

    // Re-sync when user logs in/out (storage event from another tab or manual trigger)
    useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === "user") {
                const key = getStorageKey();
                setStorageKey(key);
                try {
                    const stored = localStorage.getItem(key);
                    setItems(stored ? JSON.parse(stored) : []);
                } catch {
                    setItems([]);
                }
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const persist = useCallback((next: WishlistItem[], key: string) => {
        setItems(next);
        localStorage.setItem(key, JSON.stringify(next));
    }, []);

    const add = useCallback((item: WishlistItem) => {
        const key = getStorageKey();
        setItems(prev => {
            if (prev.some(i => i.id === item.id)) return prev;
            const next = [...prev, item];
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    }, []);

    const remove = useCallback((id: string) => {
        const key = getStorageKey();
        setItems(prev => {
            const next = prev.filter(i => i.id !== id);
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    }, []);

    const toggle = useCallback((item: WishlistItem) => {
        const key = getStorageKey();
        setItems(prev => {
            const exists = prev.some(i => i.id === item.id);
            const next = exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
            localStorage.setItem(key, JSON.stringify(next));
            return next;
        });
    }, []);

    const has = useCallback((id: string) => items.some(i => i.id === id), [items]);

    return (
        <WishlistContext.Provider value={{ items, add, remove, toggle, has, count: items.length }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
    return ctx;
}
