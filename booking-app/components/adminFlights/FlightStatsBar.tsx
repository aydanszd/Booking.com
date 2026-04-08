import { Plane, Clock } from 'lucide-react'
import type { FlightType } from '@/types/flight'

export default function FlightStatsBar({
    flights,
    total,
}: {
    flights: FlightType[]
    total: number
}) {
    const stats = [
        { label: 'Ümumi Uçuşlar', val: total, icon: <Plane size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
        { label: 'Mövcud', val: flights.filter(f => f.totalSeats - f.bookedSeats > 0).length, icon: <Plane size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
        { label: 'Dolu', val: flights.filter(f => f.totalSeats - f.bookedSeats === 0).length, icon: <Clock size={18} className="text-orange-500" />, bg: 'bg-orange-50' },
    ]

    return (
        <div className="grid grid-cols-3 gap-4">
            {stats.map(({ label, val, icon, bg }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                    <div>
                        <p className="text-xs text-gray-400">{label}</p>
                        <p className="text-xl font-bold text-gray-800">{val}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
