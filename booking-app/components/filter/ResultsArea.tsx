import { Loader2, SlidersHorizontal } from 'lucide-react'
import { ListCard } from '@/components/cards/ListCard'
import { GridCard } from '@/components/cards/GridCard'

interface Props {
    loading: boolean
    error: string | null
    viewMode: 'list' | 'grid'
    items: any[]
    onReset: () => void
}

export default function ResultsArea({ loading, error, viewMode, items, onReset }: Props) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                <p className="text-sm text-gray-500">Loading properties...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-medium mb-2">{error}</p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="text-[#006ce4] text-sm hover:underline"
                >
                    Try again
                </button>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <SlidersHorizontal size={40} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No properties match your filters</p>
                <button type="button" onClick={onReset} className="mt-3 text-[#006ce4] text-sm hover:underline">
                    Reset filters
                </button>
            </div>
        )
    }

    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {items.map(b => <ListCard key={b._id} building={b} />)}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map(b => <GridCard key={b._id} building={b} />)}
        </div>
    )
}
