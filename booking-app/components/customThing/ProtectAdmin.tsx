'use client'

import { useEffect, useState } from 'react'
import { BASE } from '@/utils/imageUrl'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

export default function ProtectAdmin({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')

            if (!token) {
                router.push('/signin')
                return
            }

            try {
                // Backend-dən ən son user məlumatlarını alırıq (role daxil)
                const res = await axios.get(`${BASE}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const user = res.data;

                if (user.role !== 'admin') {
                    toast.error("Admin icazəniz yoxdur!")
                    router.push('/') 
                    return
                }

                // LocalStorage-da da update edək ki, digər yerlərdə də köhnə qalmasın
                localStorage.setItem('user', JSON.stringify(user));
                setIsAuthorized(true)
            } catch (err) {
                console.error("Auth check error:", err);
                router.push('/signin')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-[#003580]" />
                    <p className="text-sm text-gray-500 font-medium">Yetki yoxlanılır...</p>
                </div>
            </div>
        )
    }

    if (!isAuthorized) return null

    return <>{children}</>
}
