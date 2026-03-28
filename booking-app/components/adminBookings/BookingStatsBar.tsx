import { Filter } from 'lucide-react'
import { TYPE_ICONS, TYPE_LABELS } from './constants'

const STAT_KEYS = ['all', 'building', 'car', 'flight'] as const

export default function BookingStatsBar({ bookings }: { bookings: any[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {STAT_KEYS.map(key => {
                const count = key === 'all'
                    ? bookings.length
                    : bookings.filter(b => b.type === key).length

                return (
                    <div key={key} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            {key !== 'all'
                                ? TYPE_ICONS[key]
                                : <Filter size={15} className="text-gray-400" />
                            }
                            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                {key === 'all' ? 'Cəmi' : TYPE_LABELS[key]}
                            </span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{count}</p>
                    </div>
                )
            })}
        </div>
    )
}
