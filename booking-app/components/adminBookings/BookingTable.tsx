'use client'

import { Clock } from 'lucide-react'
import BookingTableRow from './BookingTableRow'

const TABLE_HEADERS = ['İstifadəçi', 'Tip', 'Mülk / Xidmət', 'Müddət', 'Məbləğ', 'Status', 'Əməliyyat']

export default function BookingTable({
    bookings,
    editingId,
    editStatus,
    onEditStart,
    onEditStatusChange,
    onEditConfirm,
    onEditCancel,
    onCancel,
}: {
    bookings: any[]
    editingId: string | null
    editStatus: string
    onEditStart: (id: string, status: string) => void
    onEditStatusChange: (status: string) => void
    onEditConfirm: (id: string) => void
    onEditCancel: () => void
    onCancel: (id: string) => void
}) {
    return (
        <div className="bg-white rounded-4xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
                <thead>
                    <tr className="bg-gray-50/50">
                        {TABLE_HEADERS.map(h => (
                            <th
                                key={h}
                                className={`px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 ${h === 'Əməliyyat' ? 'text-center' : ''}`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {bookings.map(booking => (
                        <BookingTableRow
                            key={booking._id}
                            booking={booking}
                            editingId={editingId}
                            editStatus={editStatus}
                            onEditStart={onEditStart}
                            onEditStatusChange={onEditStatusChange}
                            onEditConfirm={onEditConfirm}
                            onEditCancel={onEditCancel}
                            onCancel={onCancel}
                        />
                    ))}
                </tbody>
            </table>

            {bookings.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <Clock size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Rezervasiya tapılmadı</p>
                </div>
            )}
        </div>
    )
}
