"use client";
import { useState, useEffect } from "react";
import bookingApi from "@/api/booking";
import {
    Loader2, Calendar, MapPin,
    Trash2, ExternalLink, SlidersHorizontal, ArrowLeft, Search,
    Building2, Car, Plane, Users
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function fmtDate(d: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("tr-TR");
}

function toImgUrl(path: string | undefined, fallback: string): string {
    if (!path) return fallback;
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
}

function BookingCard({ booking, onCancel }: { booking: any; onCancel: (id: string) => void }) {
    const type: "building" | "car" | "flight" = booking.type;

    const typeConfig = {
        building: {
            icon: <Building2 size={22} className="text-blue-600" />,
            label: "Otel",
            color: "blue",
            title: booking.building?.title || "Otel",
            subtitle: booking.building?.location ? `${booking.building.location.city}, ${booking.building.location.country}` : "",
            image: toImgUrl(booking.building?.images?.[0], "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"),
            link: booking.building?._id ? `/hoteldetail/${booking.building._id}` : null,
            period: (
                <div className="grid grid-cols-2 gap-6 py-6 border-y-2 border-dashed border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Check-in</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.checkIn)}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Check-out</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.checkOut)}</p>
                    </div>
                </div>
            ),
        },
        car: {
            icon: <Car size={22} className="text-violet-600" />,
            label: "Avtomobil",
            color: "violet",
            title: booking.car?.title || `${booking.car?.brand || ""} ${booking.car?.model || ""}`.trim() || "Avtomobil",
            subtitle: booking.car?.location ? `${booking.car.location.city}, ${booking.car.location.country}` : "",
            image: toImgUrl(booking.car?.images?.[0], "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80"),
            link: booking.car?._id ? `/cardetail/${booking.car._id}` : null,
            period: (
                <div className="grid grid-cols-2 gap-6 py-6 border-y-2 border-dashed border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-violet-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Pick-up</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.pickUp)}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Drop-off</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.dropOff)}</p>
                    </div>
                </div>
            ),
        },
        flight: {
            icon: <Plane size={22} className="text-sky-600" />,
            label: "Uçuş",
            color: "sky",
            title: booking.flight?.airline || "Uçuş",
            subtitle: booking.flight?.flightNumber || "",
            image: toImgUrl(booking.flight?.logoUrl, "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80"),
            link: null,
            period: (
                <div className="py-6 border-y-2 border-dashed border-gray-100 space-y-3">
                    {booking.flight && (
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-xl font-black text-gray-900">
                                    {booking.flight.departureTime ? new Date(booking.flight.departureTime).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }) : "—"}
                                </p>
                                <p className="text-xs font-bold text-gray-400">{booking.flight.origin?.code} · {booking.flight.origin?.city}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Plane size={18} className="text-gray-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-black text-gray-900">
                                    {booking.flight.arrivalTime ? new Date(booking.flight.arrivalTime).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" }) : "—"}
                                </p>
                                <p className="text-xs font-bold text-gray-400">{booking.flight.destination?.code} · {booking.flight.destination?.city}</p>
                            </div>
                        </div>
                    )}
                    {booking.passengers && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                            <Users size={13} /> {booking.passengers} Sərnişin
                        </div>
                    )}
                </div>
            ),
        },
    };

    const cfg = typeConfig[type] || typeConfig.building;

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-50 flex flex-col md:flex-row group transition-all hover:-translate-y-1">
            {/* Image */}
            <div className="w-full md:w-64 h-52 md:h-auto relative overflow-hidden shrink-0">
                <img
                    src={cfg.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={cfg.title}
                    onError={e => {
                        const fallbacks: Record<string, string> = {
                            building: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
                            car: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80",
                            flight: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80",
                        };
                        (e.target as HTMLImageElement).src = fallbacks[booking.type] || fallbacks.building;
                    }}
                />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${
                        booking.status === "confirmed" ? "bg-green-500 text-white" :
                        booking.status === "cancelled" ? "bg-red-500 text-white" :
                        booking.status === "completed" ? "bg-blue-500 text-white" :
                        "bg-amber-400 text-white"
                    }`}>
                        {booking.status}
                    </span>
                </div>
                <div className="absolute bottom-5 left-5">
                    <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-gray-700 shadow">
                        {cfg.icon} {cfg.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            {cfg.title}
                        </h2>
                        {cfg.link && (
                            <Link href={cfg.link} className="p-2.5 bg-gray-50 rounded-xl text-gray-300 hover:text-blue-600 transition-all hover:bg-white border border-transparent hover:border-blue-100 shrink-0">
                                <ExternalLink size={16} />
                            </Link>
                        )}
                    </div>
                    {cfg.subtitle && (
                        <div className="flex items-center gap-1.5 mb-6">
                            <MapPin size={14} className="text-blue-500 shrink-0" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cfg.subtitle}</span>
                        </div>
                    )}
                    {cfg.period}
                </div>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-black text-gray-900">${booking.totalPrice}</p>
                        <span className="text-[10px] font-black text-gray-300 uppercase underline decoration-blue-600 decoration-2 underline-offset-4">
                            Verified Payment
                        </span>
                    </div>
                    {booking.status !== "cancelled" && (
                        <button
                            onClick={() => onCancel(booking._id)}
                            className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 transition-all uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                        >
                            <Trash2 size={15} /> Ləğv et
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getMyBookings();
            setBookings(res.data);
        } catch {
            toast.error("Rezervasiyaları gətirmək mümkün olmadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Rezervasiyanı ləğv etmək istəyirsiniz?")) return;
        try {
            await bookingApi.cancelBooking(id);
            toast.success("Rezervasiya ləğv edildi");
            fetchBookings();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Xəta baş verdi");
        }
    };

    const filtered = bookings.filter(b => {
        const matchType = filterType === "all" || b.type === filterType;
        const term = searchTerm.toLowerCase();
        const matchSearch = !term ||
            b.building?.title?.toLowerCase().includes(term) ||
            b.car?.title?.toLowerCase().includes(term) ||
            b.car?.brand?.toLowerCase().includes(term) ||
            b.flight?.airline?.toLowerCase().includes(term);
        return matchType && matchSearch;
    });

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Link href="/" className="p-2.5 bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-gray-100">
                                <ArrowLeft size={18} />
                            </Link>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Your Account</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">My Bookings</h1>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Type tabs */}
                        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1">
                            {[
                                { key: "all", label: "Hamısı", icon: null },
                                { key: "building", label: "Otel", icon: <Building2 size={13} /> },
                                { key: "car", label: "Avtomobil", icon: <Car size={13} /> },
                                { key: "flight", label: "Uçuş", icon: <Plane size={13} /> },
                            ].map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setFilterType(t.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        filterType === t.key ? "bg-blue-600 text-white shadow" : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {t.icon} {t.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Axtar..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-100 shadow-sm focus:border-blue-500 transition-all w-52"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Building2 size={36} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Rezervasiya tapılmadı</h3>
                        <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8 text-xs uppercase tracking-widest">
                            Otel, avtomobil və ya uçuş rezervasiyası edin
                        </p>
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-3xl text-sm transition-all shadow-xl shadow-blue-100 inline-block">
                            Kəşf et
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map(booking => (
                            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
