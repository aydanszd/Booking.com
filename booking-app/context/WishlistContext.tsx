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

const STORAGE_KEY = "wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch {
            // ignore
        }
    }, []);

    const persist = (next: WishlistItem[]) => {
        setItems(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    };

    const add = useCallback((item: WishlistItem) => {
        setItems(prev => {
            if (prev.some(i => i.id === item.id)) return prev;
            const next = [...prev, item];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const remove = useCallback((id: string) => {
        setItems(prev => {
            const next = prev.filter(i => i.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const toggle = useCallback((item: WishlistItem) => {
        setItems(prev => {
            const exists = prev.some(i => i.id === item.id);
            const next = exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
