'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Filters } from '@/types/flight'
import HeaderDropdown from './HeaderDropdown'

interface Props {
    filters: Filters
    onSearch: () => void
}

export default function SearchHeader({ filters, onSearch }: Props) {
    const t = useTranslations('flights')
    const [tripType, setTripType] = useState(t('roundTrip'))
    const [passengers, setPassengers] = useState(t('passenger', { count: 2 }))
    const [cabin, setCabin] = useState(t('economy'))

    return (
        <div className="bg-yellow-400 px-5 py-4 rounded-2xl mb-6 shadow-sm w-full">
            <div className="flex flex-wrap items-center gap-2.5">
                <HeaderDropdown value={tripType} options={[t('roundTrip'), t('oneWay'), t('multiCity')]} onChange={setTripType} />
                <HeaderDropdown value={passengers}
                    options={[1, 2, 3, 4].map(n => t('passenger', { count: n }))}
                    onChange={setPassengers} />
                <HeaderDropdown value={cabin}
                    options={[t('economy'), t('premiumEconomy'), t('business'), t('first')]}
                    onChange={setCabin} />
                <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">{filters.origin || 'Baku (BAK)'}</span>
                    </div>
                    <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:rotate-180 transition-all duration-300 shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">{filters.destination || 'Istanbul (IST)'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm shrink-0">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">05.04 — 10.04</span>
                    </div>
                    <button onClick={onSearch} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all shadow-sm shrink-0">
                        {t('searchBtn')}
                    </button>
                </div>
            </div>
        </div>
    )
}
