import { Search, Settings, Loader2 } from 'lucide-react'
import { ROLE_COLOR, AVATAR_COLORS } from '@/types/user'
import type { AdminUser } from '@/types/user'

interface Props {
    users: AdminUser[]
    search: string
    onSearchChange: (v: string) => void
    updating: string | null
    onToggleRole: (id: string, currentRole: string) => void
}

export default function UserTable({ users, search, onSearchChange, updating, onToggleRole }: Props) {
    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Search toolbar */}
            <div className="flex items-center px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                    <Search size={13} className="text-gray-400" />
                    <input
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
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
                                        <div className={`w-9 h-9 rounded-xl ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 uppercase`}>
                                            {u.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-semibold text-gray-800">{u.name}</p>
                                            <p className="text-xs text-gray-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${ROLE_COLOR[u.role]}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5 text-gray-400 text-xs">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button
                                        onClick={() => onToggleRole(u._id, u.role)}
                                        disabled={updating === u._id}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                            u.role === 'admin'
                                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                                        }`}
                                    >
                                        {updating === u._id
                                            ? <Loader2 size={12} className="animate-spin" />
                                            : <Settings size={12} />
                                        }
                                        {u.role === 'admin' ? 'User Et' : 'Admin Et'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
