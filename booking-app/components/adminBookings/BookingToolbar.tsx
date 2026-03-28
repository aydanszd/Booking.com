'use client'

import { Search, Filter } from 'lucide-react'
import { TYPE_ICONS, TYPE_LABELS } from './constants'

const TYPE_TABS = ['all', 'building', 'car', 'flight'] as const

export default function BookingToolbar({
    filterType,
    onFilterChange,
    searchTerm,
    onSearchChange,
    onRefresh,
}: {
    filterType: string
    onFilterChange: (t: string) => void
    searchTerm: string
    onSearchChange: (v: string) => void
    onRefresh: () => void
}) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5">
                {TYPE_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => onFilterChange(tab)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            filterType === tab
                                ? 'bg-blue-600 text-white shadow'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab !== 'all' && TYPE_ICONS[tab]}
                        {tab === 'all' ? 'Hamısı' : TYPE_LABELS[tab]}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="İstifadəçi, e-poçt, mülk..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-11 pr-5 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-200 shadow-sm focus:border-blue-500 w-72 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>

            {/* Refresh */}
            <button
                onClick={onRefresh}
                className="p-3 bg-white rounded-2xl text-gray-400 border border-gray-200 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all"
                title="Yenilə"
            >
                <Filter size={18} />
            </button>
        </div>
    )
}
