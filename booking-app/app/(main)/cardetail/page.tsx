"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { carApi } from "@/api/carapi";
import { CarType } from "@/types/car";
import {
    Loader2, Car, Users, Disc, Fuel, Check,
    MapPin, Calendar, ArrowLeft, Star,
} from "lucide-react";
import Link from "next/link";

const BASE = "http://localhost:5000";

function imgSrc(path: string | undefined) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE}${path}`;
}

function fmtDate(d: string) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("az-AZ", { day: "numeric", month: "short", year: "numeric" });
}

function CarDetailListInner() {
    const sp = useSearchParams();
    const router = useRouter();

    const city = sp.get("city") || "";
    const pickUp = sp.get("pickUp") || "";
    const dropOff = sp.get("dropOff") || "";

    const days = pickUp && dropOff
        ? Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
        : 1;

    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await carApi.getAll({ page: 1, limit: 100, city: city || undefined });
                setCars(res.cars);
            } finally {
                setLoading(false);
            }
        })();
    }, [city]);

    const detailParams = new URLSearchParams();
    if (pickUp) detailParams.set("pickUp", pickUp);
    if (dropOff) detailParams.set("dropOff", dropOff);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-[#003b95] text-white py-6 px-4">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} /> Geri
                    </button>
                    <div className="flex flex-wrap items-center gap-4">
                        {city && (
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-blue-300" />
                                <span className="font-bold text-lg">{city}</span>
                            </div>
                        )}
                        {pickUp && dropOff && (
                            <div className="flex items-center gap-1.5 text-blue-200 text-sm">
                                <Calendar size={14} />
                                <span>{fmtDate(pickUp)} — {fmtDate(dropOff)} · {days} gün</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={36} className="animate-spin text-[#006ce4]" />
                        <p className="text-gray-500 text-sm font-medium">Avtomobillər axtarılır...</p>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car size={28} className="text-blue-300" />
                        </div>
                        <h3 className="text-lg font-black text-gray-800 mb-2">Avtomobil tapılmadı</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {city ? `"${city}" şəhərində mövcud avtomobil yoxdur` : "Axtarış şərtlərinə uyğun avtomobil tapılmadı"}
                        </p>
                        <button
                            onClick={() => router.push("/carrender")}
                            className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
                        >
                            Yenidən axtar
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-5">
                            <span className="font-bold text-gray-900">{cars.length}</span> avtomobil tapıldı
                        </p>
                        <div className="space-y-4">
                            {cars.map(car => {
                                const totalPrice = car.pricePerDay * days;
                                return (
                                    <div key={car._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row group">
                                        {/* Image */}
                                        <div className="sm:w-56 h-44 sm:h-auto relative shrink-0 overflow-hidden">
                                            {car.images?.[0] ? (
                                                <img
                                                    src={imgSrc(car.images[0])}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    alt={car.title}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <Car size={40} className="text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 bg-[#006ce4] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                                                {car.category}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-5 flex flex-col">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h2 className="text-lg font-black text-gray-900">{car.title}</h2>
                                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{car.brand} · {car.model}</p>
                                                    {car.location?.city && (
                                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                                            <MapPin size={11} /> {car.location.city}
                                                        </div>
                                                    )}
                                                </div>
                                                {car.rating > 0 && (
                                                    <div className="flex items-center gap-1 bg-[#006ce4] text-white text-xs font-black px-2.5 py-1 rounded-xl">
                                                        <Star size={11} fill="white" /> {car.rating}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Users size={13} className="text-gray-400" /> {car.seats} oturacaq
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Disc size={13} className="text-gray-400" /> {car.transmission}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Fuel size={13} className="text-gray-400" /> Full to full
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <Check size={13} className="text-green-500" /> Pulsuz ləğv
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                                <div>
                                                    <p className="text-xs text-gray-400">${car.pricePerDay} / gün</p>
                                                    <p className="text-2xl font-black text-gray-900">${pickUp && dropOff ? totalPrice : car.pricePerDay}</p>
                                                    {pickUp && dropOff && (
                                                        <p className="text-[10px] text-gray-400">{days} gün üçün</p>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/cardetail/${car._id}?${detailParams.toString()}`}
                                                    className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-100 text-sm"
                                                >
                                                    Detaylara bax
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function CarDetailListPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={36} className="animate-spin text-[#006ce4]" />
            </div>
        }>
            <CarDetailListInner />
        </Suspense>
    );
}
