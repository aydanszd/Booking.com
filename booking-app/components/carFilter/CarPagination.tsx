import { ChevronRight } from 'lucide-react'

interface Props {
    page: number
    totalPages: number
    onPageChange: (p: number) => void
}

export default function CarPagination({ page, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null
    return (
        <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'}`}>
                    {p}
                </button>
            ))}
            {totalPages > 5 && <span className="text-gray-400 text-sm">...</span>}
            {page < totalPages && (
                <button onClick={() => onPageChange(page + 1)}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ml-1">
                    Sonraki <ChevronRight className="w-4 h-4" />
                </button>
            )}
        </div>
    )
}
