import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
    page: number
    totalPages: number
    totalCount: number
    limit: number
    onPageChange: (p: number) => void
}

function getPageRange(page: number, totalPages: number): (number | string)[] {
    const delta = 2
    const range: (number | string)[] = []
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
        range.push(i)
    }
    if (page - delta > 2) range.unshift('...')
    range.unshift(1)
    if (page + delta < totalPages - 1) range.push('...')
    if (totalPages > 1) range.push(totalPages)
    return range
}

export default function CarPagination({ page, totalPages, totalCount, limit, onPageChange }: Props) {
    if (totalPages <= 1) return null

    return (
        <div className="mt-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
                Showing{' '}
                <span className="font-semibold text-gray-900">{Math.min((page - 1) * limit + 1, totalCount)}</span>
                {' – '}
                <span className="font-semibold text-gray-900">{Math.min(page * limit, totalCount)}</span>
                {' of '}
                <span className="font-semibold text-gray-900">{totalCount}</span>
                {' cars'}
            </p>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                    type="button"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
                >
                    <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                    {getPageRange(page, totalPages).map((p, i) =>
                        p === '...' ? (
                            <span key={`els-${i}`} className="px-1.5 text-gray-400">...</span>
                        ) : (
                            <button
                                key={i}
                                type="button"
                                onClick={() => onPageChange(Number(p))}
                                className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${
                                    page === Number(p)
                                        ? 'bg-[#006ce4] text-white shadow-md shadow-blue-200'
                                        : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}
