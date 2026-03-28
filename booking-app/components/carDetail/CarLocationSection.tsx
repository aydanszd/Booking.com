import { MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import GoogleMap from './GoogleMap'
import type { CarDetailType } from './types'

export default function CarLocationSection({ car }: { car: CarDetailType }) {
    const t = useTranslations('cars')

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{t('pickupLocationLabel')}</h2>
            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-sm font-semibold text-blue-600">
                    {car.location.city}, {car.location.country}
                </span>
            </div>
            {car.location.address && (
                <p className="text-xs text-gray-400 mb-3">{car.location.address}</p>
            )}
            <div className="h-50 sm:h-60 rounded-xl overflow-hidden border border-gray-200">
                <GoogleMap
                    lat={car.location.lat}
                    lng={car.location.lng}
                    city={car.location.city}
                    country={car.location.country}
                />
            </div>
        </div>
    )
}
