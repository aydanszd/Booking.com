"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10" style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>
            <div className="border-t border-gray-200 mb-8" />
            <h2 className="text-xl font-bold text-gray-900 mb-1">Explore more destinations</h2>
            <p className="text-sm text-gray-500 mb-6">Find things to do in cities around the world</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {destinations.map(dest => (
                    <div
                        key={dest._id}
                        onClick={() => router.push(`/destinations/${dest._id}`)}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        style={{ height: 240 }}
                    >
                        <img
                            src={imgSrc(dest.images[0])}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                        <div className="absolute bottom-3 left-4 right-4">
                            <p className="text-white font-bold text-sm leading-tight">{dest.name}</p>
                            {dest.country && <p className="text-white/75 text-xs mt-0.5">{dest.country}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
