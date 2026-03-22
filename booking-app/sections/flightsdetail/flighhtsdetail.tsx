"use client";
import React, { useState } from "react";
interface FlightLeg {
    departure: string;
    arrival: string;
    originFull: string;
    destinationFull: string;
    originCode: string;
    destinationCode: string;
    type: "direct" | "1-stop" | "2-stop";
    duration: string;
    airline: "ajet" | "azal" | "pegasus";
    flightNo: string;
    operatedBy?: string;
    aircraft: string;
    meal: string;
    date: string;
}

interface FlightOption {
    id: number;
    outbound: FlightLeg;
    inbound: FlightLeg;
    pricePerPerson: number;
    totalPrice: number;
    cabin: string;
    tags?: ("best" | "cheapest")[];
    offerCount?: number;
}
const flights: FlightOption[] = [
    {
        id: 1,
        outbound: {
            departure: "04:55", arrival: "07:10",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 15dk.", airline: "ajet",
            flightNo: "Ajet 180", operatedBy: "Turkish Airlines tarafından düzenlenmektedir",
            aircraft: "Airbus A321neo", meal: "Hafif yemek (ücretli)", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "12:45", arrival: "16:35",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "ajet",
            flightNo: "Ajet 177", aircraft: "Boeing 737-800 (winglets)",
            meal: "Hafif yemek (ücretli)", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 202, totalPrice: 404, cabin: "Ekonomi Kabini",
        tags: ["best", "cheapest"], offerCount: 7,
    },
    {
        id: 2,
        outbound: {
            departure: "07:20", arrival: "09:20",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 00dk.", airline: "azal",
            flightNo: "AZAL 711", aircraft: "Boeing 787-8",
            meal: "Standart yemek", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "12:45", arrival: "16:35",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "ajet",
            flightNo: "Ajet 177", aircraft: "Boeing 737-800 (winglets)",
            meal: "Hafif yemek (ücretli)", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 209, totalPrice: 418, cabin: "Ekonomi Kabini", offerCount: 5,
    },
    {
        id: 3,
        outbound: {
            departure: "07:20", arrival: "09:20",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 00dk.", airline: "azal",
            flightNo: "AZAL 711", aircraft: "Boeing 787-8",
            meal: "Standart yemek", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "16:45", arrival: "20:35",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "azal",
            flightNo: "AZAL 712", aircraft: "Airbus A320",
            meal: "Standart yemek", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 221, totalPrice: 442, cabin: "Ekonomi Kabini", offerCount: 3,
    },
    {
        id: 4,
        outbound: {
            departure: "04:55", arrival: "07:10",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 15dk.", airline: "ajet",
            flightNo: "Ajet 180", aircraft: "Airbus A321neo",
            meal: "Hafif yemek (ücretli)", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "23:50", arrival: "03:40",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "ajet",
            flightNo: "Ajet 199", aircraft: "Airbus A321neo",
            meal: "Hafif yemek (ücretli)", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 213, totalPrice: 425, cabin: "Ekonomi Kabini", offerCount: 4,
    },
    {
        id: 5,
        outbound: {
            departure: "04:10", arrival: "06:15",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 05dk.", airline: "pegasus",
            flightNo: "PC 504", aircraft: "Boeing 737 MAX 8",
            meal: "Yemek yok", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "12:45", arrival: "16:35",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "ajet",
            flightNo: "Ajet 177", aircraft: "Boeing 737-800 (winglets)",
            meal: "Hafif yemek (ücretli)", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 215, totalPrice: 430, cabin: "Light + Ekonomi Kabini", offerCount: 6,
    },
    {
        id: 6,
        outbound: {
            departure: "17:25", arrival: "19:40",
            originFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            destinationFull: "İstanbul Sabiha Gökçen",
            originCode: "GYD", destinationCode: "SAW",
            type: "direct", duration: "3sa. 15dk.", airline: "ajet",
            flightNo: "Ajet 184", aircraft: "Airbus A321neo",
            meal: "Hafif yemek (ücretli)", date: "Kalkış • 5 Nis, Paz",
        },
        inbound: {
            departure: "12:45", arrival: "16:35",
            originFull: "İstanbul Sabiha Gökçen",
            destinationFull: "Bakü Haydar Aliyev Uluslararası Havaalanı",
            originCode: "SAW", destinationCode: "GYD",
            type: "direct", duration: "2sa. 50dk.", airline: "ajet",
            flightNo: "Ajet 177", aircraft: "Boeing 737-800 (winglets)",
            meal: "Hafif yemek (ücretli)", date: "Dönüş • 10 Nis, Cum",
        },
        pricePerPerson: 236, totalPrice: 471, cabin: "Ekonomi Kabini", offerCount: 2,
    },
];
const airlineConfig: Record<
    FlightLeg["airline"],
    { src: string; alt: string; name: string }
> = {
    ajet: {
        src: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/VF.png?crop=false&width=108&height=92&fallback=default1.png&_v=bdb2e8763a28ce6898ee916a85744573",
        alt: "AJet", name: "Ajet",
    },
    azal: {
        src: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/J2.png?crop=false&width=108&height=92&fallback=default2.png&_v=ad1e5aed5b54e20c971b1539f3eb63a8",
        alt: "Azerbaijan Airlines", name: "Azerbaijan Airlines",
    },
    pegasus: {
        src: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/PC.png?crop=false&width=108&height=92&fallback=default1.png&_v=657d2a160b6b1641fa27d94fdc5d451c",
        alt: "Pegasus Airlines", name: "Pegasus Airlines",
    },
};
function AirlineLogo({
    airline,
    size = "md",
}: {
    airline: FlightLeg["airline"];
    size?: "sm" | "md" | "lg";
}) {
    const logo = airlineConfig[airline];
    const sz = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-14 h-14" : "w-10 h-10";
    const pad = size === "lg" ? "p-2" : "p-1";
    return (
        <div
            className={`${sz} rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${pad}`}
        >
            <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain"
                onError={(e) => {
                    e.currentTarget.style.display = "none";
                }}
            />
        </div>
    );
}
function LegRow({ leg }: { leg: FlightLeg }) {
    return (
        <div className="flex items-center gap-3 py-1">
            <AirlineLogo airline={leg.airline} />
            <div className="min-w-0 flex-1">
                <span className="font-semibold text-gray-900 text-sm tabular-nums">
                    {leg.departure} – {leg.arrival}
                </span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                    {leg.originCode} — {leg.destinationCode}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs text-gray-500">
                <span className="hidden sm:inline font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    direkt
                </span>
                <span className="tabular-nums whitespace-nowrap">{leg.duration}</span>
            </div>
        </div>
    );
}
function LegDetail({ leg }: { leg: FlightLeg }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-sm font-semibold text-gray-800">{leg.date}</span>
                <span className="text-sm text-gray-400 tabular-nums">{leg.duration}</span>
            </div>
            <div className="px-4 py-4">                <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AirlineLogo airline={leg.airline} size="lg" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">
                                {airlineConfig[leg.airline].name}
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs font-medium text-gray-600">{leg.flightNo}</span>
                        </div>
                        {leg.operatedBy && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{leg.operatedBy}</p>
                        )}
                    </div>
                    <span className="shrink-0 text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap font-medium shadow-sm">
                        {leg.aircraft}
                    </span>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mt-1" />
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mb-1" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between" style={{ minHeight: 140 }}>
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">
                                {leg.departure}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {leg.originFull}{" "}
                                <span className="text-gray-400">({leg.originCode})</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">
                                {leg.arrival}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {leg.destinationFull}{" "}
                                <span className="text-gray-400">({leg.destinationCode})</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start shrink-0">
                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 whitespace-nowrap">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {leg.meal}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
type SortKey = "best" | "cheapest" | "shortest";

function SortTabs({
    active,
    onChange,
}: {
    active: SortKey;
    onChange: (k: SortKey) => void;
}) {
    const tabs: { key: SortKey; label: string; sub: string }[] = [
        { key: "cheapest", label: "En ucuz", sub: "$202" },
        { key: "best", label: "En iyi", sub: "$202" },
        { key: "shortest", label: "En kısa", sub: "$230" },
    ];
    return (
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl overflow-hidden">
            {tabs.map((t) => (
                <button
                    key={t.key}
                    onClick={() => onChange(t.key)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${active === t.key ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}
                >
                    {t.label}
                    <div className="text-xs font-normal mt-0.5 text-gray-400">{t.sub}</div>
                    {active === t.key && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />
                    )}
                </button>
            ))}
            <button className="px-4 py-3 text-gray-500 hover:text-gray-700 text-sm border-l border-gray-100 hidden sm:flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h6" />
                </svg>
                Diğer sıralama
            </button>
        </div>
    );
}
function FlightCard({ flight }: { flight: FlightOption }) {
    const [expanded, setExpanded] = useState(false);

    const airlines = [
        ...new Set([flight.outbound.airline, flight.inbound.airline]),
    ]
        .map((a) => airlineConfig[a].name)
        .join(", ");

    return (
        <div className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${expanded ? "border-blue-400 shadow-lg" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}`}>            <div
                className="flex flex-col sm:flex-row cursor-pointer select-none"
                onClick={() => setExpanded((v) => !v)}
            >
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Paylaş
                        </button>
                        <div className="flex gap-1.5">
                            {flight.tags?.includes("best") && (
                                <span className="text-[10px] font-semibold bg-teal-500 text-white px-2 py-0.5 rounded-full">En iyi</span>
                            )}
                            {flight.tags?.includes("cheapest") && (
                                <span className="text-[10px] font-semibold bg-orange-400 text-white px-2 py-0.5 rounded-full">En ucuz</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1 divide-y divide-gray-100">
                        <LegRow leg={flight.outbound} />
                        <LegRow leg={flight.inbound} />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{airlines}</p>
                        <div className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="sm:w-44 p-4 sm:border-l border-t sm:border-t-0 border-gray-100 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 bg-gray-50 sm:bg-white">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 tabular-nums">
                            ${flight.pricePerPerson}
                            <span className="text-xs font-normal text-gray-400 ml-1">/ kişi</span>
                        </div>
                        <div className="text-xs text-gray-400">${flight.totalPrice} toplam</div>
                        <div className="text-xs text-gray-400 mt-0.5">{flight.cabin}</div>
                    </div>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                    >
                        Seçin
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-blue-100 px-4 pb-5 pt-4 bg-blue-50/30 space-y-3">
                    <LegDetail leg={flight.outbound} />
                    <LegDetail leg={flight.inbound} />

                    <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                        <p className="text-xs text-gray-400">
                            {flight.offerCount} fırsat, başlangıç fiyatı:
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 tabular-nums">
                                    ${flight.pricePerPerson}{" "}
                                    <span className="text-xs font-normal text-gray-400">/ kişi başına</span>
                                </p>
                                <p className="text-xs text-gray-400">Toplam ${flight.totalPrice}</p>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                                Seçin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
function FilterSection({
    title,
    children,
    defaultOpen = true,
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-gray-100 pt-4">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center justify-between w-full mb-2 group"
            >
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && <div>{children}</div>}
        </div>
    );
}
function RangeSlider({
    min, max, value, onChange, format,
}: {
    min: number; max: number; value: number;
    onChange: (v: number) => void;
    format?: (v: number) => string;
}) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="relative pt-1">
            <input
                type="range" min={min} max={max} value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
                style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #e5e7eb ${pct}%)` }}
            />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{format ? format(min) : min}</span>
                <span>{format ? format(value) : value}</span>
            </div>
        </div>
    );
}
function DualRangeSlider({
    min, max, low, high,
    onLowChange, onHighChange,
    format,
}: {
    min: number; max: number; low: number; high: number;
    onLowChange: (v: number) => void;
    onHighChange: (v: number) => void;
    format?: (v: number) => string;
}) {
    const pctL = ((low - min) / (max - min)) * 100;
    const pctH = ((high - min) / (max - min)) * 100;
    return (
        <div className="relative pt-1">
            <div className="relative h-1.5 rounded-full bg-gray-200">
                <div
                    className="absolute h-1.5 bg-blue-500 rounded-full"
                    style={{ left: `${pctL}%`, right: `${100 - pctH}%` }}
                />
            </div>
            <input type="range" min={min} max={max} value={low}
                onChange={(e) => { const v = Math.min(Number(e.target.value), high - 1); onLowChange(v); }}
                className="absolute top-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-blue-500"
            />
            <input type="range" min={min} max={max} value={high}
                onChange={(e) => { const v = Math.max(Number(e.target.value), low + 1); onHighChange(v); }}
                className="absolute top-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between mt-3 text-xs text-gray-400">
                <span>{format ? format(low) : low}</span>
                <span>{format ? format(high) : high}</span>
            </div>
        </div>
    );
}
function TimeRangeSlider({
    label, low, high, onLowChange, onHighChange,
}: {
    label: string; low: number; high: number;
    onLowChange: (v: number) => void;
    onHighChange: (v: number) => void;
}) {
    const toTime = (m: number) => {
        const h = String(Math.floor(m / 60)).padStart(2, "0");
        const mn = String(m % 60).padStart(2, "0");
        return `${h}:${mn}`;
    };
    return (
        <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <DualRangeSlider min={0} max={1440} low={low} high={high}
                onLowChange={onLowChange} onHighChange={onHighChange} format={toTime} />
        </div>
    );
}
function FilterSidebar() {
    const [stops, setStops] = useState<string[]>(["direct"]);
    const toggleStop = (val: string) =>
        setStops((prev) => prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]);

    const [elBagaj, setElBagaj] = useState(0);
    const [kayitliBagaj, setKayitliBagaj] = useState(0);

    const [bakDep, setBakDep] = useState<[number, number]>([120, 1440]);
    const [istDep, setIstDep] = useState<[number, number]>([0, 1440]);

    const allAirlines = [
        { key: "air_arabia",  label: "Air Arabia",           price: null },
        { key: "air_astana",  label: "Air Astana",            price: null },
        { key: "ajet",        label: "Ajet",                  price: "$202" },
        { key: "azal",        label: "Azerbaijan Airlines",   price: "$221" },
        { key: "china_south", label: "China Southern",        price: null },
        { key: "egyptair",    label: "Egyptair",              price: null },
    ];
    const [showAllAirlines, setShowAllAirlines] = useState(false);
    const [airlines, setAirlines] = useState<string[]>(allAirlines.map((a) => a.key));
    const toggleAirline = (k: string) =>
        setAirlines((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
    const visibleAirlines = showAllAirlines ? allAirlines : allAirlines.slice(0, 5);

    const [alliances, setAlliances] = useState<string[]>([]);
    const toggleAlliance = (k: string) =>
        setAlliances((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

    const [airports, setAirports] = useState<string[]>(["GYD", "SAW"]);
    const toggleAirport = (k: string) =>
        setAirports((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
    const [sameAirport, setSameAirport] = useState(false);

    const [flightDuration, setFlightDuration] = useState(180);
    const [transferDuration, setTransferDuration] = useState(1430);
    const [priceMax, setPriceMax] = useState(8267);

    const [quality, setQuality] = useState({
        wifi: false, kayakMix: true, night: false, long901: false, selfTransfer: true,
    });
    const toggleQuality = (k: keyof typeof quality) =>
        setQuality((prev) => ({ ...prev, [k]: !prev[k] }));

    const [aircraft, setAircraft] = useState<string[]>([]);
    const aircraftList = ["Airbus A321neo", "Boeing 737-800", "Boeing 737 MAX 8", "Boeing 787-8", "Airbus A320"];
    const toggleAircraft = (k: string) =>
        setAircraft((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

    const [sites, setSites] = useState<string[]>([]);
    const siteList = [
        { key: "kayak",       label: "KAYAK",       price: "$202" },
        { key: "flightsmojo", label: "FlightsMojo",  price: "$202" },
        { key: "gotogate",    label: "Gotogate",     price: "$207" },
        { key: "mytrip",      label: "Mytrip",       price: "$207" },
        { key: "kiwi",        label: "Kiwi.com",     price: "$209" },
    ];
    const toggleSite = (k: string) =>
        setSites((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);

    const fmtMin = (m: number) => {
        const h = Math.floor(m / 60); const mn = m % 60;
        return h > 0 ? `${h}sa. ${mn}dk.` : `${mn}dk.`;
    };

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-base">✦</span>
                        <h3 className="text-sm font-semibold text-gray-800">Akıllı Filtreler</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                        Yapay zeka ile desteklenmektedir; yapay zeka hata yapabilir.{" "}
                        <span className="text-blue-500 cursor-pointer hover:underline">Daha fazla bilgi edinin</span>
                    </p>
                    <textarea
                        className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 h-20 placeholder:text-gray-400"
                        placeholder="Ne arıyorsunuz? Şu şekilde deneyebilirsiniz: 1000₺ altı aktarmasız uçuşları görmek istiyorum."
                    />
                    <button className="mt-2 w-full text-xs font-medium text-gray-400 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">
                        Uçuşları filtrele
                    </button>
                </div>
                <FilterSection title="Aktarmalar">
                    <div className="space-y-1.5">
                        {[
                            { val: "direct", label: "Direkt",     price: "$202" },
                            { val: "1stop",  label: "1 aktarma",  price: "$233" },
                            { val: "2stop",  label: "2+ aktarma", price: null },
                        ].map((item) => (
                            <label key={item.val} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={stops.includes(item.val)}
                                        onChange={() => toggleStop(item.val)}
                                        className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                </div>
                                {item.price && <span className="text-xs text-gray-400">{item.price}</span>}
                            </label>
                        ))}
                    </div>
                </FilterSection>
                <FilterSection title="Ücret Yardımcısı">
                    <p className="text-xs text-gray-400 mb-3">Yolcu başına bagaj</p>
                    {[
                        { label: "El bagajı",     val: elBagaj,       set: setElBagaj },
                        { label: "Kayıtlı bagaj", val: kayitliBagaj,  set: setKayitliBagaj },
                    ].map((b) => (
                        <div key={b.label} className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {b.label}
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => b.set(Math.max(0, b.val - 1))}
                                    className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm">−</button>
                                <span className="w-4 text-center text-sm font-medium text-gray-700">{b.val}</span>
                                <button onClick={() => b.set(b.val + 1)}
                                    className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center text-sm">+</button>
                            </div>
                        </div>
                    ))}
                </FilterSection>
                <FilterSection title="Saatler">
                    <div className="flex gap-1 mb-3">
                        {["Gidiş", "İniş"].map((t) => (
                            <button key={t} className="flex-1 text-xs py-1 rounded-lg border border-gray-200 font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                {t}
                            </button>
                        ))}
                    </div>
                    <TimeRangeSlider label="Kalkış: BAK"
                        low={bakDep[0]} high={bakDep[1]}
                        onLowChange={(v) => setBakDep([v, bakDep[1]])}
                        onHighChange={(v) => setBakDep([bakDep[0], v])} />
                    <TimeRangeSlider label="Kalkış: IST"
                        low={istDep[0]} high={istDep[1]}
                        onLowChange={(v) => setIstDep([v, istDep[1]])}
                        onHighChange={(v) => setIstDep([istDep[0], v])} />
                </FilterSection>
                <FilterSection title="Hava Yolu Şirketleri">
                    <div className="flex gap-2 mb-2 text-xs">
                        <button onClick={() => setAirlines(allAirlines.map((a) => a.key))}
                            className="text-blue-500 hover:underline">Tümünü seç</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => setAirlines([])}
                            className="text-blue-500 hover:underline">Tümünü sil</button>
                    </div>
                    <div className="space-y-1.5">
                        {visibleAirlines.map((a) => (
                            <label key={a.key} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={airlines.includes(a.key)}
                                        onChange={() => toggleAirline(a.key)}
                                        className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{a.label}</span>
                                </div>
                                {a.price && <span className="text-xs text-gray-400">{a.price}</span>}
                            </label>
                        ))}
                    </div>
                    {!showAllAirlines && (
                        <button onClick={() => setShowAllAirlines(true)}
                            className="mt-2 text-xs text-blue-500 hover:underline">
                            19 hava yolu şirketini daha göster
                        </button>
                    )}
                </FilterSection>
                <FilterSection title="İttifaklar" defaultOpen={false}>
                    <div className="space-y-1.5">
                        {[
                            { key: "oneworld", label: "oneworld",     price: null },
                            { key: "star",     label: "Star Alliance", price: "$287" },
                        ].map((a) => (
                            <label key={a.key} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={alliances.includes(a.key)}
                                        onChange={() => toggleAlliance(a.key)}
                                        className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{a.label}</span>
                                </div>
                                {a.price && <span className="text-xs text-gray-400">{a.price}</span>}
                            </label>
                        ))}
                    </div>
                </FilterSection>
                <FilterSection title="Havalimanları" defaultOpen={false}>
                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                        <input type="checkbox" checked={sameAirport} onChange={() => setSameAirport((v) => !v)}
                            className="w-4 h-4 rounded accent-blue-500" />
                        <span className="text-sm text-gray-700">Gidiş/Dönüş aynı</span>
                    </label>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Bakü</p>
                    {[{ key: "GYD", label: "GYD: Haydar Aliyev Ulu...", price: "$202" }].map((ap) => (
                        <label key={ap.key} className="flex items-center justify-between gap-2 cursor-pointer mb-1.5">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={airports.includes(ap.key)}
                                    onChange={() => toggleAirport(ap.key)}
                                    className="w-4 h-4 rounded accent-blue-500" />
                                <span className="text-sm text-gray-700">{ap.label}</span>
                            </div>
                            <span className="text-xs text-gray-400">{ap.price}</span>
                        </label>
                    ))}
                    <p className="text-xs font-semibold text-gray-500 mt-2 mb-1">İstanbul</p>
                    {[
                        { key: "SAW", label: "SAW: Sabiha Gökçen", price: "$202" },
                        { key: "IST", label: "IST: İstanbul",       price: "$255" },
                    ].map((ap) => (
                        <label key={ap.key} className="flex items-center justify-between gap-2 cursor-pointer mb-1.5">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={airports.includes(ap.key)}
                                    onChange={() => toggleAirport(ap.key)}
                                    className="w-4 h-4 rounded accent-blue-500" />
                                <span className="text-sm text-gray-700">{ap.label}</span>
                            </div>
                            <span className="text-xs text-gray-400">{ap.price}</span>
                        </label>
                    ))}
                </FilterSection>
                <FilterSection title="Süre" defaultOpen={false}>
                    <p className="text-xs text-gray-500 mb-1">Uçuş etabı</p>
                    <RangeSlider min={180} max={2635} value={flightDuration}
                        onChange={setFlightDuration} format={fmtMin} />
                    <p className="text-xs text-gray-500 mt-3 mb-1">Aktarma</p>
                    <RangeSlider min={55} max={1430} value={transferDuration}
                        onChange={setTransferDuration} format={fmtMin} />
                </FilterSection>
                <FilterSection title="Fiyat">
                    <RangeSlider min={202} max={8267} value={priceMax}
                        onChange={setPriceMax} format={(v) => `$${v.toLocaleString()}`} />
                </FilterSection>
                <FilterSection title="Kabin">
                    <div className="space-y-1.5">
                        {[
                            { label: "Ekonomi",  price: "$202" },
                            { label: "Business", price: "$729" },
                            { label: "Karma",    price: "$870" },
                        ].map((c) => (
                            <label key={c.label} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{c.label}</span>
                                </div>
                                <span className="text-xs text-gray-400">{c.price}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
                <FilterSection title="Uçuş kalitesi" defaultOpen={false}>
                    <div className="space-y-2">
                        {[
                            { key: "wifi",         label: "Sadece Wi-Fi'li uçuşları göster" },
                            { key: "kayakMix",     label: "KAYAK Mix fiyatlarını göster*" },
                            { key: "night",        label: "Gece uçuşlarını göster" },
                            { key: "long901",      label: "Daha uzun 901 uçuşu göster" },
                            { key: "selfTransfer", label: "Kendi kendine aktarmalı uçuşları göster" },
                        ].map((q) => (
                            <label key={q.key} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox"
                                    checked={quality[q.key as keyof typeof quality]}
                                    onChange={() => toggleQuality(q.key as keyof typeof quality)}
                                    className="w-4 h-4 rounded accent-blue-500 shrink-0" />
                                <span className="text-xs text-gray-600 leading-tight">{q.label}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
                <FilterSection title="Uçak" defaultOpen={false}>
                    <div className="space-y-1.5">
                        {aircraftList.map((ac) => (
                            <label key={ac} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={aircraft.includes(ac)}
                                    onChange={() => toggleAircraft(ac)}
                                    className="w-4 h-4 rounded accent-blue-500" />
                                <span className="text-sm text-gray-700">{ac}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
                <FilterSection title="Rezervasyon Siteleri" defaultOpen={false}>
                    <div className="space-y-1.5">
                        {siteList.map((s) => (
                            <label key={s.key} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={sites.includes(s.key)}
                                        onChange={() => toggleSite(s.key)}
                                        className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{s.label}</span>
                                </div>
                                <span className="text-xs text-gray-400">{s.price}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

            </div>
        </aside>
    );
}
function HeaderDropdown({
    value, options, onChange,
}: {
    value: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-200 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none"
            >
                {value}
                <svg
                    className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className="absolute left-0 top-full mt-1.5 z-50 min-w-[160px] overflow-hidden"
                style={{
                    transition: "opacity 180ms ease, transform 180ms ease",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.95)",
                    transformOrigin: "top",
                    pointerEvents: open ? "auto" : "none",
                }}
            >
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                                opt === value
                                    ? "bg-yellow-50 text-yellow-700 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <span className={`w-4 text-center text-xs ${opt === value ? "opacity-100" : "opacity-0"}`}>✓</span>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
function SearchHeader() {
    const [tripType, setTripType] = useState("Gidiş dönüş");
    const [passengers, setPassengers] = useState("2 yolcu");
    const [cabin, setCabin] = useState("Ekonomi");

    return (
        <div className="bg-yellow-400  px-5 py-4 rounded-2xl mb-6 shadow-sm w-full">
            <div className="flex flex-wrap items-center gap-2.5">

                <HeaderDropdown
                    value={tripType}
                    options={["Gidiş dönüş", "Tek yön", "Çoklu şehir"]}
                    onChange={setTripType}
                />
                <HeaderDropdown
                    value={passengers}
                    options={["1 yolcu", "2 yolcu", "3 yolcu", "4 yolcu"]}
                    onChange={setPassengers}
                />
                <HeaderDropdown
                    value={cabin}
                    options={["Ekonomi", "Premium Ekonomi", "Business", "İlk Sınıf"]}
                    onChange={setCabin}
                />

                <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">Bakü (BAK)</span>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors text-xs">✕</button>
                    </div>

                    <button className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:bg-gray-50 hover:rotate-180 transition-all duration-300 shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">İstanbul (IST)</span>
                        <button className="text-gray-300 hover:text-gray-500 transition-colors text-xs">✕</button>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm shrink-0">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">05.04 Paz</span>
                        <span className="text-gray-200 mx-0.5">—</span>
                        <span className="text-sm font-medium text-gray-700">10.04 Cum</span>
                    </div>

                    <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all shadow-sm shrink-0">
                        Ara
                    </button>
                </div>
            </div>
        </div>
    );
}
export default function FlightResults() {
    const [sort, setSort] = useState<SortKey>("best");

    const sortedFlights = [...flights].sort((a, b) => a.pricePerPerson - b.pricePerPerson);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <SearchHeader />
                <div className="flex flex-col lg:flex-row gap-5">
                    <FilterSidebar />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 mb-3">
                            <span className="font-semibold text-gray-800">1099</span>
                            <span className="text-gray-400"> / 2000 uçuş</span>
                        </p>
                        <div className="mb-3">
                            <SortTabs active={sort} onChange={setSort} />
                        </div>
                        <div className="space-y-3">
                            {sortedFlights.map((f) => (
                                <FlightCard key={f.id} flight={f} />
                            ))}
                        </div>
                        <button className="mt-5 w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-white hover:border-blue-300 transition-all font-medium">
                            Daha fazla uçuş göster
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}