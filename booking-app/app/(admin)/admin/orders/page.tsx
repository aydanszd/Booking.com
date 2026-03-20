"use client";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, ShoppingBag } from "lucide-react";

const orders = [
    { id: "#ORD-7821", customer: "Aydan Məmmədov", type: "Hotel", item: "Hilton Baku — 3 nights", amount: "$960", status: "Confirmed", date: "19 Mar 2026" },
    { id: "#ORD-7820", customer: "Leyla Hüseynova", type: "Flight", item: "Baku → Istanbul (J2-101)", amount: "$370", status: "Pending", date: "19 Mar 2026" },
    { id: "#ORD-7819", customer: "Rauf Əliyev", type: "Car", item: "BMW 5 Series — 4 days", amount: "$380", status: "Confirmed", date: "18 Mar 2026" },
    { id: "#ORD-7818", customer: "Nərmin Quliyeva", type: "Building", item: "Crescent Tower — 2 nights", amount: "$560", status: "Cancelled", date: "18 Mar 2026" },
    { id: "#ORD-7817", customer: "Kamran İsmayılov", type: "Hotel", item: "Fairmont Baku — 2 nights", amount: "$920", status: "Confirmed", date: "17 Mar 2026" },
    { id: "#ORD-7816", customer: "Sevinc Babayeva", type: "Flight", item: "Baku → Dubai (J2-204)", amount: "$480", status: "Confirmed", date: "17 Mar 2026" },
    { id: "#ORD-7815", customer: "Elnur Həsənov", type: "Car", item: "Tesla Model Y — 2 days", amount: "$220", status: "Refunded", date: "16 Mar 2026" },
    { id: "#ORD-7814", customer: "Günel Rzayeva", type: "Building", item: "Flame Tower Suite — 1 night", amount: "$450", status: "Confirmed", date: "15 Mar 2026" },
];

const statusColor: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-orange-50 text-orange-500",
    Cancelled: "bg-red-50 text-red-500",
    Refunded: "bg-gray-100 text-gray-500",
};

const typeColor: Record<string, string> = {
    Hotel: "bg-blue-50 text-blue-600",
    Flight: "bg-violet-50 text-violet-600",
    Car: "bg-emerald-50 text-emerald-700",
    Building: "bg-orange-50 text-orange-600",
};

export default function OrdersPage() {
    const [search, setSearch] = useState("");
    const filtered = orders.filter(o =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = orders
        .filter(o => o.status === "Confirmed")
        .reduce((sum, o) => sum + parseFloat(o.amount.replace("$", "").replace(",", "")), 0);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><ShoppingBag size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Total Orders</p><p className="text-xl font-bold text-gray-800">{orders.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><ShoppingBag size={18} className="text-emerald-600" /></div>
                    <div><p className="text-xs text-gray-400">Confirmed</p><p className="text-xl font-bold text-gray-800">{orders.filter(o => o.status === "Confirmed").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><ShoppingBag size={18} className="text-orange-500" /></div>
                    <div><p className="text-xs text-gray-400">Pending</p><p className="text-xl font-bold text-gray-800">{orders.filter(o => o.status === "Pending").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><ShoppingBag size={18} className="text-violet-600" /></div>
                    <div><p className="text-xs text-gray-400">Revenue</p><p className="text-lg font-bold text-gray-800">${totalRevenue.toLocaleString()}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"><Filter size={13} /> Filter</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Item</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{o.id}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-medium text-[13px]">{o.customer}</td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeColor[o.type]}`}>{o.type}</span></td>
                                    <td className="px-5 py-3.5 text-gray-600 text-[13px]">{o.item}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-bold text-[13px]">{o.amount}</td>
                                    <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>{o.status}</span></td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{o.date}</td>
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