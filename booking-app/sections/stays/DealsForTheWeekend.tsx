"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Deal {
    image: string;
    name: string;
    location: string;
    score: number;
    scoreLabel: string;
    reviewCount: number;
    badge?: "genius" | null;
    dealTag?: string;
    originalPrice: number;
    discountedPrice: number;
    nights: number;
}

const DEALS: Deal[] = [
    { image: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", name: "Old Baku Hotel", location: "Baku, Azerbaijan", score: 7.5, scoreLabel: "Good", reviewCount: 25, badge: "genius", originalPrice: 85, discountedPrice: 74, nights: 2 },
    { image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", name: "Azcot Hotel - Nizami Street", location: "Baku, Azerbaijan", score: 7.5, scoreLabel: "Good", reviewCount: 191, badge: null, dealTag: "Early 2026 Deal", originalPrice: 59, discountedPrice: 50, nights: 2 },
    { image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", name: "Carpe Diem by Sahil", location: "Baku, Azerbaijan", score: 7.4, scoreLabel: "Good", reviewCount: 8, badge: "genius", dealTag: "Early 2026 Deal", originalPrice: 65, discountedPrice: 48, nights: 2 },
    { image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", name: "Dastan Boutique Hotel Baku", location: "Baku, Azerbaijan", score: 9.5, scoreLabel: "Exceptional", reviewCount: 82, badge: "genius", dealTag: "Limited-time Deal", originalPrice: 256, discountedPrice: 128, nights: 2 },
    { image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", name: "Park Inn by Radisson", location: "Baku, Azerbaijan", score: 8.1, scoreLabel: "Very Good", reviewCount: 340, badge: "genius", dealTag: "Early 2026 Deal", originalPrice: 120, discountedPrice: 98, nights: 2 },
    { image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80", name: "Boulevard Hotel Baku", location: "Baku, Azerbaijan", score: 8.8, scoreLabel: "Excellent", reviewCount: 512, badge: null, dealTag: "Limited-time Deal", originalPrice: 180, discountedPrice: 145, nights: 2 },
];

const CARD_WIDTH = 272;
const VISIBLE = 4;

function DealCard({ deal }: { deal: Deal }) {
    const t = useTranslations("stays");
    const SCORE_LABELS: Record<string, string> = {
        "Good": t("scoreGood"),
        "Very Good": t("scoreVeryGood"),
        "Excellent": t("scoreExcellent"),
        "Exceptional": t("scoreExceptional"),
        "Very poor": t("scoreVeryPoor"),
    };

    const DEAL_TAGS: Record<string, string> = {
        "Early 2026 Deal": t("tagEarly2026"),
        "Limited-time Deal": t("tagLimited"),
    };

    const scoreColor =
        deal.score >= 9 ? "bg-blue-800" :
        deal.score >= 8 ? "bg-blue-700" :
        deal.score >= 7 ? "bg-blue-600" : "bg-gray-400";

    const dealTagColor = deal.dealTag === "Limited-time Deal" ? "bg-green-600" : "bg-green-500";

    const city = deal.location.split(",")[0].trim();

    return (
        <Link href={`/filter?city=${encodeURIComponent(city)}`} className="shrink-0 w-64 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg transition-shadow duration-300 cursor-pointer group flex flex-col">
            <div className="relative h-52 shrink-0 overflow-hidden">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-3 flex flex-col flex-1">
                <div className="h-5 mb-1.5 flex items-center">
                    {deal.badge === "genius" && (
                        <span className="inline-flex items-center bg-blue-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            {t("genius")}
                        </span>
                    )}
                </div>
                <div className="h-9 mb-1 overflow-hidden">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{deal.name}</h3>
                </div>
                <div className="h-4 mb-2 flex items-center">
                    <p className="text-xs text-gray-500 truncate">{deal.location}</p>
                </div>
                <div className="h-9 mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold ${scoreColor}`}>
                            {deal.score}
                        </span>
                        <div className="leading-tight">
                            <p className="text-xs font-semibold text-gray-800">{SCORE_LABELS[deal.scoreLabel] ?? deal.scoreLabel}</p>
                            <p className="text-[10px] text-gray-400">{t("reviews", { count: deal.reviewCount })}</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        {deal.dealTag && (
                            <span className={`text-[10px] text-white font-semibold px-2 py-0.5 rounded ${dealTagColor}`}>
                                {DEAL_TAGS[deal.dealTag] ?? deal.dealTag}
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-auto pt-2 border-t border-gray-100 text-right">
                    <p className="text-xs text-gray-400">
                        {t("nights", { count: deal.nights })}{" "}
                        <span className="line-through">US${deal.originalPrice}</span>
                    </p>
                    <p className="text-base font-bold text-gray-900">US${deal.discountedPrice}</p>
                </div>
            </div>
        </Link>
    );
}

export default function DealsForWeekend({ dateRange = "6 March - 8 March" }: { dateRange?: string }) {
    const t = useTranslations("stays");
    const [index, setIndex] = useState(0);
    const maxIndex = DEALS.length - VISIBLE;
    const prev = () => setIndex((i) => Math.max(i - 1, 0));
    const next = () => setIndex((i) => Math.min(i + 1, maxIndex));

    return (
        <section className="py-10 px-6 max-w-6xl mx-auto font-sans">
            <div className="mb-6 -mt-5">
                <h2 className="text-2xl font-bold text-gray-900">{t("dealsWeekend")}</h2>
                <p className="text-sm text-gray-500 mt-1">{t("dealsSave", { dateRange })}</p>
            </div>
            <div className="relative">
                <button onClick={prev} disabled={index === 0} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div className="overflow-hidden">
                    <div className="flex gap-4 items-stretch transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${index * CARD_WIDTH}px)` }}>
                        {DEALS.map((deal, i) => <DealCard key={i} deal={deal} />)}
                    </div>
                </div>
                <button onClick={next} disabled={index >= maxIndex} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-700"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </section>
    );
}
