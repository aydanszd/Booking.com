"use client";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, Car } from "lucide-react";

const cars = [
    { id: 1, make: "BMW", model: "5 Series", year: 2024, plate: "10-AB-222", price: "$95/day", category: "Sedan", status: "Available", mileage: "12,400 km" },
    { id: 2, make: "Mercedes-Benz", model: "GLE 450", year: 2024, plate: "10-BC-341", price: "$130/day", category: "SUV", status: "Rented", mileage: "8,200 km" },
    { id: 3, make: "Tesla", model: "Model Y", year: 2024, plate: "10-CD-512", price: "$110/day", category: "Electric", status: "Available", mileage: "5,900 km" },
    { id: 4, make: "Range Rover", model: "Sport", year: 2023, plate: "10-DE-634", price: "$150/day", category: "SUV", status: "Available", mileage: "22,800 km" },
    { id: 5, make: "Audi", model: "A6", year: 2024, plate: "10-EF-780", price: "$85/day", category: "Sedan", status: "Maintenance", mileage: "31,000 km" },
    { id: 6, make: "Porsche", model: "Cayenne", year: 2023, plate: "10-FG-921", price: "$180/day", category: "SUV", status: "Rented", mileage: "18,500 km" },
    { id: 7, make: "Toyota", model: "Camry", year: 2024, plate: "10-GH-102", price: "$55/day", category: "Sedan", status: "Available", mileage: "9,700 km" },
];

const statusColor: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-600",
    Rented: "bg-blue-50 text-blue-600",
    Maintenance: "bg-orange-50 text-orange-500",
};

const catColor: Record<string, string> = {
    Sedan: "bg-gray-100 text-gray-600",
    SUV: "bg-violet-50 text-violet-600",
    Electric: "bg-teal-50 text-teal-600",
};

export default function CarsPage() {
    const [search, setSearch] = useState("");
    const filtered = cars.filter(c =>
        `${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase()) ||
        c.plate.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Car size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Total Fleet</p><p className="text-xl font-bold text-gray-800">{cars.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Car size={18} className="text-emerald-600" /></div>
                    <div><p className="text-xs text-gray-400">Available</p><p className="text-xl font-bold text-gray-800">{cars.filter(c => c.status === "Available").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Car size={18} className="text-blue-400" /></div>
                    <div><p className="text-xs text-gray-400">Currently Rented</p><p className="text-xl font-bold text-gray-800">{cars.filter(c => c.status === "Rented").length}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cars..." className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"><Filter size={13} /> Filter</button>
                    <button className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">+ Add Car</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vehicle</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Plate</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Mileage</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-gray-800 text-[13px]">{c.make} {c.model}</p>
                                        <p className="text-xs text-gray-400">{c.year}</p>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-600">{c.plate}</td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${catColor[c.category] ?? "bg-gray-100 text-gray-600"}`}>{c.category}</span></td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs">{c.mileage}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-semibold text-[13px]">{c.price}</td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[c.status]}`}>{c.status}</span></td>
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