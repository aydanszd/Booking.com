"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { carApi } from "@/api/carapi";
import { CarType } from "@/types/car";
import { Loader2, Car, Users, Disc, Fuel, Check, Star, Info, MapPin } from "lucide-react";
import Link from "next/link";

export default function CarResultsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [cars, setCars] = useState<CarType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const city = searchParams.get("city") || "Baku";
    const pickUp = searchParams.get("pickUp") || "";
    const dropOff = searchParams.get("dropOff") || "";

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                const res = await carApi.getAll({ page: 1, limit: 10 });
                setCars(res.cars);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-500 font-medium">Finding available cars...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{city}: {cars.length} cars available</h1>
                        <p className="text-sm text-gray-500 mt-1">{pickUp && dropOff ? `${pickUp} — ${dropOff}` : "Select dates for precise pricing"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Filters Placeholder */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-900 mb-4">Car category</h3>
                            {["Economy", "Compact", "SUV", "Luxury", "People carrier"].map(cat => (
                                <label key={cat} className="flex items-center justify-between py-2 cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{cat}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">12</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Results */}
                    <div className="md:col-span-2 space-y-4">
                        {cars.map(car => (
                            <div key={car._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row">
                                <div className="sm:w-64 h-48 sm:h-auto relative shrink-0">
                                    <img 
                                        src={car.images?.[0] || "/placeholder.jpg"} 
                                        className="w-full h-full object-cover" 
                                        alt={car.title} 
                                    />
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                        {car.category.toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex-1 p-5 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">{car.title}</h2>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">{car.brand} {car.model}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-blue-600 uppercase">Excellent</p>
                                                <p className="text-xs text-gray-400">45 reviews</p>
                                            </div>
                                            <div className="bg-blue-600 text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                                                {car.rating || 8.5}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mt-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Users size={14} className="text-gray-400" /> {car.seats} seats
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Disc size={14} className="text-gray-400" /> {car.transmission}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Fuel size={14} className="text-gray-400" /> Full to full
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-900 font-semibold">
                                            <Check size={14} className="text-green-600" /> Free cancellation
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">Price for 1 day</p>
                                            <p className="text-2xl font-black text-gray-900">${car.pricePerDay}</p>
                                        </div>
                                        <Link 
                                            href={`/cardetail/${car._id}?${searchParams.toString()}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                        >
                                            View Deal
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
