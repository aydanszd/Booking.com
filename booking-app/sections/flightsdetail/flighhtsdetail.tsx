"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

interface FlightEndpoint {
    city: string;
    airport?: string;
    code: string;
}

interface BookingSite {
    name: string;
    url: string;
    price: number;
}

interface Stop {
    airport: string;
    duration: number;
}

interface FlightType {
    _id: string;
    airline: string;
    alliance?: string;
    flightNumber?: string;
    aircraft?: string;
    cabin: string;
    origin: FlightEndpoint;
    destination: FlightEndpoint;
    departureTime: string;
    arrivalTime: string;
    duration: number;
    stops: Stop[];
    price: number;
    baggagePerPax?: string;
    flightQuality?: number;
    bookingSites: BookingSite[];
    totalSeats: number;
    bookedSeats: number;
    logoUrl?: string;
    inbound?: FlightType;
}

interface FetchFlightsResponse {
    flights: FlightType[];
    total: number;
}

const BASE = "http://localhost:5000";
const API = `${BASE}/api/flights`;

const flightApi = {
    getAll: async (params: Record<string, string>): Promise<FetchFlightsResponse> => {
        const p = new URLSearchParams(params);
        const res = await fetch(`${API}?${p}`);
        if (!res.ok) throw new Error("Failed to load flights");
        return res.json();
    },
};

function formatTime(iso: string) {
    if (!iso) return "--:--";
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function formatDateLabel(iso: string) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", weekday: "short" });
}

function seatsLeft(flight: FlightType) {
    return Math.max(0, (flight.totalSeats ?? 0) - (flight.bookedSeats ?? 0));
}

const AIRLINE_COLORS: Record<string, { bg: string; text: string }> = {
    ajet: { bg: "#FF6B35", text: "#fff" },
    ajt: { bg: "#FF6B35", text: "#fff" },
    azerbaijan: { bg: "#0057A8", text: "#fff" },
    azal: { bg: "#0057A8", text: "#fff" },
    pegasus: { bg: "#FFD700", text: "#1a1a1a" },
    turkish: { bg: "#C8102E", text: "#fff" },
    lufthansa: { bg: "#05164D", text: "#FFD700" },
    emirates: { bg: "#D71921", text: "#fff" },
    flydubai: { bg: "#E31837", text: "#fff" },
    qatar: { bg: "#5C0632", text: "#fff" },
    "air arabia": { bg: "#CC0000", text: "#fff" },
    wizz: { bg: "#C6007E", text: "#fff" },
    ryanair: { bg: "#073590", text: "#FFD700" },
    easyjet: { bg: "#FF6600", text: "#fff" },
    flyone: { bg: "#E4002B", text: "#fff" },
};

function getAirlineColor(name: string): { bg: string; text: string } {
    const lower = name.toLowerCase();
    for (const [key, val] of Object.entries(AIRLINE_COLORS)) {
        if (lower.includes(key)) return val;
    }
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = ((hash % 360) + 360) % 360;
    return { bg: `hsl(${hue}, 60%, 40%)`, text: "#fff" };
}

