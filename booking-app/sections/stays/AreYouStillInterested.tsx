"use client";
import { useState } from "react";

interface PropertyCardProps {
    image: string;
    name: string;
    location: string;
    score: number;
    reviewLabel: string;
    reviewCount: number;
}

function PropertyCard({
    image,
    name,
    location,
    score,
    reviewLabel,
    reviewCount,
}: PropertyCardProps) {
    const [saved, setSaved] = useState(false);

    return (
        <div className="relative w-full sm:w-72 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
            <div className="relative h-55 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSaved((prev) => !prev);
                    }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={saved ? "#e00b27" : "none"}
                        stroke={saved ? "#e00b27" : "#6b7280"}
                        strokeWidth={2}
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
                    {name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{location}</p>
                <div className="flex items-center gap-2">
                    <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                            score >= 7
                                ? "bg-blue-700"
                                : score >= 5
                                ? "bg-orange-400"
                                : "bg-gray-400"
                        }`}
                    >
                        {score}
                    </span>
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold text-gray-800">
                            {reviewLabel}
                        </span>
                        <span className="text-xs text-gray-400">{reviewCount} reviews</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SAMPLE_PROPERTIES: PropertyCardProps[] = [
    {
        image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        name: "Apartment On Mc Donalds",
        location: "Baku, Azerbaijan",
        score: 0,
        reviewLabel: "Very poor",
        reviewCount: 0,
    },
    {
        image:
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        name: "City View Studio",
        location: "Baku, Azerbaijan",
        score: 8,
        reviewLabel: "Very good",
        reviewCount: 24,
    },
    {
        image:
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        name: "Central Park Apartment",
        location: "Baku, Azerbaijan",
        score: 7,
        reviewLabel: "Good",
        reviewCount: 12,
    },
];

export default function StillInterestedSection() {
    return (
        <section className="py-10 px-6 max-w-7xl md:ml-90 font-sans">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Still interested?
            </h2>
            <div className="flex flex-col sm:flex-row gap-5 flex-wrap">
                {SAMPLE_PROPERTIES.map((prop, i) => (
                    <PropertyCard key={i} {...prop} />
                ))}
            </div>
        </section>
    );
}