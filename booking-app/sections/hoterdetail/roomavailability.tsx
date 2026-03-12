"use client";

import { useState } from "react";
import {
    Calendar,
    Users,
    Wifi,
    Wind,
    Tv,
    Maximize2,
    Eye,
    Coffee,
    Tag,
    CreditCard,
    Ban,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    Info,
} from "lucide-react";
interface Room {
    id: number;
    name: string;
    guests: number;
    bedOptions: string[];
    size: number;
    amenities: string[];
    extraAmenities: string[];
    price: number;
    features: Feature[];
    urgency?: string;
    view?: string;
}

interface Feature {
    icon: "breakfast" | "wifi" | "cancel" | "prepay" | "nocard" | "genius";
    label: string;
    highlight?: boolean;
}
const rooms: Room[] = [
    {
        id: 1,
        name: "Çift Kişilik Oda",
        guests: 2,
        bedOptions: ["1 çift kişilik yatak", "2 tek kişilik yatak"],
        size: 25,
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: [
            "Duş", "Tuvalet", "Havlular", "Nevresim", "Priz yatağa yakın",
            "Çalışma Masası", "TV", "Terlik", "Buzdolabı", "Telefon",
            "Isıtma", "Saç Kurutma Makinesi", "Halı Kaplı Zemin",
            "Elektrikli Su Isıtıcısı", "Gardırop veya dolap",
            "Üst katlara asansörle erişilebilmektedir", "Kıyafet askılığı", "Tuvalet kağıdı",
        ],
        price: 86,
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
    {
        id: 2,
        name: "Deluxe Çift Kişilik veya İki Yataklı Oda - Şehir Manzaralı",
        guests: 2,
        bedOptions: ["1 çift kişilik yatak", "2 tek kişilik yatak"],
        size: 25,
        view: "Şehir manzarası",
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: ["Duş", "Tuvalet", "Havlular", "Çalışma Masası", "TV", "Buzdolabı"],
        price: 100,
        urgency: "Bizde 1 tane kaldı",
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
    {
        id: 3,
        name: "Çift Kişilik veya İki Yataklı Oda - Deniz Manzaralı",
        guests: 2,
        bedOptions: ["1 çift kişilik yatak", "2 tek kişilik yatak"],
        size: 25,
        view: "Deniz manzarası",
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: ["Duş", "Tuvalet", "Havlular", "Çalışma Masası"],
        price: 109,
        urgency: "Bizde 1 tane kaldı",
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
    {
        id: 4,
        name: "Standart Üç Kişilik Oda",
        guests: 3,
        bedOptions: ["3 tek kişilik yatak"],
        size: 30,
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: ["Duş", "Tuvalet", "Havlular", "Buzdolabı"],
        price: 129,
        urgency: "Bizde 2 tane kaldı",
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
    {
        id: 5,
        name: "Büyük Tek Kişilik Oda",
        guests: 1,
        bedOptions: ["1 tek kişilik yatak"],
        size: 25,
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: ["Duş", "Tuvalet", "Havlular"],
        price: 62,
        urgency: "Bizde 2 tane kaldı",
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
    {
        id: 6,
        name: "Tek Kişilik Oda",
        guests: 1,
        bedOptions: ["1 tek kişilik yatak"],
        size: 25,
        amenities: ["Klima", "Düz Ekran TV", "Ücretsiz WiFi"],
        extraAmenities: ["Duş", "Tuvalet", "Havlular"],
        price: 71,
        urgency: "Bizde 1 tane kaldı",
        features: [
            { icon: "breakfast", label: "İyi bir kahvaltı", highlight: true },
            { icon: "wifi", label: "Dahil: yüksek hızlı internet", highlight: true },
            { icon: "cancel", label: "%50 oranında iptal ücreti" },
            { icon: "prepay", label: "Ön ödemeye gerek yok: tesise ödeyin" },
            { icon: "nocard", label: "Kredi kartına gerek yok" },
            { icon: "genius", label: "Genius indirimi olabilir" },
        ],
    },
];
function FeatureIcon({ type }: { type: Feature["icon"] }) {
    const cls = "w-4 h-4 flex-shrink-0";
    if (type === "breakfast") return <Coffee className={`${cls} text-gray-500`} />;
    if (type === "wifi") return <Wifi className={`${cls} text-[#008009]`} />;
    if (type === "cancel") return <Ban className={`${cls} text-gray-500`} />;
    if (type === "prepay") return <CheckCircle2 className={`${cls} text-[#008009]`} />;
    if (type === "nocard") return <CreditCard className={`${cls} text-[#008009]`} />;
    if (type === "genius") return <Tag className={`${cls} text-[#006ce4]`} />;
    return null;
}
function GuestIcons({ count }: { count: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: count }).map((_, i) => (
                <Users key={i} size={14} className="text-gray-600" />
            ))}
        </div>
    );
}
function RoomRow({ room }: { room: Room }) {
    const [expanded, setExpanded] = useState(false);
    const [selectedBed, setSelectedBed] = useState(0);
    const [qty, setQty] = useState(0);

    return (
        <tr className="border-t border-gray-200 align-top">            <td className="py-5 px-4 w-[38%]">
                <a href="#" className="text-[#006ce4] font-semibold text-sm hover:underline">
                    {room.name}
                </a>
                <div className="mt-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1.5">
                        Yatak tercihinizi yapın (müsaitliğe bağlı)
                    </p>
                    <div className="space-y-1">
                        {room.bedOptions.map((bed, i) => (
                            <label key={i} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name={`bed-${room.id}`}
                                    checked={selectedBed === i}
                                    onChange={() => setSelectedBed(i)}
                                    className="accent-[#006ce4]"
                                />
                                <span className="text-sm text-gray-700">{bed}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="flex items-center gap-1 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-600">
                        <Maximize2 size={11} /> {room.size} m²
                    </span>
                    {room.view && (
                        <span className="flex items-center gap-1 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-600">
                            <Eye size={11} /> {room.view}
                        </span>
                    )}
                    {room.amenities.map((a) => (
                        <span key={a} className="flex items-center gap-1 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-600">
                            {a === "Klima" && <Wind size={11} />}
                            {a === "Düz Ekran TV" && <Tv size={11} />}
                            {a === "Ücretsiz WiFi" && <Wifi size={11} />}
                            {a}
                        </span>
                    ))}
                </div>
                {expanded && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-2">
                        {room.extraAmenities.map((a) => (
                            <span key={a} className="text-xs text-gray-600 flex items-center gap-1">
                                <CheckCircle2 size={11} className="text-[#008009]" /> {a}
                            </span>
                        ))}
                    </div>
                )}

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[#006ce4] text-xs flex items-center gap-0.5 hover:underline"
                >
                    {expanded ? (
                        <><ChevronUp size={13} /> Gizle</>
                    ) : (
                        <><ChevronDown size={13} /> Devamı</>
                    )}
                </button>
            </td>
            <td className="py-5 px-3 text-center w-[8%]">
                <GuestIcons count={room.guests} />
            </td>
            <td className="py-5 px-3 w-[14%]">
                <p className="text-xl font-bold text-gray-900">US${room.price}</p>
                <p className="text-xs text-gray-500 mt-0.5">Vergi ve ücretler dahil</p>
            </td>
            <td className="py-5 px-3 w-[28%]">
                <div className="space-y-1.5">
                    {room.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <FeatureIcon type={f.icon} />
                            <span
                                className={`text-xs ${f.highlight ? "text-[#008009] font-medium" : "text-gray-600"
                                    } ${f.icon === "genius" ? "text-[#006ce4]" : ""}`}
                            >
                                {f.label}
                                {f.icon === "breakfast" && (
                                    <span className="text-[#008009] font-medium"> dahil</span>
                                )}
                            </span>
                        </div>
                    ))}
                    {room.urgency && (
                        <p className="text-xs text-gray-700 flex items-center gap-1 mt-1">
                            <span className="text-gray-400">•</span> {room.urgency}
                        </p>
                    )}
                </div>
            </td>
            <td className="py-5 px-3 w-[12%]">
                <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#006ce4]"
                >
                    {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>{n}</option>
                    ))}
                </select>
            </td>
        </tr>
    );
}
export default function RoomAvailability() {
    return (
        <div className=" min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Yer Durumu</h2>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                            Fiyatlar USD birimine dönüştürüldü
                            <Info size={13} className="text-gray-400" />
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#006ce4] text-sm font-medium cursor-pointer hover:underline">
                        <Tag size={14} />
                        Fiyat Eşitlemesi Yapıyoruz
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2 mb-6">
                    <div className="flex items-center gap-2 border-2 border-[#f0a500] rounded-lg px-4 py-2.5 bg-white flex-1">
                        <Calendar size={16} className="text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700">13 Mar, Cum – 15 Mar, Paz</span>
                    </div>
                    <div className="flex items-center gap-2 border-2 border-[#f0a500] rounded-lg px-4 py-2.5 bg-white flex-1">
                        <Users size={16} className="text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700">2 yetişkin · 0 çocuk · 1 oda</span>
                    </div>
                    <button className="bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap">
                        Aramayı değiştir
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[#1a3c6e] text-white text-sm">
                                <th className="text-left px-4 py-3 font-semibold">Oda tipi</th>
                                <th className="text-left px-3 py-3 font-semibold">Konuk sayısı</th>
                                <th className="text-left px-3 py-3 font-semibold bg-[#1a5276]">
                                    <div className="flex items-center gap-1">
                                        2 gecelik fiyat
                                        <span className="block w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white ml-1" />
                                    </div>
                                </th>
                                <th className="text-left px-3 py-3 font-semibold">Seçimleriniz</th>
                                <th className="text-left px-3 py-3 font-semibold">Oda seç</th>
                                <th className="px-3 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <RoomRow key={room.id} room={room} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Reservation CTA */}
                <div className="mt-4 flex justify-end">
                    <div className="flex flex-col items-end gap-1">
                        <button className="bg-[#006ce4] hover:bg-[#0055b3] text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-sm">
                            Rezervasyon yapacağım
                        </button>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <AlertCircle size={12} /> Henüz sizden ücret alınmayacak
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}