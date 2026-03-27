"use client";
import { useEffect, useState, useRef } from "react";
import {
    Plus, Save, Trash2, Search, Globe, RefreshCw, X, Check, Pencil,
} from "lucide-react";

type LocaleData = Record<string, string>;
type AllData = { en: LocaleData; tr: LocaleData; ru: LocaleData };

const LOCALES = [
    { code: "en", label: "English", flag: "🇬🇧", color: "blue" },
    { code: "tr", label: "Türkçe", flag: "🇹🇷", color: "red" },
    { code: "ru", label: "Русский", flag: "🇷🇺", color: "purple" },
] as const;

type Locale = "en" | "tr" | "ru";

export default function TranslationsPage() {
    const [data, setData] = useState<AllData>({ en: {}, tr: {}, ru: {} });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [search, setSearch] = useState("");
    const [editingCell, setEditingCell] = useState<{ key: string; locale: Locale } | null>(null);
    const [editValue, setEditValue] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValues, setNewValues] = useState<Record<Locale, string>>({ en: "", tr: "", ru: "" });
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/translations")
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false); });
    }, []);

    useEffect(() => {
        if (editingCell) inputRef.current?.focus();
    }, [editingCell]);

    const allKeys = Array.from(
        new Set([
            ...Object.keys(data.en),
            ...Object.keys(data.tr),
            ...Object.keys(data.ru),
        ])
    ).sort();

    const filteredKeys = allKeys.filter((k) =>
        k.toLowerCase().includes(search.toLowerCase()) ||
        LOCALES.some((l) =>
            (data[l.code][k] ?? "").toLowerCase().includes(search.toLowerCase())
        )
    );

    // Group keys by section (e.g. "nav.stays" → section "nav")
    const sections = filteredKeys.reduce<Record<string, string[]>>((acc, key) => {
        const section = key.includes(".") ? key.split(".")[0] : "other";
        if (!acc[section]) acc[section] = [];
        acc[section].push(key);
        return acc;
    }, {});

    const startEdit = (key: string, locale: Locale) => {
        setEditingCell({ key, locale });
        setEditValue(data[locale][key] ?? "");
    };

    const commitEdit = () => {
        if (!editingCell) return;
        const { key, locale } = editingCell;
        setData((prev) => ({
            ...prev,
            [locale]: { ...prev[locale], [key]: editValue },
        }));
        setEditingCell(null);
    };

    const cancelEdit = () => setEditingCell(null);

    const deleteKey = (key: string) => {
        setData((prev) => {
            const next = { ...prev };
            for (const locale of ["en", "tr", "ru"] as Locale[]) {
                const copy = { ...next[locale] };
                delete copy[key];
                next[locale] = copy;
            }
            return next;
        });
        setDeleteConfirm(null);
    };

    const addKey = () => {
        if (!newKey.trim()) return;
        const key = newKey.trim();
        setData((prev) => ({
            en: { ...prev.en, [key]: newValues.en },
            tr: { ...prev.tr, [key]: newValues.tr },
            ru: { ...prev.ru, [key]: newValues.ru },
        }));
        setNewKey("");
        setNewValues({ en: "", tr: "", ru: "" });
        setShowAddModal(false);
    };

    const saveAll = async () => {
        setSaving(true);
        await fetch("/api/translations", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const sectionColors: Record<string, string> = {
        nav: "bg-blue-50 text-blue-700 border-blue-200",
        header: "bg-purple-50 text-purple-700 border-purple-200",
        guests: "bg-green-50 text-green-700 border-green-200",
        home: "bg-orange-50 text-orange-700 border-orange-200",
        other: "bg-gray-100 text-gray-600 border-gray-200",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
                <RefreshCw size={18} className="animate-spin" />
                <span className="text-sm">Loading translations...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 max-w-80">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search keys or values..."
                        className="flex-1 text-sm outline-none text-gray-700 bg-transparent"
                    />
                    {search && (
                        <button onClick={() => setSearch("")}>
                            <X size={13} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-400 hidden sm:block">
                        {allKeys.length} keys · {Object.keys(sections).length} sections
                    </span>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                    >
                        <Plus size={14} />
                        Add Key
                    </button>
                    <button
                        onClick={saveAll}
                        disabled={saving}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${saved
                            ? "bg-green-500 text-white"
                            : "bg-[#006ce4] hover:bg-[#0057b8] text-white"
                            }`}
                    >
                        {saving ? (
                            <RefreshCw size={14} className="animate-spin" />
                        ) : saved ? (
                            <Check size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save All"}
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 flex-wrap">
                {LOCALES.map((l) => (
                    <div key={l.code} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>{l.flag}</span>
                        <span className="font-medium">{l.label}</span>
                    </div>
                ))}
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                    Click any cell to edit · Changes are saved manually
                </span>
            </div>

            {/* Table per section */}
            {Object.entries(sections).map(([section, keys]) => (
                <div key={section} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Section header */}
                    <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                        <Globe size={13} className="text-gray-400" />
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${sectionColors[section] ?? sectionColors.other}`}>
                            {section}
                        </span>
                        <span className="text-xs text-gray-400">{keys.length} keys</span>
                    </div>

                    {/* Header row */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_36px] gap-0 border-b border-gray-100">
                        <div className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Key</div>
                        {LOCALES.map((l) => (
                            <div key={l.code} className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                <span>{l.flag}</span> {l.code.toUpperCase()}
                            </div>
                        ))}
                        <div />
                    </div>

                    {/* Rows */}
                    {keys.map((key, idx) => {
                        const shortKey = key.includes(".") ? key.split(".").slice(1).join(".") : key;
                        return (
                            <div
                                key={key}
                                className={`grid grid-cols-[2fr_1fr_1fr_1fr_36px] gap-0 group ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"} hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0`}
                            >
                                {/* Key */}
                                <div className="px-4 py-2.5 flex items-center">
                                    <code className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {shortKey}
                                    </code>
                                </div>

                                {/* Values */}
                                {LOCALES.map((l) => {
                                    const isEditing =
                                        editingCell?.key === key && editingCell?.locale === l.code;
                                    const val = data[l.code][key] ?? "";

                                    return (
                                        <div
                                            key={l.code}
                                            className="px-3 py-2 flex items-center relative"
                                            onClick={() => !isEditing && startEdit(key, l.code)}
                                        >
                                            {isEditing ? (
                                                <div className="flex items-center gap-1 w-full">
                                                    <input
                                                        ref={inputRef}
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") commitEdit();
                                                            if (e.key === "Escape") cancelEdit();
                                                        }}
                                                        className="flex-1 text-xs border border-[#006ce4] rounded-lg px-2 py-1.5 outline-none bg-white w-full"
                                                    />
                                                    <button onClick={commitEdit} className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                                                        <Check size={12} />
                                                    </button>
                                                    <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 w-full cursor-pointer">
                                                    <span className={`text-xs flex-1 truncate ${val ? "text-gray-700" : "text-gray-300 italic"}`}>
                                                        {val || "—"}
                                                    </span>
                                                    <Pencil size={10} className="text-gray-300 group-hover:text-[#006ce4] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Delete */}
                                <div className="flex items-center justify-center">
                                    {deleteConfirm === key ? (
                                        <button
                                            onClick={() => deleteKey(key)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Confirm delete"
                                        >
                                            <Check size={13} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(key)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete key"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            {filteredKeys.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                    <Search size={28} strokeWidth={1.5} />
                    <p className="text-sm">No translation keys found</p>
                </div>
            )}

            {/* Add Key Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <Plus size={14} className="text-[#006ce4]" />
                                </div>
                                <h2 className="text-sm font-bold text-gray-700">Add Translation Key</h2>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                    Key <span className="text-gray-400 font-normal">(e.g. nav.home or header.title)</span>
                                </label>
                                <input
                                    value={newKey}
                                    onChange={(e) => setNewKey(e.target.value)}
                                    placeholder="section.keyName"
                                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#006ce4] transition-colors"
                                />
                            </div>

                            {LOCALES.map((l) => (
                                <div key={l.code}>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                                        <span>{l.flag}</span> {l.label}
                                    </label>
                                    <input
                                        value={newValues[l.code]}
                                        onChange={(e) =>
                                            setNewValues((prev) => ({ ...prev, [l.code]: e.target.value }))
                                        }
                                        placeholder={`Translation in ${l.label}...`}
                                        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 px-6 pb-5">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addKey}
                                disabled={!newKey.trim()}
                                className="flex items-center gap-1.5 bg-[#006ce4] hover:bg-[#0057b8] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                            >
                                <Plus size={14} />
                                Add Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
