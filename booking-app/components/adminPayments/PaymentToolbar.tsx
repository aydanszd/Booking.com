'use client'

import { Search } from 'lucide-react'
import { TYPE_ICONS, TYPE_LABELS } from './theme'
import type { SortKey } from '@/utils/paymentUtils'

const TYPE_TABS = ['all', 'building', 'car', 'flight'] as const

const STATUS_OPTIONS = [
    { value: 'all',       label: 'Bütün statuslar' },
    { value: 'partial',   label: 'Qismən ödənilib' },
    { value: 'paid',      label: 'Tam ödənilib' },
    { value: 'unpaid',    label: 'Ödənilməyib' },
    { value: 'cancelled', label: 'Ləğv edilib' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'date',      label: 'Tarixə görə' },
    { value: 'total',     label: 'Ümumi məbləğə görə' },
    { value: 'paid',      label: 'Ödənilənə görə' },
    { value: 'remaining', label: 'Qalığa görə' },
]

export default function PaymentToolbar({
    filterType, onFilterTypeChange,
    filterStatus, onFilterStatusChange,
    sortBy, onSortChange,
    searchTerm, onSearchChange,
}: {
    filterType: string
    onFilterTypeChange: (v: string) => void
    filterStatus: string
    onFilterStatusChange: (v: string) => void
    sortBy: SortKey
    onSortChange: (v: SortKey) => void
    searchTerm: string
    onSearchChange: (v: string) => void
}) {
    return (
        <div className="flex items-center gap-3 flex-wrap">

            {/* Type tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1.5">
                {TYPE_TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => onFilterTypeChange(tab)}
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

            {/* Payment status filter */}
            <select
                value={filterStatus}
                onChange={e => onFilterStatusChange(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-blue-500 cursor-pointer"
            >
                {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Sort */}
            <select
                value={sortBy}
                onChange={e => onSortChange(e.target.value as SortKey)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 outline-none focus:border-blue-500 cursor-pointer"
            >
                {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="İstifadəçi, e-poçt, mülk..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    className="pl-11 pr-5 py-3 bg-white rounded-2xl text-sm font-semibold text-gray-700 outline-none border border-gray-200 shadow-sm focus:border-blue-500 w-64 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
        </div>
    )
}
