"use client";
import { useState, useEffect, useRef } from "react";
import {
    Search, Filter, Plane, Plus, Pencil, Trash2,
    ChevronLeft, ChevronRight, Clock, Loader2, ImagePlus, X,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { FlightType, ModalType } from "@/types/flight";
import { flightApi } from "@/api/flight";
import FlightFormModal from "@/components/flightformmodal";
import FlightDeleteModal from "@/components/flightdeletemodal";

const LIMIT = 10;

const statusColor = (f: FlightType): string => {
    const avail = f.totalSeats - f.bookedSeats;
    if (avail === 0) return "bg-red-50 text-red-500";
    if (avail <= 10) return "bg-orange-50 text-orange-500";
    return "bg-emerald-50 text-emerald-600";
};

const statusLabel = (f: FlightType): string => {
    const avail = f.totalSeats - f.bookedSeats;
    if (avail === 0) return "Dolu";
    if (avail <= 10) return "Az yer";
    return "Mövcud";
};

const cabinColor: Record<string, string> = {
    economy: "bg-gray-100 text-gray-600",
    premium_economy: "bg-sky-50 text-sky-600",
    business: "bg-violet-50 text-violet-600",
    first: "bg-amber-50 text-amber-600",
};

const cabinLabel: Record<string, string> = {
    economy: "Economy",
    premium_economy: "Prem. Economy",
    business: "Business",
    first: "First",
};

const CABINS = ["", "economy", "premium_economy", "business", "first"] as const;

const fmt = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
};

const fmtDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("az-AZ", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── Airline Logo Avatar ───────────────────────────────────────────────────
function AirlineLogo({
    logoUrl,
    airline,
    size = "md",
}: {
    logoUrl?: string;
    airline: string;
    size?: "sm" | "md";
}) {
    const [err, setErr] = useState(false);
    const dim = size === "sm" ? "w-6 h-6" : "w-8 h-8";
    const iconSize = size === "sm" ? 11 : 14;

    if (logoUrl && !err) {
        return (
            <div className={`${dim} rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-white flex items-center justify-center`}>
                <img
                    src={logoUrl}
                    alt={airline}
                    className="w-full h-full object-contain p-0.5"
                    onError={() => setErr(true)}
                />
            </div>
        );
    }

    return (
        <div className={`${dim} rounded-lg bg-blue-50 flex items-center justify-center shrink-0`}>
            <Plane size={iconSize} className="text-blue-500" />
        </div>
    );
}

// ─── Logo Upload Input (used inside FlightFormModal) ──────────────────────
// Export this and use it inside your FlightFormModal component.
export function LogoUploadField({
    value,
    onChange,
}: {
    value: string;
    onChange: (url: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(value || "");
    const [dragging, setDragging] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Yalnız şəkil faylı seçin");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target?.result as string;
            setPreview(url);
            onChange(url); // base64 data URL — backend-ə göndərmək üçün uyğunlaşdırın
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview("");
        onChange("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Airline Logosu</label>
            <div
                onClick={() => !preview && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
                    transition-all cursor-pointer select-none
                    ${dragging ? "border-[#006ce4] bg-blue-50" : "border-gray-200 hover:border-[#006ce4] bg-gray-50"}
                    ${preview ? "h-24" : "h-24"}
                `}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="logo preview"
                            className="h-16 w-auto max-w-[140px] object-contain rounded-lg"
                        />
                        <button
                            onClick={clear}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
                        >
                            <X size={10} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                            className="absolute bottom-1.5 right-1.5 text-[10px] text-gray-400 hover:text-[#006ce4] transition-colors"
                        >
                            Dəyiş
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImagePlus size={22} />
                        <span className="text-[11px]">Şəkil yüklə və ya buraya sürükle</span>
                        <span className="text-[10px] text-gray-300">PNG, JPG, SVG, WEBP</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function FlightsPage() {
    const [flights, setFlights] = useState<FlightType[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterCabin, setFilterCabin] = useState("");
    const [showFilter, setShowFilter] = useState(false);

    const [modal, setModal] = useState<ModalType>(null);
    const [selected, setSelected] = useState<FlightType | null>(null);

    const fetchFlights = async () => {
        setLoading(true);
        try {
            const data = await flightApi.getAll({ page, limit: LIMIT, cabin: filterCabin });
            setFlights(data.flights);
            setTotal(data.total);
        } catch {
            toast.error("Məlumatlar yüklənmədi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFlights(); }, [page, filterCabin]);

    const filtered = flights.filter((f) =>
        `${f.airline} ${f.flightNumber} ${f.origin.city} ${f.destination.city} ${f.origin.code} ${f.destination.code}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const openAdd = () => { setSelected(null); setModal("add"); };
    const openEdit = (f: FlightType) => { setSelected(f); setModal("edit"); };
    const openDelete = (f: FlightType) => { setSelected(f); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };
    const onSuccess = async () => { await fetchFlights(); closeModal(); };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="space-y-5 font-sans">
            <Toaster position="top-right" richColors />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    {
                        label: "Ümumi Uçuşlar",
                        val: total,
                        icon: <Plane size={18} className="text-blue-500" />,
                        bg: "bg-blue-50",
                    },
                    {
                        label: "Mövcud",
                        val: flights.filter((f) => f.totalSeats - f.bookedSeats > 0).length,
                        icon: <Plane size={18} className="text-emerald-500" />,
                        bg: "bg-emerald-50",
                    },
                    {
                        label: "Dolu",
                        val: flights.filter((f) => f.totalSeats - f.bookedSeats === 0).length,
                        icon: <Clock size={18} className="text-orange-500" />,
                        bg: "bg-orange-50",
                    },
                ].map(({ label, val, icon, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                        <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-xl font-bold text-gray-800">{val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Axtar..."
                            className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setShowFilter((s) => !s)}
                            className={`flex items-center gap-2 text-xs border rounded-xl px-3 py-2 transition-colors ${
                                filterCabin
                                    ? "border-[#006ce4] text-[#006ce4]"
                                    : "border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4]"
                            }`}
                        >
                            <Filter size={13} /> Filtr {filterCabin && `· ${cabinLabel[filterCabin]}`}
                        </button>
                        {showFilter && (
                            <div className="absolute top-10 left-0 z-20 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 min-w-[180px]">
                                {CABINS.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setFilterCabin(c); setShowFilter(false); setPage(1); }}
                                        className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                                            filterCabin === c
                                                ? "bg-[#006ce4] text-white"
                                                : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        {c ? cabinLabel[c] : "Hamısı"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium"
                    >
                        <Plus size={13} /> Uçuş Əlavə Et
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
                    <table className="w-full text-sm min-w-[960px]">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-50">
                                {["Uçuş", "Marşrut", "Tarix", "Uçuş / Eniş", "Müddət", "Kabinə", "Oturacaq", "Qiymət", "Status", "Əməliyyat"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="py-16">
                                        <div className="flex justify-center">
                                            <Loader2 size={26} className="animate-spin text-[#006ce4]" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                        Nəticə tapılmadı
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((f) => (
                                    <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                                        {/* ── Uçuş sütunu: logo + flight number ── */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {/* Airline logo — logoUrl varsa şəkil, yoxsa Plane ikonu */}
                                                <AirlineLogo logoUrl={f.logoUrl} airline={f.airline} />
                                                <div>
                                                    <p className="font-mono font-bold text-[13px] text-gray-700">{f.flightNumber || "—"}</p>
                                                    <p className="text-[11px] text-gray-400">{f.airline}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <span className="font-semibold">{f.origin.code}</span>
                                                <Plane size={10} className="text-gray-400" />
                                                <span className="font-semibold">{f.destination.code}</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 mt-0.5">{f.origin.city} → {f.destination.city}</p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                                            {fmtDate(f.departureTime)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-semibold text-[13px] text-gray-700">{fmt(f.departureTime)}</span>
                                            <span className="text-gray-300 mx-1">→</span>
                                            <span className="font-semibold text-[13px] text-gray-700">{fmt(f.arrivalTime)}</span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {f.duration ? `${Math.floor(f.duration / 60)}s ${f.duration % 60}dəq` : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cabinColor[f.cabin] ?? "bg-gray-100 text-gray-600"}`}>
                                                {cabinLabel[f.cabin]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                            {f.totalSeats - f.bookedSeats}/{f.totalSeats}
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[13px] text-gray-800 whitespace-nowrap">
                                            ${f.price}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor(f)}`}>
                                                {statusLabel(f)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEdit(f)}
                                                    className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Redaktə et"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openDelete(f)}
                                                    className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            {total} nəticədən {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                            >
                                <ChevronLeft size={13} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                                        p === page
                                            ? "bg-[#006ce4] text-white"
                                            : "border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4]"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                            >
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {(modal === "add" || modal === "edit") && (
                <FlightFormModal
                    mode={modal}
                    flight={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}

            {modal === "delete" && selected && (
                <FlightDeleteModal
                    flight={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
}