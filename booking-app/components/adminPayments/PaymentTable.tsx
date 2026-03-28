import { CreditCard, ChevronDown } from 'lucide-react'
import PaymentTableRow from './PaymentTableRow'
import type { EnrichedBooking, SortKey } from '@/utils/paymentUtils'

const HEADERS: { label: string; key?: SortKey; activeColor?: string }[] = [
    { label: 'İstifadəçi' },
    { label: 'Tip / Mülk' },
    { label: 'Tarix' },
    { label: 'Ümumi məbləğ',  key: 'total',     activeColor: 'hover:text-blue-600' },
    { label: 'Ödənilib (30%)', key: 'paid',      activeColor: 'hover:text-emerald-600' },
    { label: 'Qalan məbləğ',  key: 'remaining',  activeColor: 'hover:text-amber-600' },
    { label: 'Ödəniş statusu' },
]

export default function PaymentTable({
    rows,
    sortBy,
    onSortChange,
}: {
    rows: EnrichedBooking[]
    sortBy: SortKey
    onSortChange: (k: SortKey) => void
}) {
    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                    <tr className="bg-gray-50/50">
                        {HEADERS.map(({ label, key, activeColor }) => (
                            <th
                                key={label}
                                onClick={() => key && onSortChange(key)}
                                className={`px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 ${key ? `cursor-pointer ${activeColor}` : ''}`}
                            >
                                <span className="flex items-center gap-1">
                                    {label}
                                    {key && sortBy === key && <ChevronDown size={10} />}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {rows.map(booking => (
                        <PaymentTableRow key={booking._id} booking={booking} />
                    ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <div className="py-20 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <CreditCard size={22} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Ödəniş tapılmadı</p>
                </div>
            )}
        </div>
    )
}
