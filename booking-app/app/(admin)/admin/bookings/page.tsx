'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import bookingApi from '@/api/booking'
import BookingStatsBar from '@/components/adminBookings/BookingStatsBar'
import BookingToolbar from '@/components/adminBookings/BookingToolbar'
import BookingTable from '@/components/adminBookings/BookingTable'
import { getPropertyName } from '@/components/adminBookings/utils'

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editStatus, setEditStatus] = useState('')

    const fetchAllBookings = async () => {
        try {
            setLoading(true)
            const res = await bookingApi.getAllBookings()
            setBookings(res.data.bookings || [])
        } catch {
            toast.error('Rezervasiyaları gətirmək mümkün olmadı')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAllBookings() }, [])

    const handleCancel = async (id: string) => {
        if (!confirm('Bu rezervasiyanı ləğv etmək istəyirsiniz?')) return
        try {
            await bookingApi.cancelBooking(id)
            toast.success('Rezervasiya ləğv edildi')
            fetchAllBookings()
        } catch {
            toast.error('Xəta baş verdi')
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await bookingApi.updateBookingStatus(id, { status: newStatus })
            toast.success(`Status "${newStatus}" olaraq yeniləndi`)
            setEditingId(null)
            fetchAllBookings()
        } catch {
            toast.error('Status yenilənmədi')
        }
    }

    const filtered = bookings.filter(b => {
        const matchType = filterType === 'all' || b.type === filterType
        const term = searchTerm.toLowerCase()
        const matchSearch = !term ||
            b.user?.name?.toLowerCase().includes(term) ||
            b.user?.email?.toLowerCase().includes(term) ||
            getPropertyName(b).toLowerCase().includes(term)
        return matchType && matchSearch
    })

    if (loading) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#006ce4]" size={32} />
        </div>
    )

    return (
        <div className="space-y-5">
            <BookingStatsBar bookings={bookings} />
            <BookingToolbar
                filterType={filterType}
                onFilterChange={setFilterType}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onRefresh={fetchAllBookings}
            />
            <BookingTable
                bookings={filtered}
                editingId={editingId}
                editStatus={editStatus}
                onEditStart={(id, status) => { setEditingId(id); setEditStatus(status) }}
                onEditStatusChange={setEditStatus}
                onEditConfirm={(id) => handleUpdateStatus(id, editStatus)}
                onEditCancel={() => setEditingId(null)}
                onCancel={handleCancel}
            />
        </div>
    )
}
