'use client'

import { useTranslations } from 'next-intl'

export default function MobileStickyBar({
    price,
    days,
    onBook,
}: {
    price: number
    days: number
    onBook: () => void
}) {
    const t = useTranslations('cars')
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex-1">
                <p className="text-xs text-gray-400 leading-none">{days > 0 ? t('daysTotal', { count: days }) : t('dailyPrice')}</p>
                <p className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    US${days > 0 ? price * days : price}
                </p>
            </div>
            <button
                onClick={onBook}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
                {t('makeReservation')}
            </button>
        </div>
    )
}
