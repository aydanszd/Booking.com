"use client";
import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Shield, Loader2, User as UserIcon, Settings } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

const roleColor = {
    admin: "bg-blue-100 text-blue-700",
    user: "bg-gray-100 text-gray-600",
};

const avatarColors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-rose-500",
];

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err: any) {
            toast.error("İstifadəçilər yüklənərkən xəta baş verdi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUpdating(userId);
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/admin/users/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("İstifadəçi rolu yeniləndi");
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Xəta baş verdi");
        } finally {
            setUpdating(null);
        }
    };

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#003580]" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Shield size={18} className="text-blue-600" /></div>
                    <div><p className="text-xs text-gray-400">Toplam İstifadəçi</p><p className="text-xl font-bold text-gray-800">{users.length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><UserCheck size={18} className="text-indigo-600" /></div>
                    <div><p className="text-xs text-gray-400">Adminlər</p><p className="text-xl font-bold text-gray-800">{users.filter(u => u.role === "admin").length}</p></div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><UserIcon size={18} className="text-orange-500" /></div>
                    <div><p className="text-xs text-gray-400">Normal Userlər</p><p className="text-xl font-bold text-gray-800">{users.filter(u => u.role === "user").length}</p></div>
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
                            placeholder="İstifadəçi axtar..."
                            className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">İstifadəçi</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rol</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Yarandığı Tarix</th>
                                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((u, i) => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 uppercase`}>
                                                {u.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-semibold text-gray-800">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${roleColor[u.role]}`}>{u.role}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button 
                                            onClick={() => handleToggleRole(u._id, u.role)}
                                            disabled={updating === u._id}
                                            className={[
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                                u.role === 'admin' 
                                                    ? "text-red-600 bg-red-50 hover:bg-red-100" 
                                                    : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                                            ].join(' ')}
                                        >
                                            {updating === u._id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Settings size={12} />
                                            )}
                                            {u.role === 'admin' ? "User Et" : "Admin Et"}
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