import { LayoutList, LayoutGrid, SlidersHorizontal } from 'lucide-react'
import { capitalize } from '@/utils/buildingUtils'

interface Props {
    city: string
    country: string
    count: number
    loading: boolean
    viewMode: 'list' | 'grid'
    chipsCount: number
    onViewMode: (v: 'list' | 'grid') => void
    onOpenSidebar: () => void
}

export default function FilterToolbar({ city, country, count, loading, viewMode, chipsCount, onViewMode, onOpenSidebar }: Props) {
    return (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {city || country || 'All properties'}:{' '}
                <span className="font-normal">{loading ? '...' : `${count} found`}</span>
            </h1>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onOpenSidebar}
                    className="lg:hidden border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-700 hover:border-gray-400 transition-colors"
                >
                    <SlidersHorizontal size={13} />
                    Filters
                    {chipsCount > 0 && (
                        <span className="bg-[#006ce4] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {chipsCount}
                        </span>
                    )}
                </button>

                {(['list', 'grid'] as const).map(mode => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => onViewMode(mode)}
                        className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${
                            viewMode === mode
                                ? 'border-[#006ce4] text-[#006ce4] bg-blue-50'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {mode === 'list' ? <LayoutList size={13} /> : <LayoutGrid size={13} />}
                        {capitalize(mode)}
                    </button>
                ))}
            </div>
        </div>
    )
}
