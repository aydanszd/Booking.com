"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, ChevronRight, Leaf, Info, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Building } from "@/types/buildingFilter";
import { capitalize, scoreLabel } from "@/lib/buildings/utils";
import { imgUrl } from "@/lib/buildings/api";
import { ScoreBadge } from "./ScoreBadge";

interface Props {
    building: Building;
}

export function ListCard({ building }: Props) {
    const searchParams = useSearchParams();
    const [saved, setSaved] = useState(false);

    const imageUrl = building.images?.[0]
        ? imgUrl(building.images[0])
        : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&q=80";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden min-h-[200px] sm:h-52">
            {/* Image */}
            <div className="relative w-full sm:w-48 md:w-56 shrink-0 h-52 sm:h-full">
                <img src={imageUrl} alt={building.title} className="w-full h-full object-cover" />
                <button
                    type="button"
                    onClick={() => setSaved(!saved)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow"
                >
                    <Heart
                        size={16}
                        fill={saved ? "#cc0000" : "none"}
                        className={saved ? "text-red-500" : "text-gray-600"}
                    />
                </button>
                {!building.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Unavailable
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="min-w-0 flex-1">
                        <Link href={`/hoteldetail/${building._id}?${searchParams.toString()}`} className="block">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer leading-tight">
                                    {building.title}
                                </h3>
                                <span className="bg-amber-100 border border-amber-300 text-amber-700 text-xs px-1.5 py-0.5 rounded font-medium">
                                    {capitalize(building.type)}
                                </span>
                                {building.brand && (
                                    <span className="text-xs text-gray-400 font-medium">{building.brand}</span>
                                )}
                            </div>
                        </Link>

                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[#006ce4] text-xs flex items-center gap-0.5">
                                <MapPin size={11} /> {building.location.city}, {building.location.country}
                            </span>
                            {building.location.address && (
                                <>
                                    <span className="text-gray-400 text-xs">·</span>
                                    <span className="text-gray-500 text-xs">{building.location.address}</span>
                                </>
                            )}
                        </div>

                        {building.sustainability && (
                            <div className="flex items-center gap-1 mt-1">
                                <Leaf size={12} className="text-[#008009]" />
                                <span className="text-xs text-[#008009]">Sustainability certified</span>
                            </div>
                        )}

                        {building.rooms && (
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {building.rooms.bedrooms} Bedroom{building.rooms.bedrooms !== 1 ? "s" : ""} ·{" "}
                                {building.rooms.bathrooms} Bathroom{building.rooms.bathrooms !== 1 ? "s" : ""}
                                {building.maxGuests && (
                                    <span className="text-gray-400 font-normal"> · max {building.maxGuests} guests</span>
                                )}
                            </p>
                        )}

                        {building.amenities && building.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {building.amenities.slice(0, 4).map(a => (
                                    <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        {a}
                                    </span>
                                ))}
                                {building.amenities.length > 4 && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                        +{building.amenities.length - 4} more
                                    </span>
                                )}
                            </div>
                        )}

                        {building.travelGroups && building.travelGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {building.travelGroups.map(g => (
                                    <span
                                        key={g}
                                        className="text-[10px] bg-blue-50 text-[#006ce4] px-2 py-0.5 rounded-full border border-blue-100"
                                    >
                                        {capitalize(g)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: score + price */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <div className="flex items-center gap-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">{scoreLabel(building.rating)}</p>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs text-gray-500">{building.rating}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 sm:hidden">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-gray-700">{building.rating}</span>
                                <span className="text-xs text-gray-400">· {scoreLabel(building.rating)}</span>
                            </div>
                            <ScoreBadge value={building.rating} />
                        </div>

                        <div className="text-right">
                            {building.minNights && building.minNights > 1 && (
                                <p className="text-xs text-gray-400">min {building.minNights} nights</p>
                            )}
                            <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                ${building.pricePerNight}
                                <Info size={13} className="text-gray-400" />
                            </p>
                            <p className="text-xs text-gray-500">per night</p>
                            <Link
                                href={
                                    building.isAvailable
                                        ? `/hoteldetail/${building._id}?${searchParams.toString()}`
                                        : "#"
                                }
                                className={`mt-2 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap ${building.isAvailable
                                        ? "bg-[#006ce4] hover:bg-[#0055b3] text-white"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {building.isAvailable ? (
                                    <>Check availability <ChevronRight size={13} /></>
                                ) : (
                                    "Not available"
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}