import { Users, Settings2, Gauge, MapPin, Fuel, Wind, Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import SpecBadge from './SpecBadge'
import type { CarDetailType } from './types'

interface Props {
    car: CarDetailType
    scoreLabel: (v: number) => string
}

export default function CarHeaderSection({ car, scoreLabel }: Props) {
    const t = useTranslations('cars')

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                            car.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                        }`}>
                            {car.isAvailable ? t('available') : t('notAvailableNow')}
                        </span>
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap capitalize">
                            {car.category}
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        {car.title}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">{car.brand} {car.model}</p>
                    <p className="flex items-center gap-1 text-sm text-blue-500 font-semibold mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {car.location.city}, {car.location.country}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{t('dailyPrice')}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mt-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                        US${car.pricePerDay}
                    </p>
                    {car.rating !== undefined && (
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                            <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded-lg">
                                {car.rating.toFixed(1)}
                            </div>
                            <span className="text-xs font-semibold text-gray-600">{scoreLabel(car.rating)}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                <SpecBadge icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('seats', { count: car.seats })} />
                <SpecBadge
                    icon={<Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label={car.transmission === 'automatic' ? t('automatic') : t('manual')}
                />
                <SpecBadge
                    icon={<Gauge className="w-4 h-4 sm:w-5 sm:h-5" />}
                    label={car.mileage > 0 ? `${car.mileage.toLocaleString()} km` : t('unlimitedKm')}
                />
                <SpecBadge icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('withAC')} />
                {car.doors && (
                    <SpecBadge icon={<Car className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('doorsCount', { count: car.doors })} />
                )}
                <SpecBadge icon={<Fuel className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('petrol')} />
            </div>
        </div>
    )
}
