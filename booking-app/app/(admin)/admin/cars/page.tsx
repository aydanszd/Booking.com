"use client";
import { useEffect, useState } from "react";
import { carApi } from "@/api/carapi";
import { CarType, ModalType } from "@/types/car";
import {
    Loader2, Car, Plus, Pencil, Trash2, Star,
    Search, Filter, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import CarFormModal from "@/components/modals/CarFormModal";
import CarDeleteModal from "@/components/modals/CarDeleteModal";

const LIMIT = 10;

const CATEGORIES = ["", "economy", "compact", "suv", "luxury", "van", "electric"] as const;

const CAT_LABEL: Record<string, string> = {
    economy: "Economy", compact: "Compact", suv: "SUV",
    luxury: "Luxury", van: "Van", electric: "Electric",
};

const CAT_COLOR: Record<string, string> = {
    economy: "bg-gray-100 text-gray-600",
    compact: "bg-sky-50 text-sky-600",
    suv: "bg-emerald-50 text-emerald-600",
    luxury: "bg-violet-50 text-violet-600",
    van: "bg-orange-50 text-orange-500",
    electric: "bg-teal-50 text-teal-600",
};

export default function AdminCarsPage() {
    const [cars, setCars] = useState<CarType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterCat, setFilterCat] = useState("");
    const [showFilter, setShowFilter] = useState(false);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState<ModalType>(null);
    const [selected, setSelected] = useState<CarType | null>(null);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const res = await carApi.getAll({ page, limit: LIMIT, category: filterCat || undefined });
            setCars(res.cars);
            setTotal(res.total);
        } catch (err: any) {
            toast.error(err.message || "Məlumatlar yüklənmədi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, [page, filterCat]);

    const filtered = cars.filter((c) =>
        `${c.title} ${c.brand} ${c.model} ${c.location?.city}`.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setSelected(null); setModal("add"); };
    const openEdit = (c: CarType) => { setSelected(c); setModal("edit"); };
    const openDelete = (c: CarType) => { setSelected(c); setModal("delete"); };
    const closeModal = () => { setModal(null); setSelected(null); };
    const onSuccess = async () => { await fetchCars(); closeModal(); };

    const totalPages = Math.ceil(total / LIMIT);
    const available = cars.filter(c => c.isAvailable).length;
    const rented = cars.filter(c => !c.isAvailable).length;

    return (
        <div className="space-y-5 font-sans">
            <Toaster position="top-right" richColors />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Ümumi Maşınlar", val: total, icon: <Car size={18} className="text-blue-500" />, bg: "bg-blue-50" },
                    { label: "Mövcud", val: available, icon: <Car size={18} className="text-emerald-500" />, bg: "bg-emerald-50" },
                    { label: "İcarədə", val: rented, icon: <Car size={18} className="text-orange-500" />, bg: "bg-orange-50" },
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
                            onClick={() => setShowFilter(s => !s)}
                            className={`flex items-center gap-2 text-xs border rounded-xl px-3 py-2 transition-colors ${
                                filterCat
                                    ? "border-[#006ce4] text-[#006ce4]"
                                    : "border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4]"
                            }`}
                        >
                            <Filter size={13} /> Filtr {filterCat && `· ${CAT_LABEL[filterCat]}`}
                        </button>
                        {showFilter && (
                            <div className="absolute top-10 left-0 z-20 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 min-w-45">
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => { setFilterCat(c); setShowFilter(false); setPage(1); }}
                                        className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                                            filterCat === c
                                                ? "bg-[#006ce4] text-white"
                                                : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                    >
                                        {c ? CAT_LABEL[c] : "Hamısı"}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium"
                    >
                        <Plus size={13} /> Maşın Əlavə Et
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-140 overflow-y-auto">
                    <table className="w-full text-sm min-w-215">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-50">
                                {["Maşın", "Kateqoriya", "Ötürücü", "Oturacaq", "Qiymət/Gün", "Şəhər", "Reytinq", "Status", "Əməliyyat"].map((h) => (
                                    <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="py-16">
                                        <div className="flex justify-center">
                                            <Loader2 size={26} className="animate-spin text-[#006ce4]" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                                        Nəticə tapılmadı
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((car) => (
                                    <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                                    <img
                                                        src={car.images?.[0] ? car.images[0] : "/placeholder.jpg"}
                                                        alt={car.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[13px] text-gray-800">{car.title}</p>
                                                    <p className="text-[11px] text-gray-400">{car.brand} · {car.model}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${CAT_COLOR[car.category] ?? "bg-gray-100 text-gray-600"}`}>
                                                {CAT_LABEL[car.category] ?? car.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 capitalize">{car.transmission}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{car.seats}</td>
                                        <td className="px-4 py-3 font-semibold text-[13px] text-gray-800">${car.pricePerDay}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{car.location?.city}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Star size={11} fill="currentColor" className="text-amber-400" />
                                                <span className="text-xs font-semibold text-gray-700">{car.rating ?? "—"}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                                car.isAvailable
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-orange-50 text-orange-500"
                                            }`}>
                                                {car.isAvailable ? "Mövcud" : "İcarədə"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => openEdit(car)}
                                                    className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="Redaktə et"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openDelete(car)}
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
                                onClick={() => setPage(p => p - 1)}
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
                                onClick={() => setPage(p => p + 1)}
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
                <CarFormModal
                    mode={modal}
                    car={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}
            {modal === "delete" && selected && (
                <CarDeleteModal
                    car={selected}
                    onClose={closeModal}
                    onSuccess={onSuccess}
                />
            )}
        </div>
    );
}