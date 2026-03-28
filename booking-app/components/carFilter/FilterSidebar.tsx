import { X } from 'lucide-react'
import LeafletMap from './LeafletMap'
import SidebarInner from './SidebarInner'
import type { ActiveFilters } from '@/types/carFilter'

interface Props {
    filters: ActiveFilters
    onChange: (f: ActiveFilters) => void
    onReset: () => void
    open: boolean
    onClose: () => void
}

export default function FilterSidebar({ filters, onChange, onReset, open, onClose }: Props) {
    return (
        <>
            <aside className="hidden lg:block w-[268px] flex-shrink-0 self-start sticky top-4">
                <div className="rounded-2xl overflow-hidden mb-3 h-[130px] border border-gray-200">
                    <LeafletMap />
                </div>
                <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900">Filtreleme</h2>
                        <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                            Tüm filtreleri temizle
                        </button>
                    </div>
                    <div className="px-4">
                        <SidebarInner filters={filters} onChange={onChange} onReset={onReset} />
                    </div>
                </div>
            </aside>

            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                    <div className="relative z-10 bg-white w-72 max-w-[85vw] h-full shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                            <p className="text-base font-bold text-gray-800">Filtreleme</p>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4">
                            <SidebarInner filters={filters} onChange={onChange} onReset={onReset} />
                        </div>
                        <div className="px-4 py-4 border-t border-gray-100">
                            <button onClick={onClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                                Sonuçları gör
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
