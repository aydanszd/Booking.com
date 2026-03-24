"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { carApi } from "@/api/carapi";
import { CarType } from "@/types/car";
import { Loader2, Calendar, Users, Disc, Fuel, Check, Star, Car, CheckCircle2, MapPin, Search } from "lucide-react";
import bookingApi from "@/api/booking";
import { toast } from "sonner";

export default function CarDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [car, setCar] = useState<CarType | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    
    // Initial dates from URL params or default to today + tomorrow
    const [pickUp, setPickUp] = useState(searchParams.get("pickUp") || new Date().toISOString().split('T')[0]);
    const [dropOff, setDropOff] = useState(searchParams.get("dropOff") || new Date(Date.now() + 86400000).toISOString().split('T')[0]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true);
                // carApi doesn't have getById? I'll use getAll and filter or add getById to api
                const res = await carApi.getAll({ page: 1, limit: 100 });
                const found = res.cars.find(c => c._id === id);
                if (found) setCar(found);
                else throw new Error("Car not found");
            } catch (err: any) {
                toast.error(err.message);
                router.push("/carresults");
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleBooking = async () => {
        if (!pickUp || !dropOff) {
            toast.error("Please select dates");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please sign in to book");
            router.push("/signin");
            return;
        }

        try {
            setBookingLoading(true);
            const start = new Date(pickUp);
            const end = new Date(dropOff);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            
            if (days <= 0) {
                toast.error("Drop-off date must be after pick-up date");
                return;
            }

            const data = {
                type: 'car',
                car: car?._id,
                pickUp,
                dropOff,
                totalPrice: (car?.pricePerDay || 0) * days,
                guests: { adults: 1, children: 0 }
            };
            
            await bookingApi.createBooking(data);
            toast.success("Booking successful!");
            router.push("/my-bookings");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Booking failed");
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading || !car) return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-500 font-medium">Loading car details...</p>
        </div>
    );

    const start = new Date(pickUp);
    const end = new Date(dropOff);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left: Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                                <div>
                                    <h1 className="text-3xl font-black text-gray-900 leading-tight">{car.title}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex items-center gap-1 text-[#006ce4] text-sm font-bold bg-blue-50 px-2 py-1 rounded">
                                            <Star size={12} fill="currentColor" /> {car.rating}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-400">• {car.brand} {car.model}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 hidden sm:block">
                                    <Car size={32} />
                                </div>
                            </div>

                            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 mb-8 border border-gray-100">
                                <img src={car.images?.[0] || "/placeholder.jpg"} className="w-full h-96 object-cover" alt={car.title} />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Seats</p>
                                        <p className="text-sm font-black text-gray-900">{car.seats} Adults</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <Disc size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Gearbox</p>
                                        <p className="text-sm font-black text-gray-900 uppercase">{car.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <Fuel size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Fuel</p>
                                        <p className="text-sm font-black text-gray-900">Petrol / Full to Full</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">AC</p>
                                        <p className="text-sm font-black text-gray-900">Included</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                     Car features
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {(car.features || ["Air Conditioning", "Bluetooth", "USB Port", "Cruise Control"]).map((f: string) => (
                                        <div key={f} className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-white transition-all">
                                            <CheckCircle2 size={16} className="text-[#008009] shrink-0" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900">Booking Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Pick-up Date</label>
                                    <input 
                                        type="date"
                                        value={pickUp}
                                        onChange={(e) => setPickUp(e.target.value)}
                                        className="bg-transparent text-sm font-black text-gray-900 outline-none w-full"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Drop-off Date</label>
                                    <input 
                                        type="date"
                                        value={dropOff}
                                        onChange={(e) => setDropOff(e.target.value)}
                                        className="bg-transparent text-sm font-black text-gray-900 outline-none w-full"
                                    />
                                </div>
                            </div>

                            <div className="py-6 border-y border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-gray-500 uppercase">Rental price</span>
                                    <span className="text-sm font-black text-gray-900">${car.pricePerDay} / day</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm font-bold text-gray-500 uppercase">Duration</span>
                                    <span className="text-sm font-black text-gray-900">{days} day(s)</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total cost</p>
                                        <p className="text-4xl font-black text-gray-900">${car.pricePerDay * days}</p>
                                    </div>
                                    <div className="text-xs text-[#008009] font-bold bg-green-50 px-2 py-1 rounded">
                                        Best Price
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={bookingLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {bookingLoading ? <Loader2 className="animate-spin" size={24} /> : "Book This Car"}
                            </button>
                            
                            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                                No hidden fees • 24/7 Support
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
