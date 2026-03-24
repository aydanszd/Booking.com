"use client";
import { useState, useEffect } from "react";
import bookingApi from "@/api/booking";
import { 
    Loader2, Calendar, MapPin, 
    Trash2, ExternalLink, SlidersHorizontal, ArrowLeft, Search, Building2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function MyBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getMyBookings();
            setBookings(res.data);
        } catch (err: any) {
            console.error(err);
            toast.error("Rezervasiyaları gətirmək mümkün olmadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

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

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-blue-600" size={50} />
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading your bookings...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Link href="/" className="p-3 bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-gray-100">
                                <ArrowLeft size={20} />
                            </Link>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Your Account</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">My Bookings</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input type="text" placeholder="Search bookings..." className="pl-12 pr-6 py-4 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-100 shadow-sm focus:border-blue-500 transition-all w-64" />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        </div>
                        <button className="p-4 bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-gray-100">
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Building2 size={40} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">No Bookings Yet</h3>
                        <p className="text-gray-400 font-bold max-w-sm mx-auto mb-10 leading-relaxed uppercase text-xs tracking-widest">
                            Ready for your next adventure? Find the perfect place to stay and start booking!
                        </p>
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-5 rounded-3xl text-sm transition-all shadow-xl shadow-blue-100 active:scale-95 inline-block">
                             Explore Stays
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-50 flex flex-col md:flex-row group transition-all hover:-translate-y-2">
                                <div className="w-full md:w-80 h-64 md:h-auto relative overflow-hidden">
                                     <img 
                                        src={booking.building?.images?.[0] ? `http://localhost:5000/uploads/${booking.building.images[0]}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80"} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={booking.building?.title} 
                                    />
                                    <div className="absolute top-6 left-6">
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${
                                            booking.status === 'confirmed' ? 'bg-green-500 text-white' : 
                                            booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 p-10 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-blue-600 transition-colors">
                                                {booking.building?.title || "Booking"}
                                            </h2>
                                            <Link href={`/hoteldetail/${booking.building?._id}`} className="p-3 bg-gray-50 rounded-xl text-gray-300 hover:text-blue-600 transition-all hover:bg-white border border-transparent hover:border-blue-100 active:scale-90">
                                                <ExternalLink size={18} />
                                            </Link>
                                        </div>
                                        <div className="flex items-center gap-2 mb-8">
                                            <MapPin size={16} className="text-blue-600" />
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                                                {booking.building?.location?.city}, {booking.building?.location?.country}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 py-8 border-y-2 border-dashed border-gray-100">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-blue-600">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Check-in</span>
                                                </div>
                                                <p className="text-xl font-black text-gray-800 tracking-tight">{new Date(booking.checkIn).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-amber-500">
                                                    <Calendar size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Check-out</span>
                                                </div>
                                                <p className="text-xl font-black text-gray-800 tracking-tight">{new Date(booking.checkOut).toLocaleDateString('tr-TR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-10">
                                        <div className="flex items-center gap-4">
                                            <p className="text-3xl font-black text-gray-900 tracking-tight">${booking.totalPrice}</p>
                                            <span className="text-[10px] font-black text-gray-300 uppercase underline decoration-blue-600 decoration-2 underline-offset-4">Verified Payment</span>
                                        </div>
                                        {booking.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(booking._id)}
                                                className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 transition-all uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                                            >
                                                <Trash2 size={16} /> Cancel Reservation
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
