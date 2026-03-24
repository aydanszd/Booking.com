"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Calendar, Users, Wifi, Wind, Tv, Maximize2, Eye, Coffee, Tag, CreditCard,
    Ban, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Info, Loader2
} from "lucide-react";
import bookingApi from "@/api/booking";
import { toast } from "sonner";

interface Room {
    id: number;
    name: string;
    guests: number;
    bedOptions: string[];
    size: number;
    amenities: string[];
    extraAmenities: string[];
    price: number;
    features: any[];
    urgency?: string;
    view?: string;
}

const DEFAULT_ROOMS: Room[] = [
    {
        id: 1,
        name: "Standard Double Room",
        guests: 2,
        bedOptions: ["1 double bed"],
        size: 25,
        amenities: ["AC", "TV", "Free WiFi"],
        extraAmenities: ["Shower", "Toilet", "Towels"],
        price: 0, // Will be overridden
        features: [
            { icon: "breakfast", label: "Breakfast included", highlight: true },
            { icon: "wifi", label: "High speed WiFi", highlight: true },
            { icon: "cancel", label: "No cancellation fee" },
        ],
    }
];

export default function RoomAvailability({ building }: { building: any }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
    const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
    const [bookingLoading, setBookingLoading] = useState(false);
    const [qty, setQty] = useState(1);

    const handleBooking = async () => {
        if (!checkIn || !checkOut) {
            toast.error("Zəhmət olmasa tarixləri seçin");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Rezervasiya üçün daxil olun");
            router.push("/signin");
            return;
        }

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        if (nights <= 0) {
            toast.error("Giriş tarixi çıxış tarixindən əvvəl olmalıdır");
            return;
        }

        try {
            setBookingLoading(true);
            const data = {
                type: 'building',
                building: building._id,
                checkIn,
                checkOut,
                totalPrice: building.pricePerNight * qty * nights,
                guests: { adults: 2, children: 0 }
            };
            await bookingApi.createBooking(data);
            toast.success("Rezervasiya uğurla tamamlandı!");
            router.push("/my-bookings");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Rezervasiya uğursuz oldu");
        } finally {
            setBookingLoading(false);
        }
    };

    return (
        <div id="availability" className="py-8 scroll-mt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-gray-900">Availability</h2>
                    <div className="flex items-center gap-1.5 text-[#006ce4] text-sm font-medium cursor-pointer hover:underline">
                        <Tag size={14} /> Price Match Guarantee
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <div className="flex-1 flex items-center gap-2 border-2 border-[#febb02] rounded-lg px-4 py-3 bg-white">
                        <Calendar size={18} className="text-gray-400" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Check-in Date</span>
                            <input 
                                type="date"
                                value={checkIn}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="text-sm font-semibold outline-none bg-transparent w-full"
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 border-2 border-[#febb02] rounded-lg px-4 py-3 bg-white">
                        <Calendar size={18} className="text-gray-400" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Check-out Date</span>
                            <input 
                                type="date"
                                value={checkOut}
                                min={checkIn || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="text-sm font-semibold outline-none bg-transparent w-full"
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex items-center gap-2 border-2 border-[#febb02] rounded-lg px-4 py-3 bg-white">
                        <Users size={18} className="text-gray-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">Guests</span>
                            <span className="text-sm font-semibold">2 adults · 0 children · 1 room</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-[#1a3c6e] text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-4 font-bold">Room Type</th>
                                <th className="px-5 py-4 font-bold text-center">Number of guests</th>
                                <th className="px-5 py-4 font-bold">Price per night</th>
                                <th className="px-5 py-4 font-bold">Choices</th>
                                <th className="px-5 py-4 font-bold">Select rooms</th>
                                <th className="px-5 py-4 font-bold">Reserve</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[
                                { name: building.title + " Standard", guests: building.maxGuests || 2, price: building.pricePerNight }
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-6">
                                        <p className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer">{row.name}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Maximize2 size={10}/> 25m²</span>
                                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Wind size={10}/> AC</span>
                                            {building.amenities?.slice(0, 3).map((a: string) => (
                                                <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="flex justify-center gap-0.5">
                                            {Array.from({ length: row.guests }).map((_, i) => <Users key={i} size={14} className="text-gray-600" />)}
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <p className="text-xl font-bold text-gray-900">${row.price}</p>
                                        <p className="text-[10px] text-gray-400">per night</p>
                                        {checkIn && checkOut && (
                                            <p className="text-xs font-bold text-green-600 mt-1">
                                                Total: ${building.pricePerNight * qty * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000*60*60*24)))}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-5 py-6">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 text-[#008009] text-xs font-semibold">
                                                <CheckCircle2 size={14} /> Free Cancellation
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                                                <CreditCard size={14} /> No prepayment needed
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-6">
                                        <select 
                                            value={qty} 
                                            onChange={e => setQty(Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#006ce4]"
                                        >
                                            {[1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-5 py-6">
                                        <button 
                                            onClick={handleBooking}
                                            disabled={bookingLoading}
                                            className="w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-bold py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            {bookingLoading ? <Loader2 className="animate-spin" size={16} /> : "I'll reserve"}
                                        </button>
                                        <p className="text-[9px] text-gray-400 mt-1.5 text-center flex items-center justify-center gap-1">
                                            <AlertCircle size={10} /> Confirmation is immediate
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}