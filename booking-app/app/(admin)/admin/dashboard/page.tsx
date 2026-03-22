import { Building2, Hotel, Car, Plane, TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const stats = [
    { label: "Total Revenue", value: "$124,580", change: "+12.5%", positive: true, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
    { label: "Total Bookings", value: "3,842", change: "+8.1%", positive: true, icon: ShoppingBag, color: "bg-violet-50 text-violet-600" },
    { label: "Active Users", value: "1,259", change: "+3.2%", positive: true, icon: Users, color: "bg-emerald-50 text-emerald-600" },
    { label: "Conversion Rate", value: "4.6%", change: "-0.4%", positive: false, icon: TrendingUp, color: "bg-orange-50 text-orange-600" },
];

const categories = [
    { label: "Hotels", value: 1240, icon: Hotel, color: "bg-blue-500" },
    { label: "Buildings", value: 870, icon: Building2, color: "bg-violet-500" },
    { label: "Cars", value: 640, icon: Car, color: "bg-emerald-500" },
    { label: "Flights", value: 1092, icon: Plane, color: "bg-orange-500" },
];

const recentBookings = [
    { id: "#BK-4821", customer: "Aydan Məmmədov", type: "Hotel", item: "Hilton Baku", amount: "$320", status: "Confirmed", date: "19 Mar 2026" },
    { id: "#BK-4820", customer: "Leyla Hüseynova", type: "Flight", item: "Baku → Istanbul", amount: "$185", status: "Pending", date: "19 Mar 2026" },
    { id: "#BK-4819", customer: "Rauf Əliyev", type: "Car", item: "BMW 5 Series", amount: "$95/day", status: "Confirmed", date: "18 Mar 2026" },
    { id: "#BK-4818", customer: "Nərmin Quliyeva", type: "Building", item: "Crescent Tower Suite", amount: "$510", status: "Cancelled", date: "18 Mar 2026" },
    { id: "#BK-4817", customer: "Kamran İsmayılov", type: "Hotel", item: "Fairmont Baku", amount: "$460", status: "Confirmed", date: "17 Mar 2026" },
    { id: "#BK-4816", customer: "Sevinc Babayeva", type: "Flight", item: "Baku → Dubai", amount: "$240", status: "Confirmed", date: "17 Mar 2026" },
];

const statusColor: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-600",
    Pending: "bg-orange-50 text-orange-500",
    Cancelled: "bg-red-50 text-red-500",
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                                <p className="text-xl font-bold text-gray-800 leading-tight">{s.value}</p>
                                <p className={`text-[11px] font-semibold mt-0.5 ${s.positive ? "text-emerald-500" : "text-red-400"}`}>{s.change} this month</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Category overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-4">Bookings by Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map((c) => {
                        const Icon = c.icon;
                        const total = categories.reduce((a, b) => a + b.value, 0);
                        const pct = Math.round((c.value / total) * 100);
                        return (
                            <div key={c.label} className="text-center">
                                <div className={`w-12 h-12 rounded-2xl ${c.color} bg-opacity-10 flex items-center justify-center mx-auto mb-2`}
                                    style={{ backgroundColor: `${c.color.replace("bg-", "")}15` }}>
                                    <Icon size={22} className={c.color.replace("bg-", "text-")} />
                                </div>
                                <p className="text-lg font-bold text-gray-800">{c.value.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">{c.label}</p>
                                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${pct}%` }} />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">{pct}% of total</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-700">Recent Bookings</h2>
                    <span className="text-xs text-[#006ce4] font-semibold cursor-pointer hover:underline">View all</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Booking ID</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Item</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{b.id}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-medium text-[13px]">{b.customer}</td>
                                    <td className="px-5 py-3.5 text-gray-500 text-xs">{b.type}</td>
                                    <td className="px-5 py-3.5 text-gray-600 text-[13px]">{b.item}</td>
                                    <td className="px-5 py-3.5 text-gray-800 font-semibold text-[13px]">{b.amount}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[b.status]}`}>{b.status}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{b.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}