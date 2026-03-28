import { Shield, UserCheck, User as UserIcon } from 'lucide-react'
import type { AdminUser } from '@/types/user'

export default function UserStatsBar({ users }: { users: AdminUser[] }) {
    const cards = [
        {
            icon: <Shield size={18} className="text-blue-600" />,
            bg: 'bg-blue-50',
            label: 'Toplam İstifadəçi',
            value: users.length,
        },
        {
            icon: <UserCheck size={18} className="text-indigo-600" />,
            bg: 'bg-indigo-50',
            label: 'Adminlər',
            value: users.filter(u => u.role === 'admin').length,
        },
        {
            icon: <UserIcon size={18} className="text-orange-500" />,
            bg: 'bg-orange-50',
            label: 'Normal Userlər',
            value: users.filter(u => u.role === 'user').length,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map(({ icon, bg, label, value }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                    <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
