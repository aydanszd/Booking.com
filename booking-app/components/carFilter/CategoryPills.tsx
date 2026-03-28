import { Car } from 'lucide-react'
import { CATEGORIES_NAV } from './constants'

interface Props {
    activeCategory: string | null
    onSelect: (value: string) => void
}

export default function CategoryPills({ activeCategory, onSelect }: Props) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES_NAV.map(cat => (
                <button key={cat.value} onClick={() => onSelect(cat.value)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${
                        activeCategory === cat.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}>
                    <Car className="w-3.5 h-3.5" /> {cat.label}
                </button>
            ))}
        </div>
    )
}
