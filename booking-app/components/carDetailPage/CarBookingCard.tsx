import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import DateRangePicker from '@/components/DateRangePicker'
import type { CarWithReviews } from '@/types/car'

interface Props {
    car: CarWithReviews
    pickUp: string
    dropOff: string
    days: number
    bookedRanges: { start: Date; end: Date }[]
    bookingLoading: boolean
    onPickUpChange: (v: string) => void
    onDropOffChange: (v: string) => void
    onBook: () => void
}

export default function CarBookingCard({
    car, pickUp, dropOff, days, bookedRanges,
    bookingLoading, onPickUpChange, onDropOffChange, onBook,
}: Props) {
    const t = useTranslations('cars')

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-5">
            <h3 className="text-xl font-bold text-gray-900">{t('bookingSummary')}</h3>

            <DateRangePicker
                bookedRanges={bookedRanges}
                startDate={pickUp}
                endDate={dropOff}
                onStartChange={onPickUpChange}
                onEndChange={onDropOffChange}
                startLabel={t('pickUpLabel')}
                endLabel={t('dropOffLabel')}
            />

            <div className="py-6 border-y border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-500 uppercase">{t('rentalPrice')}</span>
                    <span className="text-sm font-black text-gray-900">${car.pricePerDay} {t('perDay')}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-500 uppercase">{t('duration')}</span>
                    <span className="text-sm font-black text-gray-900">{t('days', { count: days })}</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('totalCost')}</p>
                        <p className="text-4xl font-black text-gray-900">${car.pricePerDay * days}</p>
                    </div>
                    <div className="text-xs text-[#008009] font-bold bg-green-50 px-2 py-1 rounded">
                        {t('bestPrice')}
                    </div>
                </div>
            </div>

            <button
                onClick={onBook}
                disabled={bookingLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-lg transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
            >
                {bookingLoading ? <Loader2 className="animate-spin" size={24} /> : t('bookCar')}
            </button>

            <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-tighter">
                {t('noHiddenFees')}
            </p>
        </div>
    )
}
