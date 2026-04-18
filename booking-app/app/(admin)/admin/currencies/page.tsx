"use client";
import { useState } from "react";
import { DollarSign, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useCurrency, Currency } from "@/context/CurrencyContext";

export default function CurrenciesPage() {
    const { currencies, selected, setCurrency, addCurrency, updateCurrency, removeCurrency } = useCurrency();

    const [form, setForm] = useState({ code: "", symbol: "", rate: "" });
    const [formError, setFormError] = useState("");
    const [editCode, setEditCode] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ symbol: string; rate: string }>({ symbol: "", rate: "" });

    const handleAdd = () => {
        const code = form.code.trim().toUpperCase();
        const symbol = form.symbol.trim();
        const rate = parseFloat(form.rate);

        if (!code || code.length < 2) return setFormError("Code must be 2–4 characters.");
        if (!symbol)                  return setFormError("Symbol is required.");
        if (isNaN(rate) || rate <= 0) return setFormError("Rate must be a positive number.");
        if (currencies.some(c => c.code === code)) return setFormError("Currency already exists.");

        addCurrency({ code, symbol, rate });
        setForm({ code: "", symbol: "", rate: "" });
        setFormError("");
    };

    const startEdit = (c: Currency) => {
        setEditCode(c.code);
        setEditValues({ symbol: c.symbol, rate: String(c.rate) });
    };

    const saveEdit = (code: string) => {
        const rate = parseFloat(editValues.rate);
        if (isNaN(rate) || rate <= 0) return;
        updateCurrency(code, { symbol: editValues.symbol, rate });
        setEditCode(null);
    };

    return (
        <div className="space-y-5">
            {/* Add new */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                        <DollarSign size={15} className="text-green-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-700">Add Currency</h2>
                </div>
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Code (e.g. EUR)</label>
                            <input
                                value={form.code}
                                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                maxLength={4}
                                placeholder="USD"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Symbol</label>
                            <input
                                value={form.symbol}
                                onChange={e => setForm(p => ({ ...p, symbol: e.target.value }))}
                                maxLength={4}
                                placeholder="$"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Rate (vs USD)</label>
                            <input
                                value={form.rate}
                                onChange={e => setForm(p => ({ ...p, rate: e.target.value }))}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="1.00"
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors"
                            />
                        </div>
                    </div>
                    {formError && <p className="text-xs text-red-500">{formError}</p>}
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-[#006ce4] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#0057b8] transition-colors"
                    >
                        <Plus size={14} />
                        Add Currency
                    </button>
                </div>
            </div>

            {/* Currency list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-700">Active Currencies</h2>
                    <span className="text-xs text-gray-400">{currencies.length} total</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {currencies.map(c => (
                        <div key={c.code} className="flex items-center gap-3 px-5 py-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#006ce4] font-bold text-sm shrink-0">
                                {c.symbol}
                            </div>
                            <div className="flex-1 min-w-0">
                                {editCode === c.code ? (
                                    <div className="flex gap-2 items-center">
                                        <input
                                            value={editValues.symbol}
                                            onChange={e => setEditValues(p => ({ ...p, symbol: e.target.value }))}
                                            className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#006ce4]"
                                            placeholder="Symbol"
                                        />
                                        <input
                                            value={editValues.rate}
                                            onChange={e => setEditValues(p => ({ ...p, rate: e.target.value }))}
                                            type="number"
                                            step="0.01"
                                            className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#006ce4]"
                                            placeholder="Rate"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-gray-800">{c.code}</p>
                                        <p className="text-xs text-gray-400">1 USD = {c.rate} {c.code}</p>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5">
                                {editCode === c.code ? (
                                    <>
                                        <button onClick={() => saveEdit(c.code)} className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors">
                                            <Check size={13} />
                                        </button>
                                        <button onClick={() => setEditCode(null)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
                                            <X size={13} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setCurrency(c.code)}
                                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                                                selected.code === c.code
                                                    ? "bg-[#006ce4] text-white"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            }`}
                                        >
                                            {selected.code === c.code ? "Active" : "Set"}
                                        </button>
                                        <button onClick={() => startEdit(c)} className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#006ce4] hover:bg-blue-100 transition-colors">
                                            <Pencil size={13} />
                                        </button>
                                        {c.code !== "USD" && (
                                            <button onClick={() => removeCurrency(c.code)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
