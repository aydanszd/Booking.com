'use client'

import { useState } from 'react'
import { Users, Settings2, MapPin, ChevronRight, Star, Car } from 'lucide-react'
import type { CarType } from '@/types/car'
import { scoreLabel } from './constants'

const BASE = 'http://localhost:5000'

export default function GridCard({ car, onNavigate }: { car: CarType; onNavigate: (id: string) => void }) {
    const [imgError, setImgError] = useState(false)
    const imgSrc = car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${BASE}${car.images[0]}`) : null

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
            <div className="relative h-44 flex-shrink-0 cursor-pointer" onClick={() => onNavigate(car._id!)}>
                {imgSrc && !imgError ? (
                    <img src={imgSrc} alt={car.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Car className="w-10 h-10 text-gray-200" />
                    </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {car.isAvailable ? 'Mövcud' : 'İcarədə'}
                </span>
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
                    {car.category}
                </span>
            </div>

            <div className="flex-1 flex flex-col p-3 gap-1.5">
                {car.rating !== undefined && (
                    <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{car.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">· {scoreLabel(car.rating)}</span>
                    </div>
                )}
                <h3 onClick={() => onNavigate(car._id!)} className="text-[#006ce4] font-bold text-sm hover:underline cursor-pointer leading-snug line-clamp-2">
                    {car.title}
                </h3>
                <p className="text-[10px] text-gray-400">{car.brand} {car.model}</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-600"><Users className="w-3 h-3 text-gray-400" />{car.seats} koltuk</span>
                    <span className="flex items-center gap-1 text-xs text-gray-600"><Settings2 className="w-3 h-3 text-gray-400" />{car.transmission === 'automatic' ? 'Oto.' : 'Man.'}</span>
                </div>
                {car.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{car.location.city}, {car.location.country}</span>
                    </p>
                )}
                <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[10px] text-gray-400">Günlük</p>
                        <p className="text-base font-black text-gray-900">US${car.pricePerDay}</p>
                    </div>
                    <button
                        onClick={() => car.isAvailable && onNavigate(car._id!)}
                        disabled={!car.isAvailable}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 ${car.isAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {car.isAvailable ? <>Gör <ChevronRight size={11} /></> : 'N/A'}
                    </button>
                </div>
            </div>
        </div>
    )
}
