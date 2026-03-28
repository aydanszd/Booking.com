'use client'

import { useState, useEffect } from 'react'
import bookingApi from '@/api/booking'
import { Loader2, Search, Building2, Car, Plane, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import BookingCard from '@/components/myBookings/BookingCard'

export default function MyBookings() {
    const t = useTranslations('myBookings')
    const [bookings, setBookings] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const res = await bookingApi.getMyBookings()
            setBookings(res.data)
        } catch {
            toast.error(t('cancelError'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchBookings() }, [])

    const handleCancel = async (id: string) => {
        if (!confirm(t('cancelConfirm'))) return
        try {
            await bookingApi.cancelBooking(id)
            toast.success(t('cancelSuccess'))
            fetchBookings()
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('cancelError'))
        }
    }

    const filtered = bookings.filter(b => {
        const matchType = filterType === 'all' || b.type === filterType
        const term = searchTerm.toLowerCase()
        const matchSearch = !term ||
            b.building?.title?.toLowerCase().includes(term) ||
            b.car?.title?.toLowerCase().includes(term) ||
            b.car?.brand?.toLowerCase().includes(term) ||
            b.flight?.airline?.toLowerCase().includes(term)
        return matchType && matchSearch
    })

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
    )

    const TYPE_TABS = [
        { key: 'all', label: t('all'), icon: null },
        { key: 'building', label: t('hotel'), icon: <Building2 size={13} /> },
        { key: 'car', label: t('car'), icon: <Car size={13} /> },
        { key: 'flight', label: t('flight'), icon: <Plane size={13} /> },
    ]

    return (
        <div className="min-h-screen bg-gray-50 pt-16 pb-20">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <Link href="/" className="p-2.5 bg-white rounded-2xl text-gray-400 hover:text-blue-600 transition-all shadow-sm border border-gray-100">
                                <ArrowLeft size={18} />
                            </Link>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{t('yourAccount')}</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{t('title')}</h1>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1 bg-white border border-gray-200 rounded-2xl p-1">
                            {TYPE_TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilterType(tab.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        filterType === tab.key ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-100 shadow-sm focus:border-blue-500 transition-all w-52"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <Building2 size={36} className="text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">{t('noBookings')}</h3>
                        <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8 text-xs uppercase tracking-widest">
                            {t('noBookingsDesc')}
                        </p>
                        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-3xl text-sm transition-all shadow-xl shadow-blue-100 inline-block">
                            {t('explore')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filtered.map(booking => (
                            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
