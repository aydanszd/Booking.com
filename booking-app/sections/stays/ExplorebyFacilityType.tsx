"use client";

import { useState, useEffect, useRef } from "react";

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

const GAP = 16;
const DESKTOP_CARD_WIDTH = 272;
const DESKTOP_VISIBLE = 4;

export default function BrowseByPropertyType({ city = "Milan" }: { city?: string }) {
    const [index, setIndex] = useState(0);
    const [cardWidth, setCardWidth] = useState(DESKTOP_CARD_WIDTH);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);
            if (mobile && containerRef.current) {
                setCardWidth(containerRef.current.offsetWidth);
            } else {
                setCardWidth(DESKTOP_CARD_WIDTH);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const maxIndex = isMobile
        ? PROPERTY_TYPES.length - 1
        : PROPERTY_TYPES.length - DESKTOP_VISIBLE;

    const prev = () => setIndex((i) => Math.max(i - 1, 0));
    const next = () => setIndex((i) => Math.min(i + 1, maxIndex));

    return (
        <section className="py-10 px-4 sm:px-6 max-w-6xl mx-auto font-sans -mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Browse by property type in {city}
            </h2>

            <div className="relative">
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute -left-3 sm:-left-5 top-[45%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    aria-label="Previous"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="overflow-hidden" ref={containerRef}>
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            gap: `${GAP}px`,
                            transform: `translateX(-${index * (cardWidth + GAP)}px)`,
                        }}
                    >
                        {PROPERTY_TYPES.map((prop, i) => (
                            <div
                                key={i}
                                className="shrink-0 cursor-pointer group"
                                style={{ width: `${cardWidth}px` }}
                                onClick={() => console.log("Navigate to:", prop.type)}
                            >
                                <div className="w-full h-48 sm:h-54 rounded-xl overflow-hidden mb-3">
                                    <img
                                        src={prop.image}
                                        alt={prop.type}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <p className="font-semibold text-gray-900 text-[15px] sm:text-[16px]">{prop.type}</p>
                                <p className="text-sm text-gray-500 mt-0.5">{prop.dates}</p>
                                <p className="text-sm text-gray-500">{prop.available} available</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={next}
                    disabled={index >= maxIndex}
                    className="absolute -right-3 sm:-right-5 top-[45%] -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    aria-label="Next"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
}