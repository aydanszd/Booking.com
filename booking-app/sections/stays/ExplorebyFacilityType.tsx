"use client";

import { useRef, useState } from "react";

interface PropertyType {
    image: string;
    type: string;
    dates: string;
    available: number;
}

const PROPERTY_TYPES: PropertyType[] = [
    {
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        type: "Guest Houses",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 75,
    },
    {
        image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
        type: "Hostels",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 27,
    },
    {
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
        type: "B&Bs",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 38,
    },
    {
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        type: "Homestays",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 14,
    },
    {
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
        type: "Hotels",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 120,
    },
    {
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
        type: "Apartments",
        dates: "28 Feb–1 Mar, 2 adults",
        available: 54,
    },
];

const CARD_WIDTH = 272; 
const VISIBLE = 4;

export default function BrowseByPropertyType({ city = "Milan" }: { city?: string }) {
    const [index, setIndex] = useState(0);
    const maxIndex = PROPERTY_TYPES.length - VISIBLE;

    const prev = () => setIndex((i) => Math.max(i - 1, 0));
    const next = () => setIndex((i) => Math.min(i + 1, maxIndex));

    return (
        <section className="py-10 px-6 max-w-6xl mx-auto font-sans -mt-10 ">
            {/* Header */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Browse by property type in {city}
            </h2>

            {/* Slider wrapper */}
            <div className="relative">
                {/* Left arrow */}
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    aria-label="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="overflow-hidden ">
                    <div
                        className="flex gap-4 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${index * CARD_WIDTH}px)` }}
                    >
                        {PROPERTY_TYPES.map((prop, i) => (
                            <div
                                key={i}
                                className="shrink-0 w-64 cursor-pointer group"
                                onClick={() => console.log("Navigate to:", prop.type)}
                            >
                                {/* Image */}
                                <div className="w-full h-54 rounded-xl overflow-hidden mb-3">
                                    <img
                                        src={prop.image}
                                        alt={prop.type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Info */}
                                <p className="font-semibold text-gray-900 text-[16px]">{prop.type}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{prop.dates}</p>
                                <p className="text-sm text-gray-500">{prop.available} available</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right arrow */}
                <button
                    onClick={next}
                    disabled={index >= maxIndex}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    aria-label="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}