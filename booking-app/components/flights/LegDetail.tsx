'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import type { FlightType } from '@/types/flight'
import { formatTime, formatDateLabel } from '@/utils/flightUtils'
import AirlineLogo from './AirlineLogo'

export default function LegDetail({ flight, label }: { flight: FlightType; label?: string }) {
    const t = useTranslations('flights')
    const h = Math.floor(flight.duration / 60)
    const m = flight.duration % 60
    const durationStr = h > 0 ? `${h}${t('hourShort')} ${m}${t('minShort')}` : `${m}${t('minShort')}`

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-sm font-semibold text-gray-800">{label || formatDateLabel(flight.departureTime)}</span>
                <span className="text-sm text-gray-400 tabular-nums">{durationStr}</span>
            </div>
            <div className="px-4 py-4">
                <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AirlineLogo src={flight.logoUrl} name={flight.airline} size="lg" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">{flight.airline}</span>
                            {flight.flightNumber && (
                                <><span className="text-xs text-gray-400">·</span>
                                <span className="text-xs font-medium text-gray-600">{flight.flightNumber}</span></>
                            )}
                        </div>
                        {flight.alliance && <p className="text-xs text-gray-400 mt-0.5 truncate">{flight.alliance}</p>}
                    </div>
                    {flight.aircraft && (
                        <span className="shrink-0 text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap font-medium shadow-sm">
                            {flight.aircraft}
                        </span>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mt-1" />
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        {flight.stops?.map((_s, i) => (
                            <React.Fragment key={i}>
                                <div className="w-3 h-3 rounded-full border-2 border-amber-400 bg-white" />
                                <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 32 }} />
                            </React.Fragment>
                        ))}
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mb-1" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between" style={{ minHeight: 140 }}>
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">{formatTime(flight.departureTime)}</p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {flight.origin?.airport || flight.origin?.city}{' '}
                                <span className="text-gray-400">({flight.origin?.code})</span>
                            </p>
                        </div>
                        {flight.stops?.map((s, i) => {
                            const sh = Math.floor(s.duration / 60)
                            const sm = s.duration % 60
                            const sDur = sh > 0 ? `${sh}${t('hourShort')} ${sm}${t('minShort')}` : `${sm}${t('minShort')}`
                            return (
                                <div key={i} className="my-2 flex items-center gap-2">
                                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                        {s.airport} · {sDur} {t('waitTime')}
                                    </span>
                                </div>
                            )
                        })}
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">{formatTime(flight.arrivalTime)}</p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {flight.destination?.airport || flight.destination?.city}{' '}
                                <span className="text-gray-400">({flight.destination?.code})</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start shrink-0">
                        {flight.baggagePerPax && (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 whitespace-nowrap">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {flight.baggagePerPax}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