function AirlineLogo({ src, name, size = "md" }: { src?: string; name: string; size?: "sm" | "md" | "lg" }) {
    const [imgOk, setImgOk] = useState<boolean | null>(src ? null : false);
    const sz = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-14 h-14" : "w-10 h-10";
    const fontSize = size === "lg" ? "text-base" : size === "sm" ? "text-[9px]" : "text-xs";
    const { bg, text } = getAirlineColor(name);
    const initials = name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || name.slice(0, 2).toUpperCase();
    const imageUrl = src?.startsWith("/uploads") ? `http://localhost:5000${src}` : src;
    return (
        <div className={`${sz} rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
            style={{ background: imgOk === true ? "white" : bg, border: "1px solid #e5e7eb" }}>
            {imageUrl && imgOk !== false ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-contain p-1"
                    onLoad={() => setImgOk(true)} onError={() => setImgOk(false)}
                    style={{ display: imgOk === true ? "block" : "none" }} />
            ) : null}
            {imgOk !== true && (
                <span className={`${fontSize} font-bold leading-none`} style={{ color: text }}>{initials}</span>
            )}
        </div>
    );
}

function LegRow({ flight }: { flight: FlightType }) {
    const t = useTranslations("flights");
    const stopCount = flight.stops?.length ?? 0;
    const h = Math.floor(flight.duration / 60);
    const m = flight.duration % 60;
    const durationStr = h > 0 ? `${h}${t("hourShort")} ${m}${t("minShort")}` : `${m}${t("minShort")}`;
    return (
        <div className="flex items-center gap-3 py-1">
            <AirlineLogo src={flight.logoUrl} name={flight.airline} />
            <div className="min-w-0 flex-1">
                <span className="font-semibold text-gray-900 text-sm tabular-nums">
                    {formatTime(flight.departureTime)} – {formatTime(flight.arrivalTime)}
                </span>
                <span className="hidden sm:inline text-xs text-gray-400 ml-2">
                    {flight.origin.code} — {flight.destination.code}
                </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs text-gray-500">
                {stopCount === 0 ? (
                    <span className="hidden sm:inline font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {t("directFlight")}
                    </span>
                ) : (
                    <span className="hidden sm:inline font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        {t("stopsCount", { count: stopCount })}
                    </span>
                )}
                <span className="tabular-nums whitespace-nowrap">{durationStr}</span>
            </div>
        </div>
    );
}

function LegDetail({ flight, label }: { flight: FlightType; label?: string }) {
    const t = useTranslations("flights");
    const h = Math.floor(flight.duration / 60);
    const m = flight.duration % 60;
    const durationStr = h > 0 ? `${h}${t("hourShort")} ${m}${t("minShort")}` : `${m}${t("minShort")}`;
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                <span className="text-sm font-semibold text-gray-800">{label || formatDateLabel(flight.departureTime)}</span>
                <span className="text-sm text-gray-400 tabular-nums">{durationStr}</span>
            </div>
            <div className="px-4 py-4">
                <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <AirlineLogo src={flight.logoUrl} name={flight.airline} size="lg" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800">{flight.airline}</span>
                            {flight.flightNumber && (
                                <><span className="text-xs text-gray-400">·</span>
                                <span className="text-xs font-medium text-gray-600">{flight.flightNumber}</span></>
                            )}
                        </div>
                        {flight.alliance && <p className="text-xs text-gray-400 mt-0.5 truncate">{flight.alliance}</p>}
                    </div>
                    {flight.aircraft && (
                        <span className="shrink-0 text-xs bg-white text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 whitespace-nowrap font-medium shadow-sm">
                            {flight.aircraft}
                        </span>
                    )}
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mt-1" />
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        {flight.stops?.map((s, i) => (
                            <React.Fragment key={i}>
                                <div className="w-3 h-3 rounded-full border-2 border-amber-400 bg-white" />
                                <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 32 }} />
                            </React.Fragment>
                        ))}
                        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="w-px bg-gray-200 flex-1 my-1.5" style={{ minHeight: 48 }} />
                        <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-white mb-1" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between" style={{ minHeight: 140 }}>
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">{formatTime(flight.departureTime)}</p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {flight.origin.airport || flight.origin.city}{" "}
                                <span className="text-gray-400">({flight.origin.code})</span>
                            </p>
                        </div>
                        {flight.stops?.map((s, i) => {
                            const sh = Math.floor(s.duration / 60);
                            const sm = s.duration % 60;
                            const sDur = sh > 0 ? `${sh}${t("hourShort")} ${sm}${t("minShort")}` : `${sm}${t("minShort")}`;
                            return (
                                <div key={i} className="my-2 flex items-center gap-2">
                                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                        {s.airport} · {sDur} {t("waitTime")}
                                    </span>
                                </div>
                            );
                        })}
                        <div>
                            <p className="text-xl font-bold text-gray-900 tabular-nums leading-tight">{formatTime(flight.arrivalTime)}</p>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {flight.destination.airport || flight.destination.city}{" "}
                                <span className="text-gray-400">({flight.destination.code})</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start shrink-0">
                        {flight.baggagePerPax && (
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-500 whitespace-nowrap">
                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {flight.baggagePerPax}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

type SortKey = "price_asc" | "price_desc" | "duration" | "quality";

function SortTabs({ active, onChange }: { active: SortKey; onChange: (k: SortKey) => void }) {
    const t = useTranslations("flights");
    const tabs: { key: SortKey; labelKey: string }[] = [
        { key: "price_asc", labelKey: "sortCheapest" },
        { key: "quality", labelKey: "sortBest" },
        { key: "duration", labelKey: "sortShortest" },
        { key: "price_desc", labelKey: "sortExpensive" },
    ];
    return (
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl overflow-hidden">
            {tabs.map((tab) => (
                <button key={tab.key} onClick={() => onChange(tab.key)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${active === tab.key ? "text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>
                    {t(tab.labelKey as any)}
                    {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />}
                </button>
            ))}
        </div>
    );
}

function FlightCard({ flight }: { flight: FlightType }) {
    const t = useTranslations("flights");
    const [expanded, setExpanded] = useState(false);

    const CABIN_MAP: Record<string, string> = {
        economy: t("economy"),
        premium_economy: t("premiumEconomy"),
        business: t("business"),
        first: t("first"),
    };

    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) { window.location.href = "/signin"; return; }
        const params = new URLSearchParams({
            id: flight._id,
            airline: flight.airline || "",
            flightNumber: flight.flightNumber || "",
            origin: flight.origin?.code || "",
            originCity: flight.origin?.city || "",
            destination: flight.destination?.code || "",
            destinationCity: flight.destination?.city || "",
            departureTime: flight.departureTime || "",
            arrivalTime: flight.arrivalTime || "",
            cabin: flight.cabin || "",
            price: String(flight.price),
            adults: "1",
            children: "0",
            totalPrice: String(flight.price),
            logoUrl: flight.logoUrl || "",
        });
        window.location.href = `/checkout/flight?${params.toString()}`;
    };

    const left = seatsLeft(flight);
    const isGood = (flight.flightQuality ?? 0) >= 8;

    return (
        <div className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${expanded ? "border-blue-400 shadow-lg" : "border-gray-200 hover:border-blue-300 hover:shadow-md"}`}>
            <div className="flex flex-col sm:flex-row cursor-pointer select-none" onClick={() => setExpanded((v) => !v)}>
                <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                        <button onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            {t("share")}
                        </button>
                        <div className="flex gap-1.5">
                            {isGood && (
                                <span className="text-[10px] font-semibold bg-teal-500 text-white px-2 py-0.5 rounded-full">
                                    {t("sortBest")}
                                </span>
                            )}
                            {left <= 5 && left > 0 && (
                                <span className="text-[10px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                    ⚡ {t("seatsLeft", { count: left })}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1 divide-y divide-gray-100">
                        <LegRow flight={flight} />
                        {flight.inbound && <LegRow flight={flight.inbound} />}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{flight.airline}</p>
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
                            ${flight.price}
                            <span className="text-xs font-normal text-gray-400 ml-1">/ {t("perPerson")}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{CABIN_MAP[flight.cabin] || flight.cabin}</div>
                    </div>
                    <button onClick={handleSelect}
                        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                        {t("select")}
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-blue-100 px-4 pb-5 pt-4 bg-blue-50/30 space-y-3">
                    <LegDetail flight={flight} label={`${t("departure")} • ${formatDateLabel(flight.departureTime)}`} />
                    {flight.inbound && (
                        <LegDetail flight={flight.inbound} label={`${t("return")} • ${formatDateLabel(flight.inbound.departureTime)}`} />
                    )}
                    {flight.bookingSites?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">{t("bookingSites")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {flight.bookingSites.map((site, i) => (
                                    <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:shadow-sm transition-all group">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{site.name}</span>
                                        <span className="text-sm font-bold text-blue-600">${site.price}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                        <p className="text-xs text-gray-400">
                            {flight.bookingSites?.length ? t("dealsFrom", { count: flight.bookingSites.length }) : ""}
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 tabular-nums">
                                    ${flight.price}{" "}
                                    <span className="text-xs font-normal text-gray-400">/ {t("perPerson")}</span>
                                </p>
                            </div>
                            <button onClick={handleSelect} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                                {t("select")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-t border-gray-100 pt-4">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full mb-2 group">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && <div>{children}</div>}
        </div>
    );
}

function RangeSlider({ min, max, value, onChange, format }: { min: number; max: number; value: number; onChange: (v: number) => void; format?: (v: number) => string }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="relative pt-1">
            <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-blue-500"
                style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #e5e7eb ${pct}%)` }} />
            <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{format ? format(min) : min}</span>
                <span>{format ? format(value) : value}</span>
            </div>
        </div>
    );
}

interface Filters {
    cabin: string[];
    stops: string[];
    airline: string;
    minPrice: number;
    maxPrice: number;
    origin: string;
    destination: string;
    sortBy: SortKey;
}

function FilterSidebar({ filters, setFilters, airlines, origins, destinations }: {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    airlines: string[];
    origins: string[];
    destinations: string[];
}) {
    const t = useTranslations("flights");

    const toggleStop = (val: string) =>
        setFilters((f) => ({ ...f, stops: f.stops.includes(val) ? f.stops.filter((s) => s !== val) : [...f.stops, val] }));

    const toggleCabin = (val: string) =>
        setFilters((f) => ({ ...f, cabin: f.cabin.includes(val) ? f.cabin.filter((c) => c !== val) : [...f.cabin, val] }));

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-base">✦</span>
                        <h3 className="text-sm font-semibold text-gray-800">{t("smartFilters")}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                        {t("aiPowered")}{" "}
                        <span className="text-blue-500 cursor-pointer hover:underline">{t("learnMore")}</span>
                    </p>
                    <textarea className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 h-20 placeholder:text-gray-400"
                        placeholder={t("filterPlaceholder")} />
                    <button className="mt-2 w-full text-xs font-medium text-gray-400 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">
                        {t("filterFlights")}
                    </button>
                </div>

                <FilterSection title={t("stopsFilter")}>
                    <div className="space-y-1.5">
                        {[
                            { val: "direct", labelKey: "directFlight" },
                            { val: "1stop", labelKey: "oneStopLabel" },
                            { val: "2stop", labelKey: "twoStopsLabel" },
                        ].map((item) => (
                            <label key={item.val} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={filters.stops.includes(item.val)} onChange={() => toggleStop(item.val)} className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{t(item.labelKey as any)}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title={t("airlines")}>
                    <div className="flex gap-2 mb-2 text-xs">
                        <button onClick={() => setFilters((f) => ({ ...f, airline: "" }))} className="text-blue-500 hover:underline">
                            {t("selectAll")}
                        </button>
                    </div>
                    <select value={filters.airline} onChange={(e) => setFilters((f) => ({ ...f, airline: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                        <option value="">{t("allAirlines")}</option>
                        {airlines.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                </FilterSection>

                <FilterSection title={t("airports")} defaultOpen={false}>
                    <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">{t("originFilter")}</p>
                        <select value={filters.origin} onChange={(e) => setFilters((f) => ({ ...f, origin: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                            <option value="">{t("allOption")}</option>
                            {origins.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">{t("destinationFilter")}</p>
                        <select value={filters.destination} onChange={(e) => setFilters((f) => ({ ...f, destination: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                            <option value="">{t("allOption")}</option>
                            {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </FilterSection>

                <FilterSection title={t("priceFilter")}>
                    <RangeSlider min={0} max={5000} value={filters.maxPrice}
                        onChange={(v) => setFilters((f) => ({ ...f, maxPrice: v }))}
                        format={(v) => `$${v.toLocaleString()}`} />
                </FilterSection>

                <FilterSection title={t("cabinFilter")}>
                    <div className="space-y-1.5">
                        {[
                            { key: "economy", labelKey: "economy" },
                            { key: "premium_economy", labelKey: "premiumEconomy" },
                            { key: "business", labelKey: "business" },
                            { key: "first", labelKey: "first" },
                        ].map((c) => (
                            <label key={c.key} className="flex items-center justify-between gap-2 cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={filters.cabin.includes(c.key)} onChange={() => toggleCabin(c.key)} className="w-4 h-4 rounded accent-blue-500" />
                                    <span className="text-sm text-gray-700">{t(c.labelKey as any)}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <div className="border-t border-gray-100 pt-4">
                    <button
                        onClick={() => setFilters({ cabin: [], stops: [], airline: "", minPrice: 0, maxPrice: 5000, origin: "", destination: "", sortBy: "price_asc" })}
                        className="w-full text-xs text-blue-500 hover:underline">
                        {t("resetFilters")}
                    </button>
                </div>
            </div>
        </aside>
    );
}

function HeaderDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    const ref = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);
    return (
        <div ref={ref} className="relative shrink-0">
            <button onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-200 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none">
                {value}
                <svg className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[160px] overflow-hidden"
                style={{ transition: "opacity 180ms ease, transform 180ms ease", opacity: open ? 1 : 0, transform: open ? "translateY(0) scaleY(1)" : "translateY(-6px) scaleY(0.95)", transformOrigin: "top", pointerEvents: open ? "auto" : "none" }}>
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                    {options.map((opt) => (
                        <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${opt === value ? "bg-yellow-50 text-yellow-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                            <span className={`w-4 text-center text-xs ${opt === value ? "opacity-100" : "opacity-0"}`}>✓</span>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SearchHeader({ filters, onSearch }: { filters: Filters; onSearch: () => void }) {
    const t = useTranslations("flights");
    const [tripType, setTripType] = useState(t("roundTrip"));
    const [passengers, setPassengers] = useState(t("passenger", { count: 2 }));
    const [cabin, setCabin] = useState(t("economy"));

    return (
        <div className="bg-yellow-400 px-5 py-4 rounded-2xl mb-6 shadow-sm w-full">
            <div className="flex flex-wrap items-center gap-2.5">
                <HeaderDropdown value={tripType} options={[t("roundTrip"), t("oneWay"), t("multiCity")]} onChange={setTripType} />
                <HeaderDropdown value={passengers}
                    options={[1, 2, 3, 4].map(n => t("passenger", { count: n }))}
                    onChange={setPassengers} />
                <HeaderDropdown value={cabin}
                    options={[t("economy"), t("premiumEconomy"), t("business"), t("first")]}
                    onChange={setCabin} />
                <div className="flex-1 flex flex-wrap items-center gap-2 min-w-0">
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 flex-1 min-w-[130px] shadow-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 flex-1">{filters.origin || "Baku (BAK)"}</span>
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
                        <span className="text-sm font-medium text-gray-700 flex-1">{filters.destination || "Istanbul (IST)"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm shrink-0">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">05.04 — 10.04</span>
                    </div>
                    <button onClick={onSearch} className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold px-6 py-2 rounded-xl text-sm transition-all shadow-sm shrink-0">
                        {t("searchBtn")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FlightResults() {
    const t = useTranslations("flights");
    const [flights, setFlights] = useState<FlightType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const [filters, setFilters] = useState<Filters>({
        cabin: [],
        stops: [],
        airline: "",
        minPrice: 0,
        maxPrice: 5000,
        origin: "",
        destination: "",
        sortBy: "price_asc",
    });

    const [allAirlines, setAllAirlines] = useState<string[]>([]);
    const [allOrigins, setAllOrigins] = useState<string[]>([]);
    const [allDests, setAllDests] = useState<string[]>([]);

    const fetchFlights = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: Record<string, string> = { page: String(page), limit: String(LIMIT) };
            if (filters.airline) params.airline = filters.airline;
            if (filters.origin) params.origin = filters.origin;
            if (filters.destination) params.destination = filters.destination;
            if (filters.cabin.length === 1) params.cabin = filters.cabin[0];

            const data = await flightApi.getAll(params);
            let result = data.flights;
            if (filters.stops.length > 0) {
                result = result.filter((f) => {
                    const sc = f.stops?.length ?? 0;
                    if (filters.stops.includes("direct") && sc === 0) return true;
                    if (filters.stops.includes("1stop") && sc === 1) return true;
                    if (filters.stops.includes("2stop") && sc >= 2) return true;
                    return false;
                });
            }
            result = result.filter((f) => f.price >= filters.minPrice && f.price <= filters.maxPrice);
            result = [...result].sort((a, b) => {
                if (filters.sortBy === "price_asc") return a.price - b.price;
                if (filters.sortBy === "price_desc") return b.price - a.price;
                if (filters.sortBy === "duration") return a.duration - b.duration;
                if (filters.sortBy === "quality") return (b.flightQuality ?? 0) - (a.flightQuality ?? 0);
                return 0;
            });

            setFlights(result);
            setTotal(data.total);

            if (allAirlines.length === 0 && data.flights.length > 0) {
                setAllAirlines([...new Set(data.flights.map((f) => f.airline))].filter(Boolean));
                setAllOrigins([...new Set(data.flights.map((f) => f.origin.code))].filter(Boolean));
                setAllDests([...new Set(data.flights.map((f) => f.destination.code))].filter(Boolean));
            }
        } catch (e: any) {
            setError(e.message || t("searchingError"));
        } finally {
            setLoading(false);
        }
    }, [page, filters]);

    useEffect(() => { fetchFlights(); }, [fetchFlights]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <SearchHeader filters={filters} onSearch={fetchFlights} />
                <div className="flex flex-col lg:flex-row gap-5">
                    <FilterSidebar filters={filters} setFilters={setFilters} airlines={allAirlines} origins={allOrigins} destinations={allDests} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-800">{flights.length}</span>
                                <span className="text-gray-400"> / {t("flightsCount", { count: total })}</span>
                            </p>
                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {t("loadingFlights")}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <SortTabs active={filters.sortBy} onChange={(v) => setFilters((f) => ({ ...f, sortBy: v }))} />
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                                <button onClick={fetchFlights} className="text-xs text-red-500 hover:underline mt-1">{t("tryAgain")}</button>
                            </div>
                        )}
                        {!loading && !error && flights.length === 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <p className="text-gray-400 text-sm">{t("noFlights")}</p>
                                <button
                                    onClick={() => setFilters((f) => ({ ...f, cabin: [], stops: [], airline: "", maxPrice: 5000 }))}
                                    className="mt-3 text-xs text-blue-500 hover:underline">
                                    {t("resetFilters")}
                                </button>
                            </div>
                        )}
                        {loading && flights.length === 0 && (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                                                <div className="h-3 bg-gray-100 rounded w-1/3" />
                                            </div>
                                            <div className="w-20 h-8 bg-gray-100 rounded-xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!loading && (
                            <div className="space-y-3">
                                {flights.map((f) => <FlightCard key={f._id} flight={f} />)}
                            </div>
                        )}
                        {total > LIMIT && (
                            <div className="flex items-center justify-center gap-2 mt-5">
                                <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                                    {t("prevPage")}
                                </button>
                                <span className="text-sm text-gray-500 px-2">{t("pageNum", { num: page })}</span>
                                <button disabled={page * LIMIT >= total} onClick={() => setPage((p) => p + 1)}
                                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                                    {t("nextPage")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
