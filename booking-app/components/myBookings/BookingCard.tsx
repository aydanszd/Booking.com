'use client'

import { Calendar, MapPin, Trash2, ExternalLink, Building2, Car, Plane, Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function fmtDate(d: string) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function toImgUrl(path: string | undefined, fallback: string): string {
    if (!path) return fallback
    if (path.startsWith('http')) return path
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${path}`
}

export default function BookingCard({
    booking,
    onCancel,
}: {
    booking: any
    onCancel: (id: string) => void
}) {
    const t = useTranslations('myBookings')
    const type: 'building' | 'car' | 'flight' = booking.type

    const STATUS_MAP: Record<string, string> = {
        confirmed: t('confirmed'),
        cancelled: t('cancelled'),
        completed: t('completed'),
        pending: t('pending'),
    }

    const typeConfig = {
        building: {
            icon: <Building2 size={22} className="text-blue-600" />,
            label: t('hotel'),
            color: 'blue',
            title: booking.building?.title || t('hotel'),
            subtitle: booking.building?.location
                ? `${booking.building.location.city}, ${booking.building.location.country}`
                : '',
            image: toImgUrl(
                booking.building?.images?.[0],
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
            ),
            link: booking.building?._id ? `/hoteldetail/${booking.building._id}` : null,
            period: (
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-dashed border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('checkIn')}</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.checkIn)}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('checkOut')}</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.checkOut)}</p>
                    </div>
                </div>
            ),
        },
        car: {
            icon: <Car size={22} className="text-violet-600" />,
            label: t('car'),
            color: 'violet',
            title:
                booking.car?.title ||
                `${booking.car?.brand || ''} ${booking.car?.model || ''}`.trim() ||
                t('car'),
            subtitle: booking.car?.location
                ? `${booking.car.location.city}, ${booking.car.location.country}`
                : '',
            image: toImgUrl(
                booking.car?.images?.[0],
                'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80',
            ),
            link: booking.car?._id ? `/cardetail/${booking.car._id}` : null,
            period: (
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-dashed border-gray-100">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-violet-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('pickUp')}</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.pickUp)}</p>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-amber-500">
                            <Calendar size={13} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('dropOff')}</span>
                        </div>
                        <p className="text-lg font-black text-gray-800">{fmtDate(booking.dropOff)}</p>
                    </div>
                </div>
            ),
        },
        flight: {
            icon: <Plane size={22} className="text-sky-600" />,
            label: t('flight'),
            color: 'sky',
            title: booking.flight?.airline || t('flight'),
            subtitle: booking.flight?.flightNumber || '',
            image: toImgUrl(
                booking.flight?.logoUrl,
                'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80',
            ),
            link: null,
            period: (
                <div className="py-6 border-y border-dashed border-gray-100 space-y-3">
                    {booking.flight && (
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-xl font-black text-gray-900">
                                    {booking.flight.departureTime
                                        ? new Date(booking.flight.departureTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                        : '—'}
                                </p>
                                <p className="text-xs font-bold text-gray-400">
                                    {booking.flight.origin?.code} · {booking.flight.origin?.city}
                                </p>
                            </div>
                            <div className="flex flex-col items-center">
                                <Plane size={18} className="text-gray-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-black text-gray-900">
                                    {booking.flight.arrivalTime
                                        ? new Date(booking.flight.arrivalTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                                        : '—'}
                                </p>
                                <p className="text-xs font-bold text-gray-400">
                                    {booking.flight.destination?.code} · {booking.flight.destination?.city}
                                </p>
                            </div>
                        </div>
                    )}
                    {booking.passengers && (
                        <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                            <Users size={13} /> {booking.passengers} {t('passengers')}
                        </div>
                    )}
                </div>
            ),
        },
    }

    const cfg = typeConfig[type] || typeConfig.building

    return (
        <div className="bg-white rounded-4xl overflow-hidden shadow-xl shadow-gray-200/60 border border-gray-50 flex flex-col md:flex-row md:h-52 group transition-all hover:-translate-y-1">
            {/* Image */}
            <div className="w-full md:w-56 h-52 md:h-full relative overflow-hidden shrink-0">
                <img
                    src={cfg.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={cfg.title}
                    onError={e => {
                        const fallbacks: Record<string, string> = {
                            building: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
                            car: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&q=80',
                            flight: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80',
                        }
                        ;(e.target as HTMLImageElement).src = fallbacks[booking.type] || fallbacks.building
                    }}
                />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${
                        booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                        booking.status === 'cancelled' ? 'bg-red-500 text-white' :
                        booking.status === 'completed' ? 'bg-blue-500 text-white' :
                        'bg-amber-400 text-white'
                    }`}>
                        {STATUS_MAP[booking.status] || booking.status}
                    </span>
                </div>
                <div className="absolute bottom-5 left-5">
                    <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-gray-700 shadow">
                        {cfg.icon} {cfg.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between min-w-0 overflow-hidden">
                <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h2 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            {cfg.title}
                        </h2>
                        {cfg.link && (
                            <Link href={cfg.link} className="p-2.5 bg-gray-50 rounded-xl text-gray-300 hover:text-blue-600 transition-all hover:bg-white border border-transparent hover:border-blue-100 shrink-0">
                                <ExternalLink size={16} />
                            </Link>
                        )}
                    </div>
                    {cfg.subtitle && (
                        <div className="flex items-center gap-1.5 mb-2">
                            <MapPin size={14} className="text-blue-500 shrink-0" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cfg.subtitle}</span>
                        </div>
                    )}
                    {cfg.period}
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <p className="text-xl font-black text-gray-900">${booking.totalPrice}</p>
                        <span className="text-[10px] font-black text-gray-300 uppercase underline decoration-blue-600 decoration-2 underline-offset-4">
                            {t('verifiedPayment')}
                        </span>
                    </div>
                    {booking.status !== 'cancelled' && (
                        <button
                            onClick={() => onCancel(booking._id)}
                            className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 transition-all uppercase tracking-widest hover:underline decoration-2 underline-offset-8"
                        >
                            <Trash2 size={15} /> {t('cancel')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
