"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS = [
    {
        title: "Baku Gobustan and Absheron Tour+Free Haydar Aliyev Center Ticket",
        image: "https://plus.unsplash.com/premium_photo-1772390760078-c337d4f62a0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzMHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Baku Sumgait City Pink Lake and Green Bazar Visit",
        image: "https://images.unsplash.com/photo-1772090049995-6116febe0d60?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0NXx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        title: "Gabala & Samakhi Tour/ All Entrance Fees Included Tour",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80",
    },
    {
        title: "Baku: Gobustan, Mud Volcano, Fire Temple & Burning Mountain",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80",
    },
    {
        title: "Full Day Sightseeing Tour of the main Attractions around Baku",
        image: "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=400&q=80",
    },
    {
        title: "Baku: Gobustan, Absheron Sights Guided Day Trip Lunch included",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    },
];

const CARD_WIDTH = 290;
const GAP = 16;
const VISIBLE = 4;

export default function RecommendedSection() {
    const [index, setIndex] = useState(0);
    const maxIndex = CARDS.length - VISIBLE;

    const prev = () => setIndex(i => Math.max(0, i - 1));
    const next = () => setIndex(i => Math.min(maxIndex, i + 1));

    return (
        <section className="max-w-6xl mt-10 mx-auto px-6 py-10" style={{ fontFamily: "'BlinkMacSystemFont', 'Segoe UI', sans-serif" }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "inherit" }}>Recommended in Chernyy Gorod</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Our pick of top Chernyy Gorod experiences to get you started</p>
                </div>
                <button className="shrink-0 border border-[#0071c2] text-[#0071c2] text-sm font-medium px-4 py-2 rounded hover:bg-blue-50 transition-colors">
                    See all recommended
                </button>
            </div>

            {/* Carousel */}
            <div className="relative group/carousel">
                {/* Left arrow — visible only on carousel hover */}
                <button
                    onClick={prev}
                    disabled={index === 0}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-all duration-200
                        opacity-0 group-hover/carousel:opacity-100
                        disabled:opacity-0 disabled:pointer-events-none"
                >
                    <ChevronLeft size={18} className="text-gray-700" />
                </button>

                {/* Cards viewport */}
                <div className="overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out"
                        style={{
                            gap: GAP,
                            transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
                        }}
                    >
                        {CARDS.map((card, i) => (
                            <div
                                key={i}
                                className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer group/card"
                                style={{ width: CARD_WIDTH, height: 320 }}
                            >
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-bold leading-snug">
                                    {card.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right arrow — visible only on carousel hover */}
                <button
                    onClick={next}
                    disabled={index >= maxIndex}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-all duration-200
                        opacity-0 group-hover/carousel:opacity-100
                        disabled:opacity-0 disabled:pointer-events-none"
                >
                    <ChevronRight size={18} className="text-gray-700" />
                </button>
            </div>
        </section>
    );
}