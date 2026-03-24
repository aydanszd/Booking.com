"use client";
import { useState, useEffect } from "react";
import bookingApi from "@/api/booking";
import { 
    Loader2, Search, Filter, MoreVertical, 
    Calendar, User, Building2, CheckCircle2, XCircle, Clock
} from "lucide-react";
import { toast } from "sonner";

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchAllBookings = async () => {
        try {
            setLoading(true);
            const res = await bookingApi.getAllBookings();
            setBookings(res.data.bookings || []);
        } catch (err: any) {
            toast.error("Rezervasiyaları gətirmək mümkün olmadı");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const handleCancel = async (id: string) => {
        if (!confirm("Bu rezervasiyanı ləğv etmək istəyirsiniz?")) return;
        try {
            await bookingApi.cancelBooking(id);
            toast.success("Rezervasiya ləğv edildi");
            fetchAllBookings();
        } catch (err: any) {
            toast.error("Xəta baş verdi");
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: any = {
            confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
            cancelled: "bg-rose-100 text-rose-700 border-rose-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    const filtered = bookings.filter(b => 
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.building?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search by user or property..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-3.5 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-200 shadow-sm focus:border-blue-500 w-80 transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button className="p-3.5 bg-white rounded-2xl text-gray-400 border border-gray-200 shadow-sm hover:text-blue-600 transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">User</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Property</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Period</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Total</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filtered.map((booking) => (
                            <tr key={booking._id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                                            {booking.user?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-gray-800">{booking.user?.name || 'Anonymous'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{booking.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <Building2 size={16} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-700">{booking.building?.title || 'Unknown Property'}</p>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <Calendar size={14} className="text-blue-500" />
                                        <span>{new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <p className="text-sm font-black text-gray-900">${booking.totalPrice}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={booking.status} />
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {booking.status !== 'cancelled' ? (
                                        <button 
                                            onClick={() => handleCancel(booking._id)}
                                            className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-all hover:underline decoration-2 underline-offset-4"
                                        >
                                            Cancel
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-300 uppercase italic">Void</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Clock size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching bookings found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
