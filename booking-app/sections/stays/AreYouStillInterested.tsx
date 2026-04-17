"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

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
    const t = useTranslations("stays");
    const SCORE_LABELS: Record<string, string> = {
        "Very poor": t("scoreVeryPoor"),
        "Good": t("scoreGood"),
        "Very Good": t("scoreVeryGood"),
        "Excellent": t("scoreExcellent"),
        "Exceptional": t("scoreExceptional"),
    };

    return (
        <div className="relative max-w-6xl w-72 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
            <div className="relative h-55 w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
                    {name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{location}</p>
                <div className="flex items-center gap-2">
                    <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${score >= 7
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
                            {SCORE_LABELS[reviewLabel] ?? reviewLabel}
                        </span>
                        <span className="text-xs text-gray-400">{t("reviews", { count: reviewCount })}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SAMPLE_PROPERTIES: PropertyCardProps[] = [
    {
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        name: "Apartment On Mc Donalds",
        location: "Baku, Azerbaijan",
        score: 0,
        reviewLabel: "Very poor",
        reviewCount: 0,
    },
    {
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        name: "City View Studio",
        location: "Baku, Azerbaijan",
        score: 8,
        reviewLabel: "Very Good",
        reviewCount: 24,
    },
    {
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        name: "Central Park Apartment",
        location: "Baku, Azerbaijan",
        score: 7,
        reviewLabel: "Good",
        reviewCount: 12,
    },
];

export default function StillInterestedSection() {
    const t = useTranslations("stays");
    const [index, setIndex] = useState(0);
    const maxIndex = SAMPLE_PROPERTIES.length - 1;

    const slide = (dir: number) => {
        setIndex(prev => Math.max(0, Math.min(prev + dir, maxIndex)));
    };

    return (
        <section className="py-8 sm:py-10 px-4 sm:px-6 max-w-7xl mx-auto sm:-translate-x-30 font-sans">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t("stillInterested")}
            </h2>

            {/* Mobile: slider with prev/next */}
            <div className="sm:hidden">
                <div className="overflow-hidden">
                    <div
                        className="flex gap-5 transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${index * (288 + 20)}px)` }}
                    >
                        {SAMPLE_PROPERTIES.map((prop, i) => (
                            <div key={i} className="shrink-0">
                                <PropertyCard {...prop} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                        onClick={() => slide(-1)}
                        disabled={index === 0}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} className="text-gray-700" />
                    </button>
                    <span className="text-sm text-gray-500">{index + 1} / {SAMPLE_PROPERTIES.length}</span>
                    <button
                        onClick={() => slide(1)}
                        disabled={index >= maxIndex}
                        className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} className="text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Desktop: original wrap layout */}
            <div className="hidden sm:flex gap-5 flex-wrap">
                {SAMPLE_PROPERTIES.map((prop, i) => (
                    <PropertyCard key={i} {...prop} />
                ))}
            </div>
        </section>
    );
}
