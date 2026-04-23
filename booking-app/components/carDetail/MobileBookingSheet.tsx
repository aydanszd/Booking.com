'use client'

import { X, Loader2, MapPin, Shield, ThumbsUp, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'
import DateRangePicker from '@/components/customThing/DateRangePicker'
import type { CarDetailType } from './types'
import { useCurrency } from '@/context/CurrencyContext'

export default function MobileBookingSheet({
    open, onClose, car,
    pickUp, dropOff, onPickUpChange, onDropOffChange,
    bookedRanges, onBook, bookingLoading,
}: {
    open: boolean
    onClose: () => void
    car: CarDetailType
    pickUp: string
    dropOff: string
    onPickUpChange: (d: string) => void
    onDropOffChange: (d: string) => void
    bookedRanges: { start: Date; end: Date }[]
    onBook: () => void
    bookingLoading: boolean
}) {
    const t = useTranslations('cars')
    const { format } = useCurrency()
    const days = (pickUp && dropOff)
        ? Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
        : 0

    return (
        <>
            <div
                className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="overflow-y-auto max-h-[85vh]">
                    <div className="bg-[#003b94] px-5 py-4 flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-xs font-medium mb-0.5">
                                {days > 0 ? t('daysTotal', { count: days }) : t('selectDates')}
                            </p>
                            <p className="text-white text-3xl font-bold leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                {days > 0 ? format(car.pricePerDay * days) : format(car.pricePerDay)}
                            </p>
                            <p className="text-white/40 text-xs mt-1">
                                {days > 0 ? `${t('taxesIncluded')}${car.winterFee ? ` · ${t('winterFeeInPrice')}` : ''}` : t('dailyPrice')}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-white mt-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-5 py-4 space-y-3">
                        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                            car.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {car.isAvailable ? t('available') : t('notAvailableNow')}
                        </div>

                        <DateRangePicker
                            bookedRanges={bookedRanges}
                            startDate={pickUp}
                            endDate={dropOff}
                            onStartChange={onPickUpChange}
                            onEndChange={onDropOffChange}
                            startLabel={t('pickUpDate')}
                            endLabel={t('dropOffDate')}
                        />

                        <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">{t('pickupReturnLocation')}</p>
                                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                                    {car.location.city}, {car.location.country}
                                </p>
                            </div>
                        </div>

                        {days > 0 && (
                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-500">
                                    <span>{format(car.pricePerDay)} × {t('days', { count: days })}</span>
                                    <span>{format(car.pricePerDay * days)}</span>
                                </div>
                                {car.winterFee && (
                                    <div className="flex justify-between text-gray-500">
                                        <span>{t('winterSeasonFee')}</span>
                                        <span className="text-emerald-600 font-semibold">{t('includedLabel')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-500">
                                    <span>{t('basicInsurance')}</span>
                                    <span className="text-emerald-600 font-semibold">{t('includedLabel')}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-800 text-sm">
                                    <span>{t('total')}</span>
                                    <span>{format(car.pricePerDay * days)}</span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onBook}
                            disabled={!car.isAvailable || bookingLoading || !pickUp || !dropOff}
                            className={`w-full font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 ${
                                car.isAvailable && pickUp && dropOff && !bookingLoading
                                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {bookingLoading
                                ? <><Loader2 className="w-4 h-4 animate-spin" /> {t('bookingInProgress')}</>
                                : !car.isAvailable ? t('notAvailableNow')
                                : !pickUp || !dropOff ? t('selectDates')
                                : t('bookNow')
                            }
                        </button>
                        <p className="text-center text-xs text-gray-400">{t('freeCancelPayLater')}</p>

                        <div className="flex justify-around pt-2 pb-4">
                            {[
                                { icon: <Shield className="w-4 h-4 text-emerald-500" />, key: 'securePayment' },
                                { icon: <ThumbsUp className="w-4 h-4 text-blue-500" />, key: 'freeCancellation' },
                                { icon: <Info className="w-4 h-4 text-amber-500" />, key: 'support247' },
                            ].map(({ icon, key }) => (
                                <div key={key} className="flex flex-col items-center gap-1 text-center">
                                    {icon}
                                    <span className="text-[10px] text-gray-500 font-medium">{t(key as any)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
