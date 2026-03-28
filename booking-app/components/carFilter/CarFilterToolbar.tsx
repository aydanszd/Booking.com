import { ArrowUpDown, LayoutList, LayoutGrid, SlidersHorizontal } from 'lucide-react'

interface Props {
    count: number
    loading: boolean
    viewMode: 'list' | 'grid'
    sortOrder: string
    filterChipsCount: number
    onViewMode: (v: 'list' | 'grid') => void
    onSort: (v: string) => void
    onOpenSidebar: () => void
}

export default function CarFilterToolbar({ count, loading, viewMode, sortOrder, filterChipsCount, onViewMode, onSort, onOpenSidebar }: Props) {
    return (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {loading ? '...' : <>{count} <span className="font-normal text-gray-500">araba mevcut</span></>}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={onOpenSidebar}
                    className="lg:hidden border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-700 hover:border-gray-400 transition-colors">
                    <SlidersHorizontal size={13} /> Filtrele
                    {filterChipsCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {filterChipsCount}
                        </span>
                    )}
                </button>
                <button onClick={() => onViewMode('list')}
                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === 'list' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                    <LayoutList size={13} /> Liste
                </button>
                <button onClick={() => onViewMode('grid')}
                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === 'grid' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                    <LayoutGrid size={13} /> Grid
                </button>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                    <select value={sortOrder} onChange={e => onSort(e.target.value)}
                        className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer">
                        <option>Önerilen</option>
                        <option>Fiyat: Artan</option>
                        <option>Fiyat: Azalan</option>
                        <option>Değerlendirme</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
