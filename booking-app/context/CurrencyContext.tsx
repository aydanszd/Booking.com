"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface Currency {
    code: string;
    symbol: string;
    rate: number; // rate relative to USD
}

interface CurrencyContextType {
    currencies: Currency[];
    selected: Currency;
    setCurrency: (code: string) => void;
    addCurrency: (c: Currency) => void;
    updateCurrency: (code: string, c: Partial<Currency>) => void;
    removeCurrency: (code: string) => void;
    convert: (usdAmount: number) => number;
    format: (usdAmount: number) => string;
}

const DEFAULT_CURRENCIES: Currency[] = [
    { code: "USD", symbol: "$",  rate: 1 },
    { code: "EUR", symbol: "€",  rate: 0.92 },
    { code: "AZN", symbol: "₼",  rate: 1.70 },
    { code: "TRY", symbol: "₺",  rate: 32.5 },
    { code: "RUB", symbol: "₽",  rate: 92.0 },
    { code: "GBP", symbol: "£",  rate: 0.79 },
];

const STORAGE_KEY_LIST     = "currencies_list";
const STORAGE_KEY_SELECTED = "currency_selected";

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);
    const [selectedCode, setSelectedCode] = useState<string>("USD");

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_LIST);
            if (stored) setCurrencies(JSON.parse(stored));
            const sel = localStorage.getItem(STORAGE_KEY_SELECTED);
            if (sel) setSelectedCode(sel);
        } catch {}
    }, []);

    const persist = (list: Currency[]) => {
        setCurrencies(list);
        localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(list));
    };

    const selected = currencies.find(c => c.code === selectedCode) ?? currencies[0];

    const setCurrency = useCallback((code: string) => {
        setSelectedCode(code);
        localStorage.setItem(STORAGE_KEY_SELECTED, code);
    }, []);

    const addCurrency = useCallback((c: Currency) => {
        setCurrencies(prev => {
            if (prev.some(x => x.code === c.code)) return prev;
            const next = [...prev, c];
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(next));
            return next;
        });
    }, []);

    const updateCurrency = useCallback((code: string, patch: Partial<Currency>) => {
        setCurrencies(prev => {
            const next = prev.map(c => c.code === code ? { ...c, ...patch } : c);
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(next));
            return next;
        });
    }, []);

    const removeCurrency = useCallback((code: string) => {
        if (code === "USD") return;
        setCurrencies(prev => {
            const next = prev.filter(c => c.code !== code);
            localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(next));
            return next;
        });
        if (selectedCode === code) {
            setSelectedCode("USD");
            localStorage.setItem(STORAGE_KEY_SELECTED, "USD");
        }
    }, [selectedCode]);

    const convert = useCallback((usdAmount: number) =>
        Math.round(usdAmount * selected.rate * 100) / 100,
    [selected]);

    const format = useCallback((usdAmount: number) => {
        const amount = convert(usdAmount);
        return `${selected.symbol}${amount.toLocaleString()}`;
    }, [selected, convert]);

    return (
        <CurrencyContext.Provider value={{
            currencies, selected, setCurrency,
            addCurrency, updateCurrency, removeCurrency,
            convert, format,
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const ctx = useContext(CurrencyContext);
    if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
    return ctx;
}
