import { Calendar } from 'lucide-react'
import { TYPE_ICONS, TYPE_LABELS, PAYMENT_STATUS_CONFIG } from './theme'
import { fmtDate, getPropertyName } from '@/utils/paymentUtils'
import type { EnrichedBooking } from '@/utils/paymentUtils'

export default function PaymentTableRow({ booking }: { booking: EnrichedBooking }) {
    const psCfg = PAYMENT_STATUS_CONFIG[booking.payStatus] ?? PAYMENT_STATUS_CONFIG.unpaid
    const pct = booking.totalPrice > 0
        ? Math.round((booking.paid / booking.totalPrice) * 100)
        : 0

    return (
        <tr className="hover:bg-blue-50/20 transition-colors group">

            {/* User */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs uppercase shrink-0">
                        {booking.user?.name?.[0] || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-black text-gray-800">{booking.user?.name || 'Anonymous'}</p>
                        <p className="text-[10px] font-bold text-gray-400">{booking.user?.email || '—'}</p>
                    </div>
                </div>
            </td>

            {/* Type + Property */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600">
                        {TYPE_ICONS[booking.type]}
                        {TYPE_LABELS[booking.type] || booking.type}
                    </span>
                </div>
                <p className="text-xs font-bold text-gray-500 max-w-[160px] truncate">
                    {getPropertyName(booking)}
                </p>
            </td>

            {/* Date */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Calendar size={12} className="text-blue-400 shrink-0" />
                    <span>{fmtDate(booking.createdAt)}</span>
                </div>
            </td>

            {/* Total */}
            <td className="px-6 py-5">
                <p className="text-sm font-black text-gray-900">${booking.totalPrice?.toLocaleString()}</p>
            </td>

            {/* Paid + progress bar */}
            <td className="px-6 py-5">
                <p className="text-sm font-black text-emerald-600">${booking.paid?.toLocaleString()}</p>
                <div className="mt-1.5 w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                </div>
                <p className="text-[9px] text-gray-400 mt-0.5 font-bold">{pct}%</p>
            </td>

            {/* Remaining */}
            <td className="px-6 py-5">
                {booking.payStatus === 'cancelled' ? (
                    <p className="text-sm font-black text-gray-300">—</p>
                ) : (
                    <p className={`text-sm font-black ${booking.remaining > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                        {booking.remaining > 0 ? `$${booking.remaining?.toLocaleString()}` : '—'}
                    </p>
                )}
            </td>

            {/* Payment status badge */}
            <td className="px-6 py-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${psCfg.cls}`}>
                    {psCfg.icon}
                    {psCfg.label}
                </span>
            </td>
        </tr>
    )
}
