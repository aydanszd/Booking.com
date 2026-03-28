import { Loader2 } from 'lucide-react'
import type { FlightType } from '@/types/flight'
import FlightTableRow from './FlightTableRow'

const HEADERS = ['Uçuş', 'Marşrut', 'Tarix', 'Uçuş / Eniş', 'Müddət', 'Kabinə', 'Oturacaq', 'Qiymət', 'Status', 'Əməliyyat']

export default function FlightTable({
    flights,
    loading,
    onEdit,
    onDelete,
}: {
    flights: FlightType[]
    loading: boolean
    onEdit: (f: FlightType) => void
    onDelete: (f: FlightType) => void
}) {
    return (
        <div className="overflow-x-auto max-h-140 overflow-y-auto">
            <table className="w-full text-sm min-w-240">
                <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50">
                        {HEADERS.map(h => (
                            <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr>
                            <td colSpan={10} className="py-16">
                                <div className="flex justify-center">
                                    <Loader2 size={26} className="animate-spin text-[#006ce4]" />
                                </div>
                            </td>
                        </tr>
                    ) : flights.length === 0 ? (
                        <tr>
                            <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                                Nəticə tapılmadı
                            </td>
                        </tr>
                    ) : (
                        flights.map(f => (
                            <FlightTableRow
                                key={f._id}
                                flight={f}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
