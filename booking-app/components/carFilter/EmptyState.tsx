import { SlidersHorizontal } from 'lucide-react'

export default function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <SlidersHorizontal className="w-10 h-10 text-gray-300 mb-4" />
            <p className="font-semibold text-gray-500">Araç bulunamadı</p>
            <button onClick={onReset} className="mt-3 text-sm text-blue-600 hover:underline">Filtreleri sıfırla</button>
        </div>
    )
}
