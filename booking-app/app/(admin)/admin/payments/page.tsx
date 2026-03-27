"use client";
import { useState, useEffect } from "react";
import bookingApi from "@/api/booking";
import {
    Loader2, Search, CreditCard, DollarSign,
    TrendingUp, AlertCircle, CheckCircle2, Clock,
    Building2, Car, Plane, Calendar, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

const TYPE_ICONS: any = {
    building: <Building2 size={14} className="text-blue-500" />,
    car: <Car size={14} className="text-violet-500" />,
    flight: <Plane size={14} className="text-sky-500" />,
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

function fmtDate(d: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("az-AZ", { day: "2-digit", month: "short", year: "numeric" });
}

function getPaidAmount(booking: any): number {
    if (booking.paidAmount != null && booking.paidAmount > 0) return booking.paidAmount;
    return Math.ceil((booking.totalPrice || 0) * 0.3);
}

function getPaymentStatus(paid: number, total: number, bookingStatus: string) {
    if (bookingStatus === "cancelled") return "cancelled";
    if (paid >= total) return "paid";
    if (paid > 0) return "partial";
    return "unpaid";
}

const PAYMENT_STATUS_CONFIG: any = {
    paid: {
        label: "Tam ödənilib",
        cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 size={11} />,
    },
    partial: {
        label: "Qismən ödənilib",
        cls: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <Clock size={11} />,
    },
    unpaid: {
        label: "Ödənilməyib",
        cls: "bg-rose-100 text-rose-700 border-rose-200",
        icon: <AlertCircle size={11} />,
    },
    cancelled: {
        label: "Ləğv edilib",
        cls: "bg-gray-100 text-gray-400 border-gray-200",
        icon: <AlertCircle size={11} />,
    },
};

export default function AdminPayments() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterType, setFilterType] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"date" | "total" | "paid" | "remaining">("date");

    useEffect(() => {
        (async () => {
            try {
                const res = await bookingApi.getAllBookings({ limit: 200 });
                setBookings(res.data.bookings || []);
            } catch {
                toast.error("Ödənişləri gətirmək mümkün olmadı");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const enriched = bookings.map(b => {
        const paid = getPaidAmount(b);
        const remaining = Math.max(0, (b.totalPrice || 0) - paid);
        const payStatus = getPaymentStatus(paid, b.totalPrice || 0, b.status);
        return { ...b, paid, remaining, payStatus };
    });

    // Stats
    const totalRevenue = enriched.reduce((s, b) => s + (b.status !== "cancelled" ? b.totalPrice : 0), 0);
    const totalCollected = enriched.reduce((s, b) => s + (b.status !== "cancelled" ? b.paid : 0), 0);
    const totalRemaining = enriched.reduce((s, b) => s + (b.status !== "cancelled" ? b.remaining : 0), 0);
    const partialCount = enriched.filter(b => b.payStatus === "partial").length;

    const filtered = enriched
        .filter(b => {
            const name = getPropertyName(b).toLowerCase();
            const s = searchTerm.toLowerCase();
            const matchSearch =
                b.user?.name?.toLowerCase().includes(s) ||
                b.user?.email?.toLowerCase().includes(s) ||
                name.includes(s);
            const matchType = filterType === "all" || b.type === filterType;
            const matchStatus = filterStatus === "all" || b.payStatus === filterStatus;
            return matchSearch && matchType && matchStatus;
        })
        .sort((a, b) => {
            if (sortBy === "total") return b.totalPrice - a.totalPrice;
            if (sortBy === "paid") return b.paid - a.paid;
            if (sortBy === "remaining") return b.remaining - a.remaining;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Payments</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Rezervasiyaların ödəniş vəziyyəti
                    </p>
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

                    {/* Payment status filter */}
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="all">Bütün statuslar</option>
                        <option value="partial">Qismən ödənilib</option>
                        <option value="paid">Tam ödənilib</option>
                        <option value="unpaid">Ödənilməyib</option>
                        <option value="cancelled">Ləğv edilib</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="date">Tarixə görə</option>
                        <option value="total">Ümumi məbləğə görə</option>
                        <option value="paid">Ödənilənə görə</option>
                        <option value="remaining">Qalığa görə</option>
                    </select>

                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="İstifadəçi, e-poçt, mülk..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-11 pr-5 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-200 shadow-sm focus:border-blue-500 w-64 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                            <DollarSign size={15} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Ümumi gəlir</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">${totalRevenue.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{enriched.filter(b => b.status !== "cancelled").length} rezervasiya</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={15} className="text-emerald-600" />
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Toplanmış</span>
                    </div>
                    <p className="text-3xl font-black text-emerald-600">${totalCollected.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">
                        {totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0}% yığılıb
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={15} className="text-amber-600" />
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Qalan məbləğ</span>
                    </div>
                    <p className="text-3xl font-black text-amber-600">${totalRemaining.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Giriş/alış zamanı</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center">
                            <Clock size={15} className="text-rose-500" />
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Gözləyən</span>
                    </div>
                    <p className="text-3xl font-black text-rose-500">{partialCount}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Qismən ödənilib</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">İstifadəçi</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Tip / Mülk</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Tarix</th>
                            <th
                                className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer hover:text-blue-600"
                                onClick={() => setSortBy("total")}
                            >
                                <span className="flex items-center gap-1">
                                    Ümumi məbləğ
                                    {sortBy === "total" && <ChevronDown size={10} />}
                                </span>
                            </th>
                            <th
                                className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer hover:text-emerald-600"
                                onClick={() => setSortBy("paid")}
                            >
                                <span className="flex items-center gap-1">
                                    Ödənilib (30%)
                                    {sortBy === "paid" && <ChevronDown size={10} />}
                                </span>
                            </th>
                            <th
                                className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 cursor-pointer hover:text-amber-600"
                                onClick={() => setSortBy("remaining")}
                            >
                                <span className="flex items-center gap-1">
                                    Qalan məbləğ
                                    {sortBy === "remaining" && <ChevronDown size={10} />}
                                </span>
                            </th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Ödəniş statusu</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map(booking => {
                            const psCfg = PAYMENT_STATUS_CONFIG[booking.payStatus] || PAYMENT_STATUS_CONFIG.unpaid;
                            const pct = booking.totalPrice > 0
                                ? Math.round((booking.paid / booking.totalPrice) * 100)
                                : 0;

                            return (
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

                                    {/* Type + Property */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600">
                                                {TYPE_ICONS[booking.type]}
                                                {TYPE_LABELS[booking.type] || booking.type}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 max-w-[160px] truncate">{getPropertyName(booking)}</p>
                                    </td>

                                    {/* Date */}
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                            <Calendar size={12} className="text-blue-400 shrink-0" />
                                            <span>{fmtDate(booking.createdAt)}</span>
                                        </div>
                                    </td>

                                    {/* Total */}
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-black text-gray-900">${booking.totalPrice?.toLocaleString()}</p>
                                    </td>

                                    {/* Paid */}
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-black text-emerald-600">${booking.paid?.toLocaleString()}</p>
                                        <div className="mt-1.5 w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                style={{ width: `${Math.min(pct, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-[9px] text-gray-400 mt-0.5 font-bold">{pct}%</p>
                                    </td>

                                    {/* Remaining */}
                                    <td className="px-6 py-5">
                                        {booking.payStatus === "cancelled" ? (
                                            <p className="text-sm font-black text-gray-300">—</p>
                                        ) : (
                                            <p className={`text-sm font-black ${booking.remaining > 0 ? "text-amber-600" : "text-gray-300"}`}>
                                                {booking.remaining > 0 ? `$${booking.remaining?.toLocaleString()}` : "—"}
                                            </p>
                                        )}
                                    </td>

                                    {/* Payment Status */}
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${psCfg.cls}`}>
                                            {psCfg.icon}
                                            {psCfg.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filtered.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <CreditCard size={22} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Ödəniş tapılmadı</p>
                    </div>
                )}
            </div>

            {/* Footer count */}
            <p className="text-xs text-gray-400 font-bold mt-4 text-right">{filtered.length} nəticə göstərilir</p>
        </div>
    );
}
