'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { FlightType } from '@/types/flight'
import { seatsLeft, formatDateLabel } from '@/utils/flightUtils'
import { useCurrency } from '@/context/CurrencyContext'
import LegRow from './LegRow'
import LegDetail from './LegDetail'

export default function FlightCard({ flight }: { flight: FlightType }) {
    const t = useTranslations('flights')
    const { selected, convert } = useCurrency()
    const [expanded, setExpanded] = useState(false)

    const CABIN_MAP: Record<string, string> = {
        economy:         t('economy'),
        premium_economy: t('premiumEconomy'),
        business:        t('business'),
        first:           t('first'),
    }

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation()
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) { window.location.href = '/signin'; return }
        const params = new URLSearchParams({
            id: flight._id,
            airline: flight.airline || '',
            flightNumber: flight.flightNumber || '',
            origin: flight.origin?.code || '',
            originCity: flight.origin?.city || '',
            destination: flight.destination?.code || '',
            destinationCity: flight.destination?.city || '',
            departureTime: flight.departureTime || '',
            arrivalTime: flight.arrivalTime || '',
            cabin: flight.cabin || '',
            price: String(flight.price),
            adults: '1',
            children: '0',
            totalPrice: String(flight.price),
            logoUrl: flight.logoUrl || '',
        })
        window.location.href = `/checkout/flight?${params.toString()}`
    }

    const left = seatsLeft(flight)
    const isGood = (flight.flightQuality ?? 0) >= 8

    return (
        <div className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${expanded ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
            <div className="flex flex-col sm:flex-row cursor-pointer select-none" onClick={() => setExpanded(v => !v)}>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <button onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {t('share')}
                        </button>
                        <div className="flex gap-1.5">
                            {isGood && (
                                <span className="text-[10px] font-semibold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                                    {t('sortBest')}
                                </span>
                            )}
                            {left <= 5 && left > 0 && (
                                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                    ⚡ {t('seatsLeft', { count: left })}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1 divide-y divide-gray-100">
                        <LegRow flight={flight} />
                        {flight.inbound && <LegRow flight={flight.inbound} />}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{flight.airline}</p>
                        <div className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="sm:w-44 p-4 sm:border-l border-t sm:border-t-0 border-gray-100 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 bg-gray-50 sm:bg-white">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 tabular-nums">
                            {selected.symbol}{convert(flight.price)}
                            <span className="text-xs font-normal text-gray-400 ml-1">/ {t('perPerson')}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{CABIN_MAP[flight.cabin] || flight.cabin}</div>
                    </div>
                    <button onClick={handleSelect}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                        {t('select')}
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-blue-100 px-4 pb-5 pt-4 bg-blue-50/30 space-y-3">
                    <LegDetail flight={flight} label={`${t('departure')} • ${formatDateLabel(flight.departureTime)}`} />
                    {flight.inbound && (
                        <LegDetail flight={flight.inbound} label={`${t('return')} • ${formatDateLabel(flight.inbound.departureTime)}`} />
                    )}
                    {flight.bookingSites?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">{t('bookingSites')}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {flight.bookingSites.map((site, i) => (
                                    <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:shadow-sm transition-all group">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{site.name}</span>
                                        <span className="text-sm font-bold text-blue-600">{selected.symbol}{convert(site.price)}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                        <p className="text-xs text-gray-400">
                            {flight.bookingSites?.length ? t('dealsFrom', { count: flight.bookingSites.length }) : ''}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 tabular-nums">
                                    {selected.symbol}{convert(flight.price)}{' '}
                                    <span className="text-xs font-normal text-gray-400">/ {t('perPerson')}</span>
                                </p>
                            </div>
                            <button onClick={handleSelect} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                                {t('select')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
