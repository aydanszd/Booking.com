"use client";
import { useState } from "react";
import {
    Heart,
    MapPin,
    ArrowUpDown,
    X,
    LayoutList,
    LayoutGrid,
    ChevronRight,
    Leaf,
    Info,
} from "lucide-react";

interface Hotel {
    id: number;
    name: string;
    stars: number;
    badge?: string;
    district: string;
    area: string;
    distance: string;
    note?: string;
    tag?: string;
    tagColor?: string;
    roomType: string;
    roomDetail: string;
    roomPerk?: string;
    payNote?: string;
    urgency?: string;
    freeCancel?: boolean;
    scoreLabel: string;
    scoreValue: number;
    reviewCount: number;
    locationScore?: number;
    originalPrice?: number;
    price: number;
    nights: number;
    guests: number;
    sustainability?: boolean;
    image: string;
}

const hotels: Hotel[] = [
    {
        id: 1,
        name: "Crowne Plaza Istanbul - Ortakoy Bosphorus by IHG",
        stars: 5,
        badge: "preferred",
        district: "Beşiktaş",
        area: "İstanbul (Avrupa Yakası)",
        distance: "6,3 km",
        sustainability: true,
        tag: "Sınırlı Süreli Fırsat",
        tagColor: "bg-[#008009]",
        roomType: "Standart Queen Oda",
        roomDetail: "1 büyük çift kişilik yatak",
        payNote: "Ön ödemeye gerek yok - Tesise ödeyin",
        urgency: "Bizde bu fiyattan 6 tane kaldı",
        scoreLabel: "Müthiş",
        scoreValue: 8.8,
        reviewCount: 1134,
        locationScore: 9.3,
        originalPrice: 360,
        price: 252,
        nights: 2,
        guests: 2,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&q=80",
    },
    {
        id: 2,
        name: "Peak Star Hotel",
        stars: 2,
        badge: "plus",
        district: "Beyoğlu",
        area: "İstanbul (Taksim)",
        distance: "3,6 km",
        note: "Metroya yakın",
        roomType: "Deluxe Oda - 2 Çift Kişilik Yataklı",
        roomDetail: "1 ekstra büyük çift kişilik yatak",
        roomPerk: "Kahvaltı dahil",
        scoreLabel: "İyi",
        scoreValue: 7.0,
        reviewCount: 819,
        price: 99,
        nights: 2,
        guests: 2,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&q=80",
    },
    {
        id: 3,
        name: "Antea Hotel Oldcity -Special Category",
        stars: 2,
        badge: "plus",
        district: "Fatih",
        area: "İstanbul (Sultanahmet)",
        distance: "150 m",
        tag: "Sınırlı Süreli Fırsat",
        tagColor: "bg-[#008009]",
        roomType: "Standart Çift Kişilik veya İki Yataklı Oda",
        roomDetail: "Yataklar: 1 çift kişilik veya 2 tek kişilik",
        freeCancel: true,
        scoreLabel: "İyi",
        scoreValue: 7.9,
        reviewCount: 1322,
        locationScore: 9.5,
        originalPrice: 545,
        price: 136,
        nights: 2,
        guests: 2,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80",
    },
];
const popularFilters = [
    { label: "Kahvaltı dahil", count: 1577 },
    { label: "Taksim", count: 616 },
    { label: "Sultanahmet", count: 959 },
    { label: "Avrupa Yakası", count: 2271 },
    { label: "Anadolu Yakası", count: 251 },
    { label: "Şişli", count: 220 },
    { label: "Daireler", count: 356 },
    { label: "Oteller", count: 2601, checked: true },
];

const ratingFilters = [
    { label: "Fevkalade: 9+", count: 530 },
    { label: "Çok iyi: 8+", count: 1680 },
    { label: "İyi: 7+", count: 2220 },
    { label: "Keyifli: 6+", count: 2400 },
];

