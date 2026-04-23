"use client";
import { MapPin, ChevronRight, Leaf, Star } from "lucide-react";
import { Building } from "@/types/buildingFilter";
import { capitalize, scoreLabel } from "@/utils/buildingUtils";
import { imgSrc } from "@/utils/imageUrl";
import { useCurrency } from "@/context/CurrencyContext";
interface Props {
    building: Building;
}

export function GridCard({ building }: Props) {
    const { format } = useCurrency();
    const imageUrl = building.images?.[0]
        ? imgSrc(building.images[0])
        : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&q=80";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
            <div className="relative h-44 shrink-0">
                <img src={imageUrl} alt={building.title} className="w-full h-full object-cover" />
<span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {capitalize(building.type)}
                </span>
                {!building.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Unavailable
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col p-3 gap-1.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{building.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">· {scoreLabel(building.rating)}</span>
                    </div>
                    {building.sustainability && <Leaf size={12} className="text-[#008009]" />}
                </div>

                <h3 className="text-[#006ce4] font-bold text-sm hover:underline cursor-pointer leading-snug line-clamp-2">
                    {building.title}
                </h3>

                <div className="space-y-0.5">
                    {building.brand && (
                        <p className="text-[10px] text-gray-400 font-medium">{building.brand}</p>
                    )}
                    <p className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin size={10} className="text-gray-400 shrink-0" />
                        <span className="truncate">
                            {building.location.city}, {building.location.country}
                        </span>
                    </p>
                </div>

                {building.rooms && (
                    <p className="text-xs text-gray-600">
                        {building.rooms.bedrooms} bed · {building.rooms.bathrooms} bath
                        {building.maxGuests ? ` · ${building.maxGuests} guests` : ""}
                    </p>
                )}

                {building.amenities && building.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {building.amenities.slice(0, 3).map(a => (
                            <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                                {a}
                            </span>
                        ))}
                        {building.amenities.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                                +{building.amenities.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {building.travelGroups && building.travelGroups.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {building.travelGroups.map(g => (
                            <span
                                key={g}
                                className="text-[10px] bg-blue-50 text-[#006ce4] px-1.5 py-0.5 rounded-full border border-blue-100"
                            >
                                {capitalize(g)}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div>
                        {building.minNights && building.minNights > 1 && (
                            <p className="text-[10px] text-gray-400">min {building.minNights} nights</p>
                        )}
                        <p className="text-base font-bold text-gray-900 leading-none">{format(building.pricePerNight)}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">per night</p>
                    </div>
                    <button
                        type="button"
                        disabled={!building.isAvailable}
                        className={`font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${building.isAvailable
                                ? "bg-[#006ce4] hover:bg-[#0055b3] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {building.isAvailable ? (
                            <>Book <ChevronRight size={12} /></>
                        ) : (
                            "N/A"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}