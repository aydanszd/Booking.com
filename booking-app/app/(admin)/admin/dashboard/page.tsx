"use client";
import { useEffect, useState } from "react";
import { Building2, Car, Plane, TrendingUp, Users, ShoppingBag, DollarSign, Loader2 } from "lucide-react";
import axios from "axios";
import { buildingApi } from "@/api/building";
import { carApi } from "@/api/carapi";
import bookingApi from "@/api/booking";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusColor: Record<string, string> = {
    pending:   "bg-orange-50 text-orange-500",
    confirmed: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-red-50 text-red-500",
    completed: "bg-blue-50 text-blue-600",
};

function fmt(n: number) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n.toFixed(0)}`;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings]     = useState<any[]>([]);
    const [userCount, setUserCount]   = useState(0);
    const [buildingCount, setBuildingCount] = useState(0);
    const [carCount, setCarCount]     = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        Promise.allSettled([
            bookingApi.getAllBookings({ limit: 200 }),
            axios.get(`${BASE}/api/admin/users`, { headers }),
            buildingApi.getBuildings({ limit: 1 }),
            carApi.getAll({ page: 1, limit: 1 }),
        ]).then(([bRes, uRes, bdRes, cRes]) => {
            if (bRes.status === "fulfilled") setBookings(bRes.value.data.bookings || []);
            if (uRes.status === "fulfilled") setUserCount(uRes.value.data?.length ?? 0);
            if (bdRes.status === "fulfilled") setBuildingCount(bdRes.value.data?.total ?? 0);
            if (cRes.status === "fulfilled") setCarCount((cRes.value as any).total ?? 0);
        }).finally(() => setLoading(false));
    }, []);

    const totalRevenue = bookings
        .filter(b => b.status === "confirmed" || b.status === "completed")
        .reduce((s, b) => s + (b.totalPrice || 0), 0);

    const confirmed = bookings.filter(b => b.status === "confirmed" || b.status === "completed").length;
    const convRate  = bookings.length ? ((confirmed / bookings.length) * 100).toFixed(1) : "0.0";

    const byType = {
        building: bookings.filter(b => b.type === "building").length,
        car:      bookings.filter(b => b.type === "car").length,
        flight:   bookings.filter(b => b.type === "flight").length,
    };
    const typeTotal = byType.building + byType.car + byType.flight || 1;

    const categories = [
        { label: "Buildings", value: byType.building, icon: Building2, color: "#8b5cf6" },
        { label: "Cars",      value: byType.car,      icon: Car,       color: "#10b981" },
        { label: "Flights",   value: byType.flight,   icon: Plane,     color: "#f97316" },
    ];

    const stats = [
        {
            label: "Total Revenue", value: fmt(totalRevenue), icon: DollarSign,
            color: "bg-blue-50 text-blue-600",
            sub: `${confirmed} paid bookings`,
        },
        {
            label: "Total Bookings", value: bookings.length.toLocaleString(), icon: ShoppingBag,
            color: "bg-violet-50 text-violet-600",
            sub: `${bookings.filter(b => b.status === "pending").length} pending`,
        },
        {
            label: "Active Users", value: userCount.toLocaleString(), icon: Users,
            color: "bg-emerald-50 text-emerald-600",
            sub: `${buildingCount} buildings · ${carCount} cars`,
        },
        {
            label: "Conversion Rate", value: `${convRate}%`, icon: TrendingUp,
            color: "bg-orange-50 text-orange-500",
            sub: `${bookings.filter(b => b.status === "cancelled").length} cancelled`,
        },
    ];

    const recent = [...bookings]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 8);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <Loader2 size={28} className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4 shadow-sm">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{s.value}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookings by Type */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Bookings by Type</h2>
                    <div className="space-y-4">
                        {categories.map(c => {
                            const Icon = c.icon;
                            const pct = Math.round((c.value / typeTotal) * 100);
                            return (
                                <div key={c.label}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.color + "22" }}>
                                                <Icon size={14} style={{ color: c.color }} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{c.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{c.value}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{pct}% of total</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Status overview */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Booking Status</h2>
                    <div className="space-y-3">
                        {(["confirmed", "pending", "cancelled", "completed"] as const).map(s => {
                            const count = bookings.filter(b => b.status === s).length;
                            const pct   = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
                            return (
                                <div key={s} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor[s]}`}>{s}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${pct}%`,
                                                    backgroundColor: s === "confirmed" ? "#10b981" : s === "pending" ? "#f97316" : s === "cancelled" ? "#ef4444" : "#3b82f6",
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 w-6 text-right">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-800 grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{buildingCount}</p>
                            <p className="text-[11px] text-gray-400">Buildings</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                            <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{carCount}</p>
                            <p className="text-[11px] text-gray-400">Cars</p>
                        </div>
                    </div>
                </div>

                {/* Top customers */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4">Top Customers</h2>
                    {(() => {
                        const map: Record<string, { name: string; count: number; total: number }> = {};
                        bookings.forEach(b => {
                            const name = b.contactInfo?.fullName || b.user?.name || "Unknown";
                            if (!map[name]) map[name] = { name, count: 0, total: 0 };
                            map[name].count++;
                            map[name].total += b.totalPrice || 0;
                        });
                        const top = Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
                        if (!top.length) return <p className="text-xs text-gray-400">No bookings yet.</p>;
                        return (
                            <div className="space-y-3">
                                {top.map((c, i) => (
                                    <div key={c.name} className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-[#006ce4] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{c.name}</p>
                                            <p className="text-[11px] text-gray-400">{c.count} booking{c.count !== 1 ? "s" : ""}</p>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 shrink-0">{fmt(c.total)}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">Recent Bookings</h2>
                    <span className="text-xs text-gray-400">{bookings.length} total</span>
                </div>
                {recent.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">No bookings yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800 text-left">
                                    {["Customer", "Type", "Property", "Amount", "Status", "Date"].map(h => (
                                        <th key={h} className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {recent.map(b => {
                                    const name  = b.contactInfo?.fullName || b.user?.name || "—";
                                    const prop  = b.building?.title || b.car?.title || b.flight?.flightNumber || "—";
                                    return (
                                        <tr key={b._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <td className="px-5 py-3.5 text-gray-800 dark:text-gray-200 font-medium text-[13px]">{name}</td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    {b.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 text-[13px] max-w-40 truncate">{prop}</td>
                                            <td className="px-5 py-3.5 text-gray-800 dark:text-gray-100 font-semibold text-[13px]">{fmt(b.totalPrice || 0)}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[b.status] || ""}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(b.createdAt)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
