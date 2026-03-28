import { Users, Disc, Fuel, Check, MapPin, Star, Car } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { imgSrc } from '@/utils/carDetailUtils'
import type { CarType } from '@/types/car'

interface Props {
    car: CarType
    days: number
    pickUp: string
    dropOff: string
    detailParams: string
}

export default function CarListCard({ car, days, pickUp, dropOff, detailParams }: Props) {
    const t = useTranslations('cars')
    const totalPrice = car.pricePerDay * days

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row group">
            {/* Image */}
            <div className="sm:w-56 h-44 sm:h-auto relative shrink-0 overflow-hidden">
                {car.images?.[0] ? (
                    <img
                        src={imgSrc(car.images[0])}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={car.title}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Car size={40} className="text-gray-300" />
                    </div>
                )}
                <div className="absolute top-3 left-3 bg-[#006ce4] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
                    {car.category}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">{car.title}</h2>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{car.brand} · {car.model}</p>
                        {car.location?.city && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                <MapPin size={11} /> {car.location.city}
                            </div>
                        )}
                    </div>
                    {(car.rating ?? 0) > 0 && (
                        <div className="flex items-center gap-1 bg-[#006ce4] text-white text-xs font-black px-2.5 py-1 rounded-xl">
                            <Star size={11} fill="white" /> {car.rating}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users size={13} className="text-gray-400" /> {t('seats', { count: car.seats })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Disc size={13} className="text-gray-400" /> {car.transmission}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Fuel size={13} className="text-gray-400" /> {t('fuelPolicy')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Check size={13} className="text-green-500" /> {t('freeCancellation')}
                    </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <div>
                        <p className="text-xs text-gray-400">${car.pricePerDay} {t('perDay')}</p>
                        <p className="text-2xl font-black text-gray-900">
                            ${pickUp && dropOff ? totalPrice : car.pricePerDay}
                        </p>
                        {pickUp && dropOff && (
                            <p className="text-[10px] text-gray-400">{t('forDays', { count: days })}</p>
                        )}
                    </div>
                    <Link
                        href={`/cardetail/${car._id}?${detailParams}`}
                        className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-100 text-sm"
                    >
                        {t('viewDetails')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
