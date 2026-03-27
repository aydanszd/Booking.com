"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface Destination {
    image: string;
    city: string;
    flag: string;
    large?: boolean;
}

interface Category {
    labelKey: string;
    destinations: Destination[];
}

const CATEGORIES: Category[] = [
    {
        labelKey: "catPopular",
        destinations: [
            { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80", city: "Tbilisi City", flag: "🇬🇪", large: true },
            { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", city: "Baku", flag: "🇦🇿", large: true },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Rome", flag: "🇮🇹" },
            { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", city: "Istanbul", flag: "🇹🇷" },
            { image: "https://q-xx.bstatic.com/xdata/images/city/500x600/691618.jpg?k=6e6bce1099b3b8297c14cbe6e4cf33d1a797ca3cdc9c4a3efce00a862d15a9d8&o=", city: "Batumi", flag: "🇬🇪" },
            { image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&q=80", city: "Tashkent", flag: "🇺🇿" },
        ],
    },
    {
        labelKey: "catExploreAz",
        destinations: [
            { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", city: "Baku", flag: "🇦🇿", large: true },
            { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80", city: "Sheki", flag: "🇦🇿", large: true },
            { image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&q=80", city: "Ganja", flag: "🇦🇿" },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Quba", flag: "🇦🇿" },
            { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", city: "Lankaran", flag: "🇦🇿" },
            { image: "https://images.unsplash.com/photo-1529960570902-e9b6cda696db?w=600&q=80", city: "Gabala", flag: "🇦🇿" },
        ],
    },
    {
        labelKey: "catCulinary",
        destinations: [
            { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80", city: "Bologna", flag: "🇮🇹", large: true },
            { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", city: "Lyon", flag: "🇫🇷", large: true },
            { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", city: "Tokyo", flag: "🇯🇵" },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Barcelona", flag: "🇪🇸" },
            { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", city: "Istanbul", flag: "🇹🇷" },
            { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", city: "Marrakech", flag: "🇲🇦" },
        ],
    },
    {
        labelKey: "catRomantic",
        destinations: [
            { image: "https://images.unsplash.com/photo-1499678329028-101435549a4e?w=800&q=80", city: "Paris", flag: "🇫🇷", large: true },
            { image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80", city: "Venice", flag: "🇮🇹", large: true },
            { image: "https://images.unsplash.com/photo-1529960570902-e9b6cda696db?w=600&q=80", city: "Santorini", flag: "🇬🇷" },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Prague", flag: "🇨🇿" },
            { image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&q=80", city: "Vienna", flag: "🇦🇹" },
            { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", city: "Budapest", flag: "🇭🇺" },
        ],
    },
    {
        labelKey: "catCityBreaks",
        destinations: [
            { image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80", city: "London", flag: "🇬🇧", large: true },
            { image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", city: "Paris", flag: "🇫🇷", large: true },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Rome", flag: "🇮🇹" },
            { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", city: "Amsterdam", flag: "🇳🇱" },
            { image: "https://images.unsplash.com/photo-1529960570902-e9b6cda696db?w=600&q=80", city: "Berlin", flag: "🇩🇪" },
            { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", city: "Madrid", flag: "🇪🇸" },
        ],
    },
    {
        labelKey: "catWineDine",
        destinations: [
            { image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", city: "Bordeaux", flag: "🇫🇷", large: true },
            { image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80", city: "Tuscany", flag: "🇮🇹", large: true },
            { image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80", city: "Porto", flag: "🇵🇹" },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Mendoza", flag: "🇦🇷" },
            { image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=80", city: "Cape Town", flag: "🇿🇦" },
            { image: "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=600&q=80", city: "Yerevan", flag: "🇦🇲" },
        ],
    },
    {
        labelKey: "catAdventure",
        destinations: [
            { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", city: "Interlaken", flag: "🇨🇭", large: true },
            { image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", city: "Queenstown", flag: "🇳🇿", large: true },
            { image: "https://images.unsplash.com/photo-1529960570902-e9b6cda696db?w=600&q=80", city: "Batumi", flag: "🇬🇪" },
            { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", city: "Tbilisi", flag: "🇬🇪" },
            { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", city: "Almaty", flag: "🇰🇿" },
            { image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80", city: "Dolomites", flag: "🇮🇹" },
        ],
    },
];

const TABS_VISIBLE = 6;

export default function TripsSimilarSection({ baseCity = "Baku" }: { baseCity?: string }) {
    const t = useTranslations("stays");
    const [activeTab, setActiveTab] = useState(0);
    const [showAllTabs, setShowAllTabs] = useState(false);

    const visibleTabs = showAllTabs ? CATEGORIES : CATEGORIES.slice(0, TABS_VISIBLE);
    const currentDestinations = CATEGORIES[activeTab].destinations;

    const largeCards = currentDestinations.filter((d) => d.large);
    const smallCards = currentDestinations.filter((d) => !d.large);

    return (
        <section className="py-10 px-6 max-w-6xl mx-auto font-sans -mt-10">
            <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900">
                    {t("tripsSimilar", { city: baseCity })}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{t("tripsSubtitle")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-6">
                {visibleTabs.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(i)}
                        className={`px-4 py-3 rounded-full text-sm border transition-colors duration-200 ${activeTab === i
                                ? "border-blue-600 text-blue-600 font-medium bg-blue-50"
                                : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white"
                            }`}
                    >
                        {t(cat.labelKey as any)}
                    </button>
                ))}
                {!showAllTabs && (
                    <button
                        onClick={() => setShowAllTabs(true)}
                        className="px-4 py-1.5 rounded-full text-sm border border-gray-300 text-gray-700 hover:border-gray-400 bg-white flex items-center gap-1 transition-colors duration-200"
                    >
                        {t("more")}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                    {largeCards.map((dest, i) => (
                        <DestCard key={i} dest={dest} tall />
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-3">
                    {smallCards.map((dest, i) => (
                        <DestCard key={i} dest={dest} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function DestCard({ dest, tall = false }: { dest: Destination; tall?: boolean }) {
    return (
        <div className={`relative overflow-hidden rounded-xl cursor-pointer group ${tall ? "h-68" : "h-68"}`}>
            <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold text-base drop-shadow">
                    {dest.city} {dest.flag}
                </p>
            </div>
        </div>
    );
}
