'use client'
import { BASE } from '@/utils/imageUrl'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import UserStatsBar from '@/components/adminUsers/UserStatsBar'
import UserTable from '@/components/adminUsers/UserTable'
import type { AdminUser } from '@/types/user'
import { useAdminNotifications } from '@/context/AdminNotificationsContext'

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState<string | null>(null)
    const { markSeen } = useAdminNotifications();
    useEffect(() => { markSeen('users') }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get(`${BASE}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(res.data)
        } catch {
            toast.error('İstifadəçilər yüklənərkən xəta baş verdi')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const handleToggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        setUpdating(userId)
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `${BASE}/api/admin/users/${userId}/role`,
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            toast.success('İstifadəçi rolu yeniləndi')
            fetchUsers()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xəta baş verdi')
        } finally {
            setUpdating(null)
        }
    }

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#003580]" />
        </div>
    )

    return (
        <div className="space-y-5">
            <UserStatsBar users={users} />
            <UserTable
                users={users}
                search={search}
                onSearchChange={setSearch}
                updating={updating}
                onToggleRole={handleToggleRole}
            />
        </div>
    )
}
