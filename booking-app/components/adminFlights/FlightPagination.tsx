import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LIMIT } from './constants'

export default function FlightPagination({
    page,
    total,
    totalPages,
    onPageChange,
}: {
    page: number
    total: number
    totalPages: number
    onPageChange: (p: number) => void
}) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
                {total} nəticədən {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}
            </p>
            <div className="flex items-center gap-1">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                >
                    <ChevronLeft size={13} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                            p === page
                                ? 'bg-[#006ce4] text-white'
                                : 'border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4]'
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-40 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                >
                    <ChevronRight size={13} />
                </button>
            </div>
        </div>
    )
}
