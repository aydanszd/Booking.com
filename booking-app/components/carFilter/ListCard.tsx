'use client'

import { useState } from 'react'
import { Users, Settings2, Gauge, MapPin, CheckCircle2, ChevronRight, Star, Car } from 'lucide-react'
import type { CarType } from '@/types/car'
import { scoreLabel } from './constants'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ListCard({ car, onNavigate }: { car: CarType; onNavigate: (id: string) => void }) {
    const [imgError, setImgError] = useState(false)
    const imgSrc = car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${BASE}${car.images[0]}`) : null

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden min-h-[200px] sm:h-52">
            <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0 h-52 sm:h-full cursor-pointer" onClick={() => onNavigate(car._id!)}>
                {imgSrc && !imgError ? (
                    <img src={imgSrc} alt={car.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full min-h-[120px] flex items-center justify-center bg-gray-50">
                        <Car className="w-12 h-12 text-gray-200" />
                    </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {car.isAvailable ? 'Mövcud' : 'İcarədə'}
                </span>
            </div>

            <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 justify-between min-w-0">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 onClick={() => onNavigate(car._id!)} className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer leading-tight">
                            {car.title}
                        </h3>
                        <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                            {car.category}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{car.brand} {car.model}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-600"><Users className="w-3.5 h-3.5 text-gray-400" />{car.seats} koltuk</span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-600"><Settings2 className="w-3.5 h-3.5 text-gray-400" />{car.transmission === 'automatic' ? 'Otomatik' : 'Manuel'}</span>
                        {car.mileage > 0 && <span className="flex items-center gap-1.5 text-sm text-gray-600"><Gauge className="w-3.5 h-3.5 text-gray-400" />{car.mileage.toLocaleString()} km</span>}
                        {car.features?.slice(0, 1).map((f, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600"><CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />{f}</span>
                        ))}
                    </div>
                    {car.location && (
                        <div className="mt-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="text-xs font-semibold text-blue-500">{car.location.city}</span>
                            <span className="text-xs text-gray-400">· {car.location.country}</span>
                        </div>
                    )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0 sm:min-w-[120px]">
                    {car.rating !== undefined && (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:block text-right">
                                <p className="text-xs font-semibold text-gray-700">{scoreLabel(car.rating)}</p>
                            </div>
                            <div className="flex items-center gap-1 sm:hidden">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-gray-700">{car.rating.toFixed(1)}</span>
                            </div>
                            <div className="bg-[#003580] text-white text-xs font-bold px-2 py-1 rounded-lg rounded-tr-none min-w-[2rem] text-center">
                                {car.rating.toFixed(1)}
                            </div>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Günlük</p>
                        <p className="text-xl font-black text-gray-900">US${car.pricePerDay}</p>
                    </div>
                    <button
                        onClick={() => car.isAvailable && onNavigate(car._id!)}
                        disabled={!car.isAvailable}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${car.isAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {car.isAvailable ? <>Görüntüle <ChevronRight size={12} /></> : 'Müsait değil'}
                    </button>
                </div>
            </div>
        </div>
    )
}
