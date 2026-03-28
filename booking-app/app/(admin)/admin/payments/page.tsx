'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import bookingApi from '@/api/booking'
import { enrichBookings } from '@/validators/paymentValidators'
import { getPropertyName } from '@/utils/paymentUtils'
import type { SortKey } from '@/utils/paymentUtils'
import PaymentStatsBar from '@/components/adminPayments/PaymentStatsBar'
import PaymentToolbar from '@/components/adminPayments/PaymentToolbar'
import PaymentTable from '@/components/adminPayments/PaymentTable'

export default function AdminPayments() {
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState<SortKey>('date')

    useEffect(() => {
        ;(async () => {
            try {
                const res = await bookingApi.getAllBookings({ limit: 200 })
                setBookings(res.data.bookings || [])
            } catch {
                toast.error('Ödənişləri gətirmək mümkün olmadı')
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const enriched = enrichBookings(bookings)

    const filtered = enriched
        .filter(b => {
            const name = getPropertyName(b).toLowerCase()
            const s = searchTerm.toLowerCase()
            const matchSearch =
                b.user?.name?.toLowerCase().includes(s) ||
                b.user?.email?.toLowerCase().includes(s) ||
                name.includes(s)
            const matchType = filterType === 'all' || b.type === filterType
            const matchStatus = filterStatus === 'all' || b.payStatus === filterStatus
            return matchSearch && matchType && matchStatus
        })
        .sort((a, b) => {
            if (sortBy === 'total') return b.totalPrice - a.totalPrice
            if (sortBy === 'paid') return b.paid - a.paid
            if (sortBy === 'remaining') return b.remaining - a.remaining
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    )

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Payments</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Rezervasiyaların ödəniş vəziyyəti
                    </p>
                </div>

                <PaymentToolbar
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
            </div>

            <PaymentStatsBar enriched={enriched} />

            <PaymentTable rows={filtered} sortBy={sortBy} onSortChange={setSortBy} />

            <p className="text-xs text-gray-400 font-bold mt-4 text-right">{filtered.length} nəticə göstərilir</p>
        </div>
    )
}
