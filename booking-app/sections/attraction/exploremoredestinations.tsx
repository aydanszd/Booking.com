"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { destinationApi } from "@/api/destination";
import { imgSrc } from "@/utils/imageUrl";
import type { Destination } from "@/types/destination";

export default function ExploreMoreDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const router = useRouter();

    useEffect(() => {
        destinationApi.getAll()
            .then(res => setDestinations(res.data.destinations))
            .catch(() => {});
    }, []);

    if (destinations.length === 0) return null;

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10" style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>
            <div className="border-t border-gray-200 mb-8" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">Explore more destinations</h2>
            <p className="text-sm text-gray-500 mb-6">Find things to do in cities around the world</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {destinations.map(dest => (
                    <div
                        key={dest._id}
                        onClick={() => router.push(`/destinations/${dest._id}`)}
                        className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all bg-white"
                    >
                        {/* Image */}
                        <div className="relative h-36 sm:h-44 overflow-hidden">
                            <img src={imgSrc(dest.images[0])} alt={dest.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
    );
}
