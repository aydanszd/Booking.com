'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { destinationApi } from '@/api/destination'
import { ArrowRight } from 'lucide-react'
import { imgSrc } from '@/utils/imageUrl'
import type { Destination } from '@/types/destination'

export default function ExploreDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([])
    const router = useRouter()

    useEffect(() => {
        destinationApi.getAll()
            .then(res => setDestinations(res.data.destinations))
            .catch(() => {})
    }, [])

    if (destinations.length === 0) return null

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Explore more destinations</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {destinations.map(dest => (
                    <div
                        key={dest._id}
                        onClick={() => router.push(`/destinations/${dest._id}`)}
                        className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white"
                    >
                        {/* Images grid */}
                        <div className="relative h-36 sm:h-44 overflow-hidden">
                            {dest.images.filter(Boolean).length >= 2 ? (
                                <div className="grid grid-cols-2 h-full gap-0.5">
                                    <img src={imgSrc(dest.images[0])} alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    <div className="flex flex-col gap-0.5 h-full">
                                        <img src={imgSrc(dest.images[1])} alt=""
                                            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${dest.images[2] ? 'h-1/2' : 'h-full'} w-full`} />
                                        {dest.images[2] && (
                                            <img src={imgSrc(dest.images[2])} alt=""
                                                className="h-1/2 w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <img src={imgSrc(dest.images[0])} alt={dest.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="p-3 sm:p-4">
                            <p className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{dest.name}</p>
                            {dest.country && <p className="text-xs text-gray-400 mt-0.5">{dest.country}</p>}
                            {dest.description && (
                                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{dest.description}</p>
                            )}
                            <div className="flex items-center gap-1 mt-2 text-[#006ce4] text-xs font-semibold">
                                Explore <ArrowRight size={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
