import { DollarSign, CheckCircle2, TrendingUp, Clock } from 'lucide-react'
import type { EnrichedBooking } from '@/utils/paymentUtils'

export default function PaymentStatsBar({
    enriched,
}: {
    enriched: EnrichedBooking[]
}) {
    const active = enriched.filter(b => b.status !== 'cancelled')
    const totalRevenue   = active.reduce((s, b) => s + b.totalPrice, 0)
    const totalCollected = active.reduce((s, b) => s + b.paid, 0)
    const totalRemaining = active.reduce((s, b) => s + b.remaining, 0)
    const partialCount   = enriched.filter(b => b.payStatus === 'partial').length
    const collectedPct   = totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0

    const cards = [
        {
            icon:    <DollarSign size={15} className="text-blue-600" />,
            bg:      'bg-blue-50',
            label:   'Ümumi gəlir',
            value:   `$${totalRevenue.toLocaleString()}`,
            sub:     `${active.length} rezervasiya`,
            color:   'text-gray-900',
        },
        {
            icon:    <CheckCircle2 size={15} className="text-emerald-600" />,
            bg:      'bg-emerald-50',
            label:   'Toplanmış',
            value:   `$${totalCollected.toLocaleString()}`,
            sub:     `${collectedPct}% yığılıb`,
            color:   'text-emerald-600',
        },
        {
            icon:    <TrendingUp size={15} className="text-amber-600" />,
            bg:      'bg-amber-50',
            label:   'Qalan məbləğ',
            value:   `$${totalRemaining.toLocaleString()}`,
            sub:     'Giriş/alış zamanı',
            color:   'text-amber-600',
        },
        {
            icon:    <Clock size={15} className="text-rose-500" />,
            bg:      'bg-rose-50',
            label:   'Gözləyən',
            value:   String(partialCount),
            sub:     'Qismən ödənilib',
            color:   'text-rose-500',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map(({ icon, bg, label, value, sub, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{label}</span>
                    </div>
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{sub}</p>
                </div>
            ))}
        </div>
    )
}
