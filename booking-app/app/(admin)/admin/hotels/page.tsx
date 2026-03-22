"use client";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, Hotel, Star, MapPin } from "lucide-react";

const hotels = [
    { id: 1, name: "Hilton Baku", location: "Baku, Azerbaijan", rooms: 318, price: "$320/night", rating: 4.9, status: "Available", stars: 5 },
    { id: 2, name: "Fairmont Baku", location: "Baku, Azerbaijan", rooms: 299, price: "$460/night", rating: 4.8, status: "Available", stars: 5 },
    { id: 3, name: "JW Marriott Absheron", location: "Baku, Azerbaijan", rooms: 230, price: "$280/night", rating: 4.7, status: "Available", stars: 5 },
    { id: 4, name: "Grand Hotel Europe", location: "Baku, Azerbaijan", rooms: 145, price: "$195/night", rating: 4.4, status: "Available", stars: 4 },
    { id: 5, name: "Qafqaz Sport Hotel", location: "Gabala, Azerbaijan", rooms: 90, price: "$140/night", rating: 4.2, status: "Full", stars: 4 },
    { id: 6, name: "Shah Palace Hotel", location: "Baku, Azerbaijan", rooms: 62, price: "$520/night", rating: 4.9, status: "Available", stars: 5 },
    { id: 7, name: "Park Inn by Radisson", location: "Baku, Azerbaijan", rooms: 214, price: "$160/night", rating: 4.1, status: "Maintenance", stars: 4 },
];

const statusColor: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-600",
    Maintenance: "bg-orange-50 text-orange-500",
    Full: "bg-red-50 text-red-500",
};

export default function HotelsPage() {
    const [search, setSearch] = useState("");
    const filtered = hotels.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Hotel size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Total Hotels</p><p className="text-xl font-bold text-gray-800">{hotels.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Hotel size={18} className="text-emerald-600" /></div>
                    <div><p className="text-xs text-gray-400">Available</p><p className="text-xl font-bold text-gray-800">{hotels.filter(h => h.status === "Available").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center"><Star size={18} className="text-amber-500" /></div>
                    <div><p className="text-xs text-gray-400">5-Star Hotels</p><p className="text-xl font-bold text-gray-800">{hotels.filter(h => h.stars === 5).length}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hotels..." className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"><Filter size={13} /> Filter</button>
                    <button className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">+ Add Hotel</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Hotel Name</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Stars</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rooms</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((h) => (
                                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-semibold text-gray-800 text-[13px]">{h.name}</td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                                        <div className="flex items-center gap-1"><MapPin size={11} />{h.location}</div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-0.5">{Array.from({ length: h.stars }).map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}</div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700 font-semibold">{h.rooms}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-semibold text-[13px]">{h.price}</td>
                                    <td className="px-5 py-3.5"><div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-[13px] font-semibold text-gray-700">{h.rating}</span></div></td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[h.status]}`}>{h.status}</span></td>
                                    <td className="px-5 py-3.5"><button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"><MoreHorizontal size={15} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}