'use client'

import { Search, Filter, Plus } from 'lucide-react'
import { CABINS, cabinLabel } from './constants'

export default function FlightToolbar({
    search,
    onSearchChange,
    filterCabin,
    onFilterChange,
    showFilter,
    onToggleFilter,
    onAdd,
}: {
    search: string
    onSearchChange: (v: string) => void
    filterCabin: string
    onFilterChange: (v: string) => void
    showFilter: boolean
    onToggleFilter: () => void
    onAdd: () => void
}) {
    return (
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                <Search size={13} className="text-gray-400" />
                <input
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Axtar..."
                    className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full"
                />
            </div>

            {/* Cabin filter */}
            <div className="relative">
                <button
                    onClick={onToggleFilter}
                    className={`flex items-center gap-2 text-xs border rounded-xl px-3 py-2 transition-colors ${
                        filterCabin
                            ? 'border-[#006ce4] text-[#006ce4]'
                            : 'border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4]'
                    }`}
                >
                    <Filter size={13} />
                    Filtr {filterCabin && `· ${cabinLabel[filterCabin]}`}
                </button>
                {showFilter && (
                    <div className="absolute top-10 left-0 z-20 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 min-w-45">
                        {CABINS.map(c => (
                            <button
                                key={c}
                                onClick={() => onFilterChange(c)}
                                className={`w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                                    filterCabin === c
                                        ? 'bg-[#006ce4] text-white'
                                        : 'hover:bg-gray-50 text-gray-600'
                                }`}
                            >
                                {c ? cabinLabel[c] : 'Hamısı'}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Add button */}
            <button
                onClick={onAdd}
                className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium"
            >
                <Plus size={13} /> Uçuş Əlavə Et
            </button>
        </div>
    )
}
