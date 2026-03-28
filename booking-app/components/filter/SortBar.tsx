import { ArrowUpDown, X } from 'lucide-react'

type SortBy = 'rating' | 'price_asc' | 'price_desc'

interface Chip {
    label: string
    onRemove: () => void
}

interface Props {
    sortBy: SortBy
    chips: Chip[]
    onSortChange: (v: SortBy) => void
    onClearAll: () => void
}

const SORT_OPTIONS: [SortBy, string][] = [
    ['rating', 'Top rated'],
    ['price_asc', 'Price: low to high'],
    ['price_desc', 'Price: high to low'],
]

export default function SortBar({ sortBy, chips, onSortChange, onClearAll }: Props) {
    const sortLabel = SORT_OPTIONS.find(([v]) => v === sortBy)?.[1] ?? 'Top rated'

    return (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="relative group">
                <button
                    type="button"
                    className="border border-gray-300 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 flex items-center gap-1.5"
                >
                    <ArrowUpDown size={12} /> Sort: {sortLabel}
                </button>
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 hidden group-hover:block min-w-45">
                    {SORT_OPTIONS.map(([val, label]) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => onSortChange(val)}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${
                                sortBy === val ? 'text-[#006ce4] font-semibold' : 'text-gray-700'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {chips.map(chip => (
                <div
                    key={chip.label}
                    className="flex items-center gap-1.5 bg-white border border-[#006ce4] rounded-full px-3 py-1.5"
                >
                    <span className="text-xs font-medium text-gray-700">{chip.label}</span>
                    <button type="button" onClick={chip.onRemove} className="text-gray-400 hover:text-gray-600">
                        <X size={13} />
                    </button>
                </div>
            ))}

            {chips.length > 0 && (
                <button type="button" onClick={onClearAll} className="text-xs text-[#006ce4] hover:underline ml-1">
                    Clear all
                </button>
            )}
        </div>
    )
}
