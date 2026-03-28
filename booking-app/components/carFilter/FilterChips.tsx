import { X } from 'lucide-react'

interface Chip { label: string; onRemove: () => void }

export default function FilterChips({ chips, onClearAll }: { chips: Chip[]; onClearAll: () => void }) {
    if (!chips.length) return null
    return (
        <div className="flex items-center gap-2 flex-wrap mb-3">
            {chips.map(chip => (
                <div key={chip.label} className="flex items-center gap-1.5 bg-white border border-blue-300 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {chip.label}
                    <button onClick={chip.onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <button onClick={onClearAll} className="text-xs font-semibold text-blue-600 hover:underline">Tümünü temizle</button>
        </div>
    )
}
