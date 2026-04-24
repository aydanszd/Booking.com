'use client'

import { useTranslations } from 'next-intl'
import type { Filters } from '@/types/flight'
import HeaderDropdown from './HeaderDropdown'

interface Props {
    filters: Filters
    setFilters: (f: Filters) => void
    onSearch: () => void
}

export default function SearchHeader({ filters, setFilters, onSearch }: Props) {
    const t = useTranslations('flights')

    const CABIN_OPTIONS = [t('economy'), t('premiumEconomy'), t('business'), t('first')]
    const CABIN_VALUES = ['economy', 'premium_economy', 'business', 'first']

    const selectedCabinLabel = filters.cabin.length === 1
        ? CABIN_OPTIONS[CABIN_VALUES.indexOf(filters.cabin[0])] ?? t('economy')
        : t('economy')

    const handleCabinChange = (label: string) => {
        const idx = CABIN_OPTIONS.indexOf(label)
        const value = CABIN_VALUES[idx] ?? 'economy'
        setFilters({ ...filters, cabin: [value] })
    }

    const swapLocations = () => {
        setFilters({ ...filters, origin: filters.destination, destination: filters.origin })
    }

    return (
        <div className="bg-yellow-400 px-5 py-4 rounded-2xl mb-6 shadow-sm w-full">
            <div className="flex flex-wrap items-center gap-2.5">
                <HeaderDropdown
                    value={selectedCabinLabel}
                    options={CABIN_OPTIONS}
                    onChange={handleCabinChange}
                />
                <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                    {/* Origin */}
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                            value={filters.origin}
                            onChange={e => setFilters({ ...filters, origin: e.target.value })}
                            placeholder="Baku (BAK)"
                            className="text-sm font-medium text-gray-700 flex-1 bg-transparent outline-none min-w-0"
                        />
                    </div>

                    {/* Swap */}
                    <button onClick={swapLocations} className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:rotate-180 transition-all duration-300 shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>

                    {/* Destination */}
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                            value={filters.destination}
                            onChange={e => setFilters({ ...filters, destination: e.target.value })}
                            placeholder="Istanbul (IST)"
                            className="text-sm font-medium text-gray-700 flex-1 bg-transparent outline-none min-w-0"
                        />
                    </div>

                    {/* Search */}
                    <button onClick={onSearch} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all shadow-sm shrink-0">
                        {t('searchBtn')}
                    </button>
                </div>
            </div>
        </div>
    )
}
