"use client";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Shield } from "lucide-react";

const users = [
    { id: 1, name: "Aydan Məmmədov", email: "aydan@example.com", role: "Admin", bookings: 14, joined: "Jan 12, 2025", status: "Active", avatar: "AM" },
    { id: 2, name: "Leyla Hüseynova", email: "leyla@example.com", role: "User", bookings: 8, joined: "Feb 3, 2025", status: "Active", avatar: "LH" },
    { id: 3, name: "Rauf Əliyev", email: "rauf@example.com", role: "User", bookings: 21, joined: "Nov 18, 2024", status: "Active", avatar: "RƏ" },
    { id: 4, name: "Nərmin Quliyeva", email: "nermin@example.com", role: "User", bookings: 3, joined: "Mar 1, 2026", status: "Inactive", avatar: "NQ" },
    { id: 5, name: "Kamran İsmayılov", email: "kamran@example.com", role: "Manager", bookings: 47, joined: "Aug 22, 2024", status: "Active", avatar: "Kİ" },
    { id: 6, name: "Sevinc Babayeva", email: "sevinc@example.com", role: "User", bookings: 5, joined: "Jan 30, 2026", status: "Pending", avatar: "SB" },
    { id: 7, name: "Elnur Həsənov", email: "elnur@example.com", role: "User", bookings: 12, joined: "Oct 5, 2024", status: "Active", avatar: "EH" },
    { id: 8, name: "Günel Rzayeva", email: "gunel@example.com", role: "Manager", bookings: 29, joined: "Sep 14, 2024", status: "Active", avatar: "GR" },
];

const roleColor: Record<string, string> = {
    Admin: "bg-blue-100 text-blue-700",
    Manager: "bg-violet-100 text-violet-700",
    User: "bg-gray-100 text-gray-600",
};

const statusColor: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-600",
    Inactive: "bg-red-50 text-red-500",
    Pending: "bg-orange-50 text-orange-500",
};

const avatarColors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
];

export default function UsersPage() {
    const [search, setSearch] = useState("");
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Shield size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Total Users</p><p className="text-xl font-bold text-gray-800">{users.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><UserCheck size={18} className="text-emerald-600" /></div>
                    <div><p className="text-xs text-gray-400">Active</p><p className="text-xl font-bold text-gray-800">{users.filter(u => u.status === "Active").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"><UserX size={18} className="text-red-500" /></div>
                    <div><p className="text-xs text-gray-400">Inactive</p><p className="text-xl font-bold text-gray-800">{users.filter(u => u.status !== "Active").length}</p></div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search users..."
                            className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-xl px-3 py-2 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors">
                        <Filter size={13} /> Filter
                    </button>
                    <button className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">
                        + Add User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Bookings</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((u, i) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                                                {u.avatar}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-gray-800">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${roleColor[u.role]}`}>{u.role}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700 font-semibold text-[13px]">{u.bookings}</td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">{u.joined}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor[u.status]}`}>{u.status}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                                            <MoreHorizontal size={15} />
                                        </button>
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