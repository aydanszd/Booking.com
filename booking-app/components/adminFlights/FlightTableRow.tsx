import { Plane, Pencil, Trash2 } from 'lucide-react'
import type { FlightType } from '@/types/flight'
import AirlineLogo from './AirlineLogo'
import { cabinColor, cabinLabel, statusColor, statusLabel, fmt, fmtDate } from './constants'

export default function FlightTableRow({
    flight,
    onEdit,
    onDelete,
}: {
    flight: FlightType
    onEdit: (f: FlightType) => void
    onDelete: (f: FlightType) => void
}) {
    return (
        <tr className="hover:bg-gray-50 transition-colors">

            {/* Airline */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <AirlineLogo logoUrl={flight.logoUrl} airline={flight.airline} />
                    <div>
                        <p className="font-mono font-bold text-[13px] text-gray-700">{flight.flightNumber || '—'}</p>
                        <p className="text-[11px] text-gray-400">{flight.airline}</p>
                    </div>
                </div>
            </td>

            {/* Route */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className="font-semibold">{flight.origin.code}</span>
                    <Plane size={10} className="text-gray-400" />
                    <span className="font-semibold">{flight.destination.code}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                    {flight.origin.city} → {flight.destination.city}
                </p>
            </td>

            {/* Date */}
            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                {fmtDate(flight.departureTime)}
            </td>

            {/* Times */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span className="font-semibold text-[13px] text-gray-700">{fmt(flight.departureTime)}</span>
                <span className="text-gray-300 mx-1">→</span>
                <span className="font-semibold text-[13px] text-gray-700">{fmt(flight.arrivalTime)}</span>
            </td>

            {/* Duration */}
            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {flight.duration
                    ? `${Math.floor(flight.duration / 60)}s ${flight.duration % 60}dəq`
                    : '—'}
            </td>

            {/* Cabin */}
            <td className="px-4 py-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cabinColor[flight.cabin] ?? 'bg-gray-100 text-gray-600'}`}>
                    {cabinLabel[flight.cabin]}
                </span>
            </td>

            {/* Seats */}
            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                {flight.totalSeats - flight.bookedSeats}/{flight.totalSeats}
            </td>

            {/* Price */}
            <td className="px-4 py-3 font-semibold text-[13px] text-gray-800 whitespace-nowrap">
                ${flight.price}
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor(flight)}`}>
                    {statusLabel(flight)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(flight)}
                        className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors"
                        title="Redaktə et"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(flight)}
                        className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        title="Sil"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    )
}
