"use client";
import { useState, useEffect } from "react";
import bookingApi from "@/api/booking";
import {
    Loader2, Search, Filter,
    Calendar, CheckCircle2, XCircle, Clock, Edit2, Check, X,
    Building2, Car, Plane
} from "lucide-react";
import { toast } from "sonner";

const TYPE_ICONS: any = {
    building: <Building2 size={15} className="text-blue-500" />,
    car: <Car size={15} className="text-violet-500" />,
    flight: <Plane size={15} className="text-sky-500" />,
};

const TYPE_LABELS: any = {
    building: "Otel",
    car: "Avtomobil",
    flight: "Uçuş",
};

function getPropertyName(booking: any) {
    if (booking.type === "building") return booking.building?.title || "—";
    if (booking.type === "car") return `${booking.car?.brand || ""} ${booking.car?.title || ""}`.trim() || "—";
    if (booking.type === "flight") return `${booking.flight?.airline || ""} ${booking.flight?.flightNumber || ""}`.trim() || "—";
    return "—";
}

function getPeriod(booking: any) {
    if (booking.type === "building") {
        return `${fmtDate(booking.checkIn)} — ${fmtDate(booking.checkOut)}`;
    }
    if (booking.type === "car") {
        return `${fmtDate(booking.pickUp)} — ${fmtDate(booking.dropOff)}`;
    }
    if (booking.type === "flight") {
        return fmtDate(booking.createdAt);
    }
    return "—";
}

function fmtDate(d: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("az-AZ", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStatus, setEditStatus] = useState<string>("");

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getAllBookings();
            setBookings(res.data.bookings || []);
        } catch {
            toast.error("Rezervasiyaları gətirmək mümkün olmadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllBookings(); }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Bu rezervasiyanı ləğv etmək istəyirsiniz?")) return;
        try {
            await bookingApi.cancelBooking(id);
            toast.success("Rezervasiya ləğv edildi");
            fetchAllBookings();
        } catch {
            toast.error("Xəta baş verdi");
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await bookingApi.updateBookingStatus(id, { status: newStatus });
            toast.success(`Status "${newStatus}" olaraq yeniləndi`);
            setEditingId(null);
            fetchAllBookings();
        } catch {
            toast.error("Status yenilənmədi");
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            cancelled: "bg-rose-100 text-rose-700 border-rose-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            completed: "bg-blue-100 text-blue-700 border-blue-200",
        };
        const icons: any = {
            confirmed: <CheckCircle2 size={12} />,
            cancelled: <XCircle size={12} />,
            pending: <Clock size={12} />,
            completed: <CheckCircle2 size={12} />,
        };
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
                {icons[status]} {status}
            </span>
        );
    };

    const filtered = bookings.filter(b => {
        const name = getPropertyName(b).toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchSearch = b.user?.name?.toLowerCase().includes(search) ||
            b.user?.email?.toLowerCase().includes(search) ||
            name.includes(search);
        const matchType = filterType === "all" || b.type === filterType;
        return matchSearch && matchType;
    });

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Bookings Management</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Monitor and manage all system reservations</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Type filter */}
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5">
                        {["all", "building", "car", "flight"].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilterType(t)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    filterType === t ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {t !== "all" && TYPE_ICONS[t]}
                                {t === "all" ? "Hamısı" : TYPE_LABELS[t]}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="İstifadəçi, e-poçt, mülk..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-11 pr-5 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-200 shadow-sm focus:border-blue-500 w-72 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    <button onClick={fetchAllBookings} className="p-3 bg-white rounded-2xl text-gray-400 border border-gray-200 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["all", "building", "car", "flight"].map(t => {
                    const count = t === "all" ? bookings.length : bookings.filter(b => b.type === t).length;
                    return (
                        <div key={t} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                {t !== "all" ? TYPE_ICONS[t] : <Filter size={15} className="text-gray-400" />}
                                <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                    {t === "all" ? "Cəmi" : TYPE_LABELS[t]}
                                </span>
                            </div>
                            <p className="text-3xl font-black text-gray-900">{count}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-225">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">İstifadəçi</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Tip</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Mülk / Xidmət</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Müddət</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Məbləğ</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Əməliyyat</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(booking => (
                            <tr key={booking._id} className="hover:bg-blue-50/20 transition-colors group">
                                {/* User */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase shrink-0">
                                            {booking.user?.name?.[0] || "U"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{booking.user?.name || "Anonymous"}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{booking.user?.email || "—"}</p>
                                        </div>
                                    </div>
                                </td>
                                {/* Type */}
                                <td className="px-6 py-5">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600">
                                        {TYPE_ICONS[booking.type]}
                                        {TYPE_LABELS[booking.type] || booking.type}
                                    </span>
                                </td>
                                {/* Property */}
                                <td className="px-6 py-5">
                                    <p className="text-sm font-bold text-gray-700 max-w-45 truncate">{getPropertyName(booking)}</p>
                                </td>
                                {/* Period */}
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <Calendar size={13} className="text-blue-400 shrink-0" />
                                        <span>{getPeriod(booking)}</span>
                                    </div>
                                    {booking.type === "flight" && booking.passengers && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">{booking.passengers} Sərnişin</p>
                                    )}
                                </td>
                                {/* Price */}
                                <td className="px-6 py-5">
                                    <p className="text-sm font-black text-gray-900">${booking.totalPrice}</p>
                                </td>
                                {/* Status */}
                                <td className="px-6 py-5">
                                    {editingId === booking._id ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={editStatus}
                                                onChange={e => setEditStatus(e.target.value)}
                                                className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            >
                                                {["pending", "confirmed", "cancelled", "completed"].map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => handleUpdateStatus(booking._id, editStatus)} className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100">
                                                <Check size={14} />
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="p-1.5 bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={booking.status} />
                                            <button
                                                onClick={() => { setEditingId(booking._id); setEditStatus(booking.status); }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                                {/* Actions */}
                                <td className="px-6 py-5 text-center">
                                    {booking.status !== "cancelled" ? (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-all hover:underline decoration-2 underline-offset-4"
                                        >
                                            Ləğv et
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-300 uppercase italic">Ləğv edilib</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Clock size={22} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Rezervasiya tapılmadı</p>
                    </div>
                )}
            </div>
        </div>
    );
}
