'use client'

import { Calendar, Edit2, Check, X } from 'lucide-react'
import { TYPE_ICONS, TYPE_LABELS } from './constants'
import { getPropertyName, getPeriod } from './utils'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed']

export default function BookingTableRow({
    booking,
    editingId,
    editStatus,
    onEditStart,
    onEditStatusChange,
    onEditConfirm,
    onEditCancel,
    onCancel,
}: {
    booking: any
    editingId: string | null
    editStatus: string
    onEditStart: (id: string, currentStatus: string) => void
    onEditStatusChange: (status: string) => void
    onEditConfirm: (id: string) => void
    onEditCancel: () => void
    onCancel: (id: string) => void
}) {
    const isEditing = editingId === booking._id

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

            {/* Type */}
            <td className="px-6 py-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-600">
                    {TYPE_ICONS[booking.type]}
                    {TYPE_LABELS[booking.type] || booking.type}
                </span>
            </td>

            {/* Property */}
            <td className="px-6 py-5">
                <p className="text-sm font-bold text-gray-700 max-w-45 truncate">{getPropertyName(booking)}</p>
            </td>

            {/* Period */}
            <td className="px-6 py-5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                    <Calendar size={13} className="text-blue-400 shrink-0" />
                    <span>{getPeriod(booking)}</span>
                </div>
                {booking.type === 'flight' && booking.passengers && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{booking.passengers} Sərnişin</p>
                )}
            </td>

            {/* Price */}
            <td className="px-6 py-5">
                <p className="text-sm font-black text-gray-900">${booking.totalPrice}</p>
            </td>

            {/* Status */}
            <td className="px-6 py-5">
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <select
                            value={editStatus}
                            onChange={e => onEditStatusChange(e.target.value)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        >
                            {STATUS_OPTIONS.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => onEditConfirm(booking._id)}
                            className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 hover:bg-emerald-100"
                        >
                            <Check size={14} />
                        </button>
                        <button
                            onClick={onEditCancel}
                            className="p-1.5 bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <StatusBadge status={booking.status} />
                        <button
                            onClick={() => onEditStart(booking._id, booking.status)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <Edit2 size={12} />
                        </button>
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="px-6 py-5 text-center">
                {booking.status !== 'cancelled' ? (
                    <button
                        onClick={() => onCancel(booking._id)}
                        className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-all hover:underline decoration-2 underline-offset-4"
                    >
                        Ləğv et
                    </button>
                ) : (
                    <span className="text-xs font-bold text-gray-300 uppercase italic">Ləğv edilib</span>
                )}
            </td>
        </tr>
    )
}