function Stars({ count }: { count: number }) {
    return (
        <span className="text-amber-400 text-xs">
            {"★".repeat(count)}
        </span>
    );
}
function ScoreBadge({ value }: { value: number }) {
    const bg = value >= 9 ? "bg-[#003580]" : value >= 8 ? "bg-[#1a5276]" : "bg-[#1a6b3c]";
    return (
        <div className={`${bg} text-white text-sm font-bold px-2 py-1 rounded-lg rounded-tr-none min-w-[2.5rem] text-center`}>
            {value.toFixed(1).replace(".", ",")}
        </div>
    );
}
function HotelCard({ hotel }: { hotel: Hotel }) {
    const [saved, setSaved] = useState(false);

    return (
        <div className="bg-white  rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex overflow-hidden">            <div className="relative w-56 flex-shrink-0">
                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                <button
                    onClick={() => setSaved(!saved)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow"
                >
                    <Heart size={16} fill={saved ? "#cc0000" : "none"} className={saved ? "text-red-500" : "text-gray-600"} />
                </button>
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer leading-tight">
                                {hotel.name}
                            </h3>
                            <Stars count={hotel.stars} />
                            {hotel.badge === "preferred" && (
                                <span className="bg-amber-100 border border-amber-300 text-amber-700 text-xs px-1.5 py-0.5 rounded font-medium">⭐</span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <a href="#" className="text-[#006ce4] text-xs hover:underline flex items-center gap-0.5">
                                <MapPin size={11} /> {hotel.district}, {hotel.area}
                            </a>
                            <span className="text-gray-400 text-xs">·</span>
                            <a href="#" className="text-[#006ce4] text-xs hover:underline">Haritada göster</a>
                            <span className="text-gray-500 text-xs">Merkez: {hotel.distance}</span>
                        </div>

                        {hotel.note && (
                            <p className="text-xs text-gray-500 mt-0.5">{hotel.note}</p>
                        )}
                        {hotel.sustainability && (
                            <div className="flex items-center gap-1 mt-1">
                                <Leaf size={12} className="text-[#008009]" />
                                <span className="text-xs text-[#008009]">Sürdürülebilirlik sertifikası</span>
                            </div>
                        )}

                        {hotel.tag && (
                            <span className={`inline-block mt-2 ${hotel.tagColor} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
                                {hotel.tag}
                            </span>
                        )}

                        <div className="mt-2 text-sm">
                            <p className="font-semibold text-gray-800">{hotel.roomType}</p>
                            <p className="text-gray-500 text-xs">{hotel.roomDetail}</p>
                            {hotel.roomPerk && (
                                <p className="text-[#008009] text-xs font-medium mt-0.5">{hotel.roomPerk}</p>
                            )}
                            {hotel.payNote && (
                                <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                                    <span className="text-[#008009]">✓</span> {hotel.payNote}
                                </p>
                            )}
                            {hotel.freeCancel && (
                                <p className="text-[#008009] text-xs font-medium mt-0.5">✓ Ücretsiz iptal</p>
                            )}
                            {hotel.urgency && (
                                <p className="text-red-600 text-xs font-medium mt-1">{hotel.urgency}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">{hotel.scoreLabel}</p>
                                    <p className="text-xs text-gray-500">{hotel.reviewCount.toLocaleString()} değerlendirme</p>
                                    {hotel.locationScore && (
                                        <p className="text-xs text-[#006ce4] font-medium">Konum {hotel.locationScore.toFixed(1).replace(".", ",")}</p>
                                    )}
                                </div>
                                <ScoreBadge value={hotel.scoreValue} />
                            </div>
                        </div>
                        <div className="text-right mt-auto">
                            <p className="text-xs text-gray-500">{hotel.nights} gece, {hotel.guests} yetişkin</p>
                            {hotel.originalPrice && (
                                <p className="text-xs text-gray-400 line-through">US${hotel.originalPrice}</p>
                            )}
                            <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                US${hotel.price}
                                <Info size={13} className="text-gray-400" />
                            </p>
                            <p className="text-xs text-gray-500">Vergi ve ücretler dahil</p>
                            <button className="mt-2 bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap">
                                Yer durumuna bak <ChevronRight size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function CheckRow({ label, count, defaultChecked = false }: { label: string; count: number; defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="accent-[#006ce4] w-3.5 h-3.5"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#006ce4]">{label}</span>
            </div>
            <span className="text-xs text-gray-400">{count.toLocaleString()}</span>
        </label>
    );
}

const allBrands = [
    { label: "Ramada by Wyndham", count: 17 },
    { label: "Hampton by Hilton", count: 9 },
    { label: "Crowne Plaza Hotels & Resorts", count: 8 },
    { label: "Doubletree by Hilton", count: 8 },
    { label: "Mövenpick", count: 8 },
    { label: "Hilton Hotels & Resorts", count: 6 },
    { label: "Radisson Blu", count: 6 },
    { label: "Elite World Hotels & Resorts", count: 6 },
    { label: "Mercure", count: 5 },
    { label: "ibis", count: 5 },
];

function BrandsFilter() {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? allBrands : allBrands.slice(0, 10);
    return (
        <div>
            <div className="space-y-2">
                {visible.map((f) => (
                    <CheckRow key={f.label} label={f.label} count={f.count} />
                ))}
            </div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-[#006ce4] text-xs font-medium flex items-center gap-1 hover:underline"
            >
                {expanded ? "Daha az göster ∧" : "20 filtrenin tümünü göster ∨"}
            </button>
        </div>
    );
}
function CounterRow() {
    const [count, setCount] = useState(0);
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setCount(Math.max(0, count - 1))}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
            >
                −
            </button>
            <span className="text-sm text-gray-700 w-4 text-center">{count}</span>
            <button
                onClick={() => setCount(count + 1)}
                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
            >
                +
            </button>
        </div>
    );
}
export default function SearchResults() {
    const [activeFilter, setActiveFilter] = useState("Oteller");
    return (
        <div className=" min-h-screen mt-14">
            <div className="max-w-6xl mx-auto px-4 py-6">                <div className="flex items-center gap-1.5 text-xs text-[#006ce4] mb-4 flex-wrap">
                    {["Anasayfa", "Türkiye", "Marmara Bölgesi", "İstanbul"].map((crumb, i, arr) => (
                        <span key={crumb} className="flex items-center gap-1.5">
                            <a href="#" className="hover:underline">{crumb}</a>
                            {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-400" />}
                        </span>
                    ))}
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="text-gray-500">Arama sonuçları</span>
                </div>
                <div className="flex gap-6">
                    <aside className="w-56 flex-shrink-0">
                        <div className="rounded-xl overflow-hidden mb-4 h-36 relative border border-gray-200 shadow-sm">
                            <iframe
                                title="istanbul-map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96058!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3dcc8b330b!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2str!4v1620000000000"
                            />
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                <button className="bg-white border border-gray-300 shadow text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:shadow-md transition-shadow whitespace-nowrap">
                                    <MapPin size={12} className="text-[#006ce4]" /> Haritada göster
                                </button>
                            </div>
                        </div>
                        <p className="text-sm font-bold text-gray-800 mb-3">Filtre seçin:</p>
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Önceki filtreleriniz</p>
                            <div className="space-y-2">
                                <CheckRow label="Daireler" count={356} />
                                <CheckRow label="Oteller" count={2601} defaultChecked />
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Bütçeniz (gecelik)</p>
                            <p className="text-xs text-gray-500 mb-2">US$15 – US$200+</p>
                            <div className="relative h-8">
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full">
                                    <div className="absolute left-[10%] right-[5%] h-full bg-[#006ce4] rounded-full" />
                                </div>
                                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#006ce4] border-2 border-white shadow cursor-pointer" />
                                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#006ce4] border-2 border-white shadow cursor-pointer" />
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Popüler filtreler</p>
                            <div className="space-y-2">
                                {popularFilters.map((f) => (
                                    <CheckRow key={f.label} label={f.label} count={f.count} defaultChecked={f.checked} />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 border-b border-gray-100 pb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Ortalama puanı</p>
                            <div className="space-y-2">
                                {ratingFilters.map((f) => (
                                    <CheckRow key={f.label} label={f.label} count={f.count} />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 border-b border-gray-100 pb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Tesis tipi</p>
                            <div className="space-y-2">
                                {[
                                    { label: "Oteller", count: 2601, checked: true },
                                    { label: "Ev ve dairelerin tamamı", count: 375 },
                                    { label: "Daireler", count: 356 },
                                    { label: "Hosteller", count: 42 },
                                    { label: "Oda ve Kahvaltılar", count: 33 },
                                    { label: "Pansiyonlar", count: 22 },
                                    { label: "Konukevleri", count: 14 },
                                    { label: "Tekneler", count: 12 },
                                    { label: "Villalar", count: 9 },
                                    { label: "Kapsül Oteller (Japon Stili)", count: 7 },
                                    { label: "Tatil Evleri", count: 5 },
                                    { label: "Yetişkin Otelleri", count: 2 },
                                    { label: "Moteller", count: 1 },
                                    { label: "Tatil parkları", count: 1 },
                                ].map((f) => (
                                    <CheckRow key={f.label} label={f.label} count={f.count} defaultChecked={f.checked} />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 border-b border-gray-100 pb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-3">Yatak odaları ve banyolar</p>
                            <div className="space-y-3">
                                {[
                                    { label: "Yatak odaları" },
                                    { label: "Banyolar" },
                                ].map(({ label }) => (
                                    <div key={label}>
                                        <p className="text-xs text-gray-600 mb-1.5">{label}</p>
                                        <CounterRow />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4 border-b border-gray-100 pb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-0.5">Yüksek puanlı özellikler</p>
                            <p className="text-xs text-gray-400 mb-2">Konuk değerlendirmelerine göre</p>
                            <div className="space-y-2">
                                <CheckRow label="Çok iyi kahvaltı" count={576} />
                            </div>
                        </div>
                        <div className="mb-4 border-b border-gray-100 pb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Seyahat grubu</p>
                            <div className="space-y-2">
                                <CheckRow label="Evcil hayvan girebilir" count={391} />
                                <CheckRow label="Sadece yetişkinlere özel" count={73} />
                                <CheckRow label="Travel Proud (LGBTQ+ dostu)" count={34} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Markalar</p>
                            <BrandsFilter />
                        </div>
                    </aside>
                    <main className="flex-1 min-w-0">                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h1 className="text-xl font-bold text-gray-900">
                                İstanbul: <span className="font-normal">2.601 tesis bulundu</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <button className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-1.5">
                                    <LayoutList size={13} /> Liste
                                </button>
                                <button className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-1.5">
                                    <LayoutGrid size={13} /> Tablo
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <button className="border border-gray-300 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-1.5">
                                <ArrowUpDown size={12} /> Sırala: Popüler seçimlerimiz
                            </button>
                            <div className="flex items-center gap-1.5 bg-white border border-[#006ce4] rounded-full px-3 py-1.5">
                                <span className="text-xs font-medium text-gray-700">Oteller</span>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <X size={13} />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {hotels.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}