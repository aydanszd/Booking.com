"use client";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, Plane, Clock } from "lucide-react";

const flights = [
    { id: 1, flight: "J2-101", from: "Baku (GYD)", to: "Istanbul (IST)", date: "20 Mar 2026", departs: "06:30", arrives: "08:45", seats: 180, available: 42, price: "$185", status: "On Time" },
    { id: 2, flight: "J2-204", from: "Baku (GYD)", to: "Dubai (DXB)", date: "20 Mar 2026", departs: "09:15", arrives: "12:00", seats: 220, available: 8, price: "$240", status: "On Time" },
    { id: 3, flight: "J2-315", from: "Baku (GYD)", to: "Moscow (SVO)", date: "20 Mar 2026", departs: "11:50", arrives: "14:05", seats: 160, available: 0, price: "$210", status: "Full" },
    { id: 4, flight: "J2-422", from: "Baku (GYD)", to: "London (LHR)", date: "20 Mar 2026", departs: "14:20", arrives: "18:45", seats: 280, available: 91, price: "$520", status: "On Time" },
    { id: 5, flight: "J2-530", from: "Baku (GYD)", to: "Paris (CDG)", date: "21 Mar 2026", departs: "07:00", arrives: "11:10", seats: 260, available: 115, price: "$480", status: "On Time" },
    { id: 6, flight: "J2-641", from: "Baku (GYD)", to: "Ankara (ESB)", date: "21 Mar 2026", departs: "08:40", arrives: "10:20", seats: 140, available: 33, price: "$140", status: "Delayed" },
];

const statusColor: Record<string, string> = {
    "On Time": "bg-emerald-50 text-emerald-600",
    Full: "bg-red-50 text-red-500",
    Delayed: "bg-orange-50 text-orange-500",
};

export default function FlightsPage() {
    const [search, setSearch] = useState("");
    const filtered = flights.filter(f =>
        f.flight.toLowerCase().includes(search.toLowerCase()) ||
        f.to.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Plane size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Total Flights</p><p className="text-xl font-bold text-gray-800">{flights.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Plane size={18} className="text-emerald-600" /></div>
                    <div><p className="text-xs text-gray-400">On Time</p><p className="text-xl font-bold text-gray-800">{flights.filter(f => f.status === "On Time").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Clock size={18} className="text-orange-500" /></div>
                    <div><p className="text-xs text-gray-400">Delayed</p><p className="text-xl font-bold text-gray-800">{flights.filter(f => f.status === "Delayed").length}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search flights..." className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"><Filter size={13} /> Filter</button>
                    <button className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">+ Add Flight</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Flight</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Route</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Departs</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Arrives</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Seats</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((f) => (
                                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-[13px] font-bold text-gray-700">{f.flight}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                            <span className="font-medium">{f.from}</span>
                                            <Plane size={10} className="text-gray-400" />
                                            <span className="font-medium">{f.to}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{f.date}</td>
                                    <td className="px-5 py-3.5 text-gray-700 font-semibold text-[13px]">{f.departs}</td>
                                    <td className="px-5 py-3.5 text-gray-700 font-semibold text-[13px]">{f.arrives}</td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">{f.available}/{f.seats} avail.</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-semibold text-[13px]">{f.price}</td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[f.status]}`}>{f.status}</span></td>
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