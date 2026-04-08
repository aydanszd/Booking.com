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
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#006ce4]" size={32} />
        </div>
    )

    return (
        <div className="space-y-5">
            <PaymentStatsBar enriched={enriched} />
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
            <PaymentTable rows={filtered} sortBy={sortBy} onSortChange={setSortBy} />
            <p className="text-xs text-gray-400 font-bold text-right">{filtered.length} nəticə göstərilir</p>
        </div>
    )
}
