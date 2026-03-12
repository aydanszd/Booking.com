"use client";
import { useState } from "react";
import { Plus, ChevronRight } from "lucide-react";
const categories = [
    { label: "Çalışanlar", score: 9.4 },
    { label: "Olanaklar", score: 8.9 },
    { label: "Temizlik", score: 9.0 },
    { label: "Rahatlık", score: 9.1 },
    { label: "Fiyat/fayda dengesi", score: 9.2 },
    { label: "Konum", score: 9.2 },
    { label: "Ücretsiz WiFi", score: 8.2 },
];
const topics = ["Oda", "Konum", "Kahvaltı", "Manzara", "Temiz"];
const reviews = [
    {
        name: "Kübra",
        country: "ABD",
        flag: "🇺🇸",
        text: '"Vulgar ve İlkay beye çok teşekkür ediyorum. İlk andan itibaren çok yardımcı oldular. Odalar geniş, temiz, sıcak ve konforluydu. İçeri Şehere yürüyerek ulaşım sağladık çok keyif aldık. Ayrıca deniz mall da çok yakındı. Kahvaltı yeterliydi. Teras..."',
    },
    {
        name: "Tekelioğlu",
        country: "Türkiye",
        flag: "🇹🇷",
        text: '"Şehir merkezine uzaklığı, nazik personel, temizliği"',
    },
    {
        name: "Mustafa",
        country: "Türkiye",
        flag: "🇹🇷",
        text: '"Temiz, Güleryüz luler, yataklar daha iyi olabilirdi, aile olarak kaldık, tavsiye ederim"',
    },
];

function ScoreBar({ score }: { score: number }) {
    const pct = (score / 10) * 100;
    return (
        <div className="h-1.5 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
            <div
                className="h-full bg-[#1a3c6e] rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

function Avatar({ name }: { name: string }) {
    const colors = [
        "bg-[#1a7a4a]", "bg-[#1a3c6e]", "bg-[#7a1a1a]",
        "bg-[#7a5a1a]", "bg-[#1a5a7a]",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return (
        <div className={`w-9 h-9 rounded-full ${colors[idx]} text-white font-bold text-sm flex items-center justify-center flex-shrink-0`}>
            {name[0].toUpperCase()}
        </div>
    );
}

export default function KonukDegerlendirmeleri() {
    const [activeTopics, setActiveTopics] = useState<string[]>([]);

    const toggleTopic = (t: string) => {
        setActiveTopics((prev) =>
            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
        );
    };

    return (
        <div className=" min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Konuk değerlendirmeleri</h2>
                    <button className="bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors whitespace-nowrap">
                        Yer durumuna bak
                    </button>
                </div>

                {/* Overall score */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#1a3c6e] text-white text-xl font-bold w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                        9,1
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-gray-900">Fevkalade</span>
                        <span className="text-gray-400">·</span>
                        <span className="text-gray-500 text-sm">1.597 değerlendirme</span>
                        <a href="#" className="text-[#006ce4] text-sm hover:underline">
                            Tüm değerlendirmeleri oku
                        </a>
                    </div>
                </div>

                {/* Category scores */}
                <div className="mb-8">
                    <p className="text-sm font-bold text-gray-900 mb-4">Kategoriler:</p>
                    <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                        {categories.map((cat) => (
                            <div key={cat.label}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">{cat.label}</span>
                                    <span className="text-sm font-bold text-gray-900">{cat.score.toFixed(1).replace(".", ",")}</span>
                                </div>
                                <ScoreBar score={cat.score} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Topic filters */}
                <div className="mb-8">
                    <p className="text-sm font-bold text-gray-900 mb-3">Değerlendirme konularını seçin:</p>
                    <div className="flex flex-wrap gap-2">
                        {topics.map((t) => {
                            const active = activeTopics.includes(t);
                            return (
                                <button
                                    key={t}
                                    onClick={() => toggleTopic(t)}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${active
                                            ? "bg-[#1a3c6e] border-[#1a3c6e] text-white"
                                            : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                                        }`}
                                >
                                    <Plus size={14} className={active ? "rotate-45 transition-transform" : "transition-transform"} />
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Reviews */}
                <div className="mb-6">
                    <p className="text-sm font-bold text-gray-900 mb-4">Konukların en çok neleri sevdiğine göz atın:</p>
                    <div className="relative">
                        <div className="grid grid-cols-3 gap-4">
                            {reviews.map((r) => (
                                <div key={r.name} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar name={r.name} />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{r.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <span>{r.flag}</span> {r.country}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed flex-1">{r.text}</p>
                                    <a href="#" className="text-[#006ce4] text-sm hover:underline font-medium">
                                        Daha fazla bilgi
                                    </a>
                                </div>
                            ))}
                        </div>

                        {/* Next arrow */}
                        <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-md rounded-full p-2 hover:shadow-lg transition-shadow">
                            <ChevronRight size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <button className="border border-[#006ce4] text-[#006ce4] hover:bg-[#f0f7ff] font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                    Tüm değerlendirmeleri oku
                </button>
            </div>
        </div>
    );
}