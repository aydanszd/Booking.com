'use client'

import { useTranslations } from 'next-intl'
import type { FlightType } from '@/types/flight'
import { formatTime } from '@/utils/flightUtils'
import AirlineLogo from './AirlineLogo'

export default function LegRow({ flight }: { flight: FlightType }) {
    const t = useTranslations('flights')
    const stopCount = flight.stops?.length ?? 0
    const h = Math.floor(flight.duration / 60)
    const m = flight.duration % 60
    const durationStr = h > 0 ? `${h}${t('hourShort')} ${m}${t('minShort')}` : `${m}${t('minShort')}`

    return (
        <div className="flex items-center gap-3 py-1">
            <AirlineLogo src={flight.logoUrl} name={flight.airline} />
            <div className="min-w-0 flex-1">
                <span className="font-semibold text-gray-900 text-sm tabular-nums">
                    {formatTime(flight.departureTime)} – {formatTime(flight.arrivalTime)}
                </span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                    {flight.origin?.code} — {flight.destination?.code}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs text-gray-500">
                {stopCount === 0 ? (
                    <span className="hidden sm:inline font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {t('directFlight')}
                    </span>
                ) : (
                    <span className="hidden sm:inline font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {t('stopsCount', { count: stopCount })}
                    </span>
                )}
                <span className="tabular-nums whitespace-nowrap">{durationStr}</span>
            </div>
        </div>
    )
}
