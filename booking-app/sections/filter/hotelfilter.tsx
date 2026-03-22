"use client";
import { useState, useEffect, useMemo } from "react";
import {
    Heart, MapPin, ArrowUpDown, X, LayoutList, LayoutGrid,
    ChevronRight, Leaf, Info, Loader2, Star, SlidersHorizontal, Menu,
} from "lucide-react";
import api, { IMG } from "@/api/building";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Building {
    _id: string;
    title: string;
    type: string;
    brand?: string;
    location: { city: string; country: string; address?: string };
    rooms?: { bedrooms: number; bathrooms: number };
    amenities?: string[];
    travelGroups?: string[];
    pricePerNight: number;
    minNights?: number;
    maxGuests?: number;
    rating: number;
    isAvailable: boolean;
    images?: string[];
    description?: string;
    sustainability?: boolean;
}

interface Filters {
    types: string[];
    brand: string;
    city: string;
    country: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    travelGroups: string[];
    availableOnly: boolean;
    minRating: number;
}

const DEFAULT_FILTERS: Filters = {
    types: [],
    brand: "",
    city: "",
    country: "",
    minPrice: 0,
    maxPrice: 2000,
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
    travelGroups: [],
    availableOnly: false,
    minRating: 0,
};

const BUILDING_TYPES  = ["hotel", "apartment", "villa", "hostel", "resort"];
const TRAVEL_GROUPS   = ["solo", "couple", "family", "group", "business"];
const AMENITY_OPTIONS = ["WiFi", "Pool", "Gym", "Parking", "Breakfast", "Air Conditioning", "Pet Friendly"];
const RATING_FILTERS  = [
    { label: "Exceptional: 9+", value: 9 },
    { label: "Very good: 8+",   value: 8 },
    { label: "Good: 7+",        value: 7 },
    { label: "Pleasant: 6+",    value: 6 },
];

function scoreLabel(v: number) {
    if (v >= 9) return "Exceptional";
    if (v >= 8) return "Very good";
    if (v >= 7) return "Good";
    if (v >= 6) return "Pleasant";
    return "Reviewed";
}

function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── CheckRow ─────────────────────────────────────────────────────────────────
function CheckRow({ label, checked, onChange, count }: {
    label: string; checked: boolean; onChange: () => void; count?: number;
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group select-none">
            <div className="flex items-center gap-2">
                <input type="checkbox" checked={checked} onChange={onChange}
                    className="accent-[#006ce4] w-3.5 h-3.5 cursor-pointer" />
                <span className="text-sm text-gray-700 group-hover:text-[#006ce4] transition-colors">
                    {label}
                </span>
            </div>
            {count !== undefined && (
                <span className="text-xs text-gray-400">{count.toLocaleString()}</span>
            )}
        </label>
    );
}

// ─── CounterRow ───────────────────────────────────────────────────────────────
function CounterRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">{label}</span>
            <div className="flex items-center gap-2">
                <button onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors text-sm">
                    −
                </button>
                <span className="text-sm text-gray-700 w-4 text-center">{value}</span>
                <button onClick={() => onChange(value + 1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] transition-colors text-sm">
                    +
                </button>
            </div>
        </div>
    );
}

// ─── PillButton ───────────────────────────────────────────────────────────────
function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                active
                    ? "bg-[#006ce4] text-white border-[#006ce4]"
                    : "border-gray-200 text-gray-600 hover:border-[#006ce4]"
            }`}>
            {label}
        </button>
    );
}

// ─── ScoreBadge ───────────────────────────────────────────────────────────────
function ScoreBadge({ value }: { value: number }) {
    const bg = value >= 9 ? "bg-[#003580]" : value >= 8 ? "bg-[#1a5276]" : "bg-[#1a6b3c]";
    return (
        <div className={`${bg} text-white text-sm font-bold px-2 py-1 rounded-lg rounded-tr-none min-w-[2.5rem] text-center`}>
            {value.toFixed(1)}
        </div>
    );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-gray-100 pb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">{title}</p>
            {children}
        </div>
    );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ filters, onChange, onReset, allBuildings, open, onClose }: {
    filters: Filters;
    onChange: (f: Partial<Filters>) => void;
    onReset: () => void;
    allBuildings: Building[];
    open: boolean;
    onClose: () => void;
}) {
    const pool = (exclude: keyof Filters) =>
        allBuildings.filter((b) => {
            if (exclude !== "types"         && filters.types.length > 0        && !filters.types.includes(b.type)) return false;
            if (exclude !== "brand"         && filters.brand.trim()             && !b.brand?.toLowerCase().includes(filters.brand.toLowerCase())) return false;
            if (exclude !== "city"          && filters.city.trim()              && !b.location.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            if (exclude !== "country"       && filters.country.trim()           && !b.location.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
            if (exclude !== "maxPrice"      && b.pricePerNight > filters.maxPrice) return false;
            if (exclude !== "minPrice"      && b.pricePerNight < filters.minPrice) return false;
            if (exclude !== "bedrooms"      && filters.bedrooms > 0             && (b.rooms?.bedrooms ?? 0) < filters.bedrooms) return false;
            if (exclude !== "bathrooms"     && filters.bathrooms > 0            && (b.rooms?.bathrooms ?? 0) < filters.bathrooms) return false;
            if (exclude !== "amenities"     && filters.amenities.length > 0     && !filters.amenities.every(a => b.amenities?.includes(a))) return false;
            if (exclude !== "travelGroups"  && filters.travelGroups.length > 0  && !filters.travelGroups.some(g => b.travelGroups?.includes(g))) return false;
            if (exclude !== "availableOnly" && filters.availableOnly             && !b.isAvailable) return false;
            if (exclude !== "minRating"     && filters.minRating > 0            && b.rating < filters.minRating) return false;
            return true;
        });

    const typePool    = pool("types");
    const amenityPool = pool("amenities");
    const groupPool   = pool("travelGroups");
    const ratingPool  = pool("minRating");
    const availPool   = pool("availableOnly");

    const toggle = (key: "types" | "amenities" | "travelGroups", val: string) => {
        const arr = filters[key] as string[];
        onChange({ [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
    };

    const content = (
        <div className="space-y-4 overflow-y-auto h-full pb-6">
            {/* Map */}
            <div className="rounded-xl overflow-hidden h-32 relative border border-gray-200 shadow-sm">
                <iframe title="map" width="100%" height="100%" style={{ border: 0 }} loading="lazy"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96058!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3dcc8b330b!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2str!4v1620000000000" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <button className="bg-white border border-gray-300 shadow text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 hover:shadow-md whitespace-nowrap">
                        <MapPin size={11} className="text-[#006ce4]" /> Show on map
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-800">Filter:</p>
                <button onClick={onReset} className="text-xs text-[#006ce4] hover:underline">Reset all</button>
            </div>

            <Section title="Property type">
                <div className="space-y-2">
                    {BUILDING_TYPES.map(t => (
                        <CheckRow key={t} label={capitalize(t)} checked={filters.types.includes(t)}
                            onChange={() => toggle("types", t)} count={typePool.filter(b => b.type === t).length} />
                    ))}
                </div>
            </Section>

            <Section title="Brand">
                <input type="text" value={filters.brand} onChange={e => onChange({ brand: e.target.value })}
                    placeholder="Hilton, Marriott..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors" />
            </Section>

            <Section title="Location">
                <div className="space-y-2">
                    <input type="text" value={filters.city} onChange={e => onChange({ city: e.target.value })}
                        placeholder="City"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors" />
                    <input type="text" value={filters.country} onChange={e => onChange({ country: e.target.value })}
                        placeholder="Country"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors" />
                </div>
            </Section>

            <Section title="Budget (per night)">
                <p className="text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-gray-700">${filters.minPrice}</span>{" – "}
                    <span className="font-semibold text-gray-700">${filters.maxPrice}</span>
                </p>
                <div className="space-y-1.5">
                    <input type="range" min={0} max={2000} step={10} value={filters.minPrice}
                        onChange={e => onChange({ minPrice: Math.min(Number(e.target.value), filters.maxPrice - 10) })}
                        className="w-full accent-[#006ce4]" />
                    <input type="range" min={0} max={2000} step={10} value={filters.maxPrice}
                        onChange={e => onChange({ maxPrice: Math.max(Number(e.target.value), filters.minPrice + 10) })}
                        className="w-full accent-[#006ce4]" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>$0</span><span>$2000</span>
                </div>
            </Section>

            <Section title="Rooms">
                <div className="space-y-2.5">
                    <CounterRow label="Bedrooms"  value={filters.bedrooms}  onChange={v => onChange({ bedrooms: v })} />
                    <CounterRow label="Bathrooms" value={filters.bathrooms} onChange={v => onChange({ bathrooms: v })} />
                </div>
            </Section>

            <Section title="Amenities">
                <div className="space-y-2">
                    {AMENITY_OPTIONS.map(a => (
                        <CheckRow key={a} label={a} checked={filters.amenities.includes(a)}
                            onChange={() => toggle("amenities", a)} count={amenityPool.filter(b => b.amenities?.includes(a)).length} />
                    ))}
                </div>
            </Section>

            <Section title="Travel group">
                <div className="flex flex-wrap gap-1.5">
                    {TRAVEL_GROUPS.map(g => (
                        <PillButton key={g} label={capitalize(g)} active={filters.travelGroups.includes(g)}
                            onClick={() => toggle("travelGroups", g)} />
                    ))}
                </div>
                <div className="mt-2 space-y-1">
                    {TRAVEL_GROUPS.map(g => (
                        <div key={g} className="flex justify-between text-xs text-gray-400">
                            <span>{capitalize(g)}</span>
                            <span>{groupPool.filter(b => b.travelGroups?.includes(g)).length}</span>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Availability">
                <CheckRow label="Available only" checked={filters.availableOnly}
                    onChange={() => onChange({ availableOnly: !filters.availableOnly })}
                    count={availPool.filter(b => b.isAvailable).length} />
            </Section>

            <div className="pb-2">
                <p className="text-xs font-semibold text-gray-600 mb-2">Rating</p>
                <div className="space-y-2">
                    {RATING_FILTERS.map(r => (
                        <CheckRow key={r.value} label={r.label}
                            checked={filters.minRating === r.value}
                            onChange={() => onChange({ minRating: filters.minRating === r.value ? 0 : r.value })}
                            count={ratingPool.filter(b => b.rating >= r.value).length} />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0 space-y-4">
                {content}
            </aside>

            {/* Mobile drawer overlay */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                    {/* Drawer */}
                    <div className="relative z-10 bg-white w-72 max-w-[85vw] h-full shadow-2xl p-4 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-base font-bold text-gray-800">Filters</p>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                                <X size={18} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {content}
                        </div>
                        <button onClick={onClose}
                            className="mt-3 w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                            Show results
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// ─── List Card (responsive horizontal → vertical on mobile) ──────────────────
function ListCard({ building }: { building: Building }) {
    const [saved, setSaved] = useState(false);
    const imageUrl = building.images?.[0]
        ? IMG(building.images[0])
        : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&q=80";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden">
            {/* Image */}
            <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0 h-52 sm:h-auto">
                <img src={imageUrl} alt={building.title} className="w-full h-full object-cover" />
                <button onClick={() => setSaved(!saved)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow">
                    <Heart size={16} fill={saved ? "#cc0000" : "none"} className={saved ? "text-red-500" : "text-gray-600"} />
                </button>
                {!building.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
                    </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    {/* Left: details */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer leading-tight">
                                {building.title}
                            </h3>
                            <span className="bg-amber-100 border border-amber-300 text-amber-700 text-xs px-1.5 py-0.5 rounded font-medium">
                                {capitalize(building.type)}
                            </span>
                            {building.brand && (
                                <span className="text-xs text-gray-400 font-medium">{building.brand}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[#006ce4] text-xs flex items-center gap-0.5">
                                <MapPin size={11} /> {building.location.city}, {building.location.country}
                            </span>
                            {building.location.address && (
                                <>
                                    <span className="text-gray-400 text-xs">·</span>
                                    <span className="text-gray-500 text-xs">{building.location.address}</span>
                                </>
                            )}
                        </div>

                        {building.sustainability && (
                            <div className="flex items-center gap-1 mt-1">
                                <Leaf size={12} className="text-[#008009]" />
                                <span className="text-xs text-[#008009]">Sustainability certified</span>
                            </div>
                        )}

                        {building.rooms && (
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                {building.rooms.bedrooms} Bedroom{building.rooms.bedrooms !== 1 ? "s" : ""} · {building.rooms.bathrooms} Bathroom{building.rooms.bathrooms !== 1 ? "s" : ""}
                                {building.maxGuests && <span className="text-gray-400 font-normal"> · max {building.maxGuests} guests</span>}
                            </p>
                        )}

                        {building.amenities && building.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {building.amenities.slice(0, 4).map(a => (
                                    <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
                                ))}
                                {building.amenities.length > 4 && (
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">+{building.amenities.length - 4} more</span>
                                )}
                            </div>
                        )}

                        {building.travelGroups && building.travelGroups.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                                {building.travelGroups.map(g => (
                                    <span key={g} className="text-[10px] bg-blue-50 text-[#006ce4] px-2 py-0.5 rounded-full border border-blue-100">
                                        {capitalize(g)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: score + price */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 w-full sm:w-auto flex-shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        {/* Score */}
                        <div className="flex items-center gap-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">{scoreLabel(building.rating)}</p>
                                <div className="flex items-center justify-end gap-1 mt-0.5">
                                    <Star size={11} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs text-gray-500">{building.rating}</span>
                                </div>
                            </div>
                            {/* Mobile: compact score */}
                            <div className="flex items-center gap-1 sm:hidden">
                                <Star size={12} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-gray-700">{building.rating}</span>
                                <span className="text-xs text-gray-400">· {scoreLabel(building.rating)}</span>
                            </div>
                            <ScoreBadge value={building.rating} />
                        </div>

                        {/* Price + button */}
                        <div className="text-right">
                            {building.minNights && building.minNights > 1 && (
                                <p className="text-xs text-gray-400">min {building.minNights} nights</p>
                            )}
                            <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                ${building.pricePerNight}
                                <Info size={13} className="text-gray-400" />
                            </p>
                            <p className="text-xs text-gray-500">per night</p>
                            <button disabled={!building.isAvailable}
                                className={`mt-2 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap ${
                                    building.isAvailable
                                        ? "bg-[#006ce4] hover:bg-[#0055b3] text-white"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}>
                                {building.isAvailable ? <>Check availability <ChevronRight size={13} /></> : "Not available"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Grid Card ────────────────────────────────────────────────────────────────
function GridCard({ building }: { building: Building }) {
    const [saved, setSaved] = useState(false);
    const imageUrl = building.images?.[0]
        ? IMG(building.images[0])
        : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=300&q=80";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
            <div className="relative h-44 flex-shrink-0">
                <img src={imageUrl} alt={building.title} className="w-full h-full object-cover" />
                <button onClick={() => setSaved(!saved)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow">
                    <Heart size={15} fill={saved ? "#cc0000" : "none"} className={saved ? "text-red-500" : "text-gray-600"} />
                </button>
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {capitalize(building.type)}
                </span>
                {!building.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col p-3 gap-1.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{building.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">· {scoreLabel(building.rating)}</span>
                    </div>
                    {building.sustainability && <Leaf size={12} className="text-[#008009]" />}
                </div>

                <h3 className="text-[#006ce4] font-bold text-sm hover:underline cursor-pointer leading-snug line-clamp-2">
                    {building.title}
                </h3>

                <div className="space-y-0.5">
                    {building.brand && <p className="text-[10px] text-gray-400 font-medium">{building.brand}</p>}
                    <p className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{building.location.city}, {building.location.country}</span>
                    </p>
                </div>

                {building.rooms && (
                    <p className="text-xs text-gray-600">
                        {building.rooms.bedrooms} bed · {building.rooms.bathrooms} bath
                        {building.maxGuests ? ` · ${building.maxGuests} guests` : ""}
                    </p>
                )}

                {building.amenities && building.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {building.amenities.slice(0, 3).map(a => (
                            <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{a}</span>
                        ))}
                        {building.amenities.length > 3 && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">+{building.amenities.length - 3}</span>
                        )}
                    </div>
                )}

                {building.travelGroups && building.travelGroups.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {building.travelGroups.map(g => (
                            <span key={g} className="text-[10px] bg-blue-50 text-[#006ce4] px-1.5 py-0.5 rounded-full border border-blue-100">
                                {capitalize(g)}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div>
                        {building.minNights && building.minNights > 1 && (
                            <p className="text-[10px] text-gray-400">min {building.minNights} nights</p>
                        )}
                        <p className="text-base font-bold text-gray-900 leading-none">${building.pricePerNight}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">per night</p>
                    </div>
                    <button disabled={!building.isAvailable}
                        className={`font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                            building.isAvailable
                                ? "bg-[#006ce4] hover:bg-[#0055b3] text-white"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}>
                        {building.isAvailable ? <>Book <ChevronRight size={12} /></> : "N/A"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SearchResults() {
    const [allBuildings, setAllBuildings] = useState<Building[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);
    const [filters, setFilters]           = useState<Filters>(DEFAULT_FILTERS);
    const [sortBy, setSortBy]             = useState<"rating" | "price_asc" | "price_desc">("rating");
    const [viewMode, setViewMode]         = useState<"list" | "grid">("list");
    const [sidebarOpen, setSidebarOpen]   = useState(false);

    // Mobile-da həmişə list mode
    useEffect(() => {
        const check = () => { if (window.innerWidth < 640) setViewMode("list"); };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const first = await api.get("/buildings", { params: { page: 1, limit: 100 } });
                const d = first.data;

                const extractItems = (payload: any): Building[] => {
                    if (Array.isArray(payload)) return payload;
                    for (const key of ["buildings", "data", "items", "results", "docs"]) {
                        if (Array.isArray(payload[key])) return payload[key];
                    }
                    return [];
                };

                const firstPage = extractItems(d);
                const total: number = d?.total ?? d?.totalCount ?? d?.count ?? d?.meta?.total ?? firstPage.length;

                if (firstPage.length >= total || !d?.page) {
                    setAllBuildings(firstPage);
                    return;
                }

                const pageSize   = firstPage.length;
                const totalPages = Math.ceil(total / pageSize);
                const rest = await Promise.all(
                    Array.from({ length: totalPages - 1 }, (_, i) =>
                        api.get("/buildings", { params: { page: i + 2, limit: pageSize } })
                            .then(r => extractItems(r.data))
                    )
                );
                setAllBuildings([...firstPage, ...rest.flat()]);
            } catch (err) {
                setError("Failed to load properties. Please try again.");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const displayed = useMemo(() => {
        let r = allBuildings;
        if (filters.types.length > 0)        r = r.filter(b => filters.types.includes(b.type));
        if (filters.brand.trim())             r = r.filter(b => b.brand?.toLowerCase().includes(filters.brand.toLowerCase()));
        if (filters.city.trim())              r = r.filter(b => b.location.city.toLowerCase().includes(filters.city.toLowerCase()));
        if (filters.country.trim())           r = r.filter(b => b.location.country.toLowerCase().includes(filters.country.toLowerCase()));
        r = r.filter(b => b.pricePerNight >= filters.minPrice && b.pricePerNight <= filters.maxPrice);
        if (filters.bedrooms > 0)             r = r.filter(b => (b.rooms?.bedrooms ?? 0) >= filters.bedrooms);
        if (filters.bathrooms > 0)            r = r.filter(b => (b.rooms?.bathrooms ?? 0) >= filters.bathrooms);
        if (filters.amenities.length > 0)     r = r.filter(b => filters.amenities.every(a => b.amenities?.includes(a)));
        if (filters.travelGroups.length > 0)  r = r.filter(b => filters.travelGroups.some(g => b.travelGroups?.includes(g)));
        if (filters.availableOnly)            r = r.filter(b => b.isAvailable);
        if (filters.minRating > 0)            r = r.filter(b => b.rating >= filters.minRating);
        return [...r].sort((a, b) => {
            if (sortBy === "price_asc")  return a.pricePerNight - b.pricePerNight;
            if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
            return b.rating - a.rating;
        });
    }, [allBuildings, filters, sortBy]);

    const handleChange = (p: Partial<Filters>) => setFilters(prev => ({ ...prev, ...p }));
    const resetFilters = () => setFilters(DEFAULT_FILTERS);

    const chips: { label: string; onRemove: () => void }[] = [
        ...filters.types.map(t => ({ label: capitalize(t), onRemove: () => handleChange({ types: filters.types.filter(x => x !== t) }) })),
        ...(filters.brand   ? [{ label: `Brand: ${filters.brand}`,     onRemove: () => handleChange({ brand: "" }) }] : []),
        ...(filters.city    ? [{ label: `City: ${filters.city}`,       onRemove: () => handleChange({ city: "" }) }] : []),
        ...(filters.country ? [{ label: `Country: ${filters.country}`, onRemove: () => handleChange({ country: "" }) }] : []),
        ...(filters.minPrice > 0 || filters.maxPrice < 2000
            ? [{ label: `$${filters.minPrice}–$${filters.maxPrice}`, onRemove: () => handleChange({ minPrice: 0, maxPrice: 2000 }) }]
            : []),
        ...(filters.bedrooms  > 0 ? [{ label: `${filters.bedrooms}+ bed`,   onRemove: () => handleChange({ bedrooms: 0 }) }] : []),
        ...(filters.bathrooms > 0 ? [{ label: `${filters.bathrooms}+ bath`, onRemove: () => handleChange({ bathrooms: 0 }) }] : []),
        ...filters.amenities.map(a => ({ label: a, onRemove: () => handleChange({ amenities: filters.amenities.filter(x => x !== a) }) })),
        ...filters.travelGroups.map(g => ({ label: capitalize(g), onRemove: () => handleChange({ travelGroups: filters.travelGroups.filter(x => x !== g) }) })),
        ...(filters.availableOnly ? [{ label: "Available only", onRemove: () => handleChange({ availableOnly: false }) }] : []),
        ...(filters.minRating > 0 ? [{ label: `Rating ${filters.minRating}+`, onRemove: () => handleChange({ minRating: 0 }) }] : []),
    ];

    const sortLabel = sortBy === "price_asc" ? "Price: low to high" : sortBy === "price_desc" ? "Price: high to low" : "Top rated";

    return (
        <div className="min-h-screen mt-14">
            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-[#006ce4] mb-4 flex-wrap">
                    {["Home", "Properties"].map((crumb, i, arr) => (
                        <span key={crumb} className="flex items-center gap-1.5">
                            <a href="#" className="hover:underline">{crumb}</a>
                            {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-400" />}
                        </span>
                    ))}
                    <ChevronRight size={12} className="text-gray-400" />
                    <span className="text-gray-500">Search results</span>
                </div>

                <div className="flex gap-6">
                    <Sidebar
                        filters={filters}
                        onChange={handleChange}
                        onReset={resetFilters}
                        allBuildings={allBuildings}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    <main className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                {filters.city || filters.country || "All properties"}:{" "}
                                <span className="font-normal">{loading ? "..." : `${displayed.length} found`}</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                {/* Mobile filter button */}
                                <button onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-700 hover:border-gray-400 transition-colors">
                                    <SlidersHorizontal size={13} />
                                    Filters
                                    {chips.length > 0 && (
                                        <span className="bg-[#006ce4] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {chips.length}
                                        </span>
                                    )}
                                </button>
                                {/* List/Grid toggle — desktop only */}
                                <button onClick={() => setViewMode("list")}
                                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === "list" ? "border-[#006ce4] text-[#006ce4] bg-blue-50" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"}`}>
                                    <LayoutList size={13} /> List
                                </button>
                                <button onClick={() => setViewMode("grid")}
                                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === "grid" ? "border-[#006ce4] text-[#006ce4] bg-blue-50" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"}`}>
                                    <LayoutGrid size={13} /> Grid
                                </button>
                            </div>
                        </div>

                        {/* Sort + chips */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <div className="relative group">
                                <button className="border border-gray-300 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 flex items-center gap-1.5">
                                    <ArrowUpDown size={12} /> Sort: {sortLabel}
                                </button>
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 hidden group-hover:block min-w-[180px]">
                                    {([["rating","Top rated"],["price_asc","Price: low to high"],["price_desc","Price: high to low"]] as const).map(([val, label]) => (
                                        <button key={val} onClick={() => setSortBy(val)}
                                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${sortBy === val ? "text-[#006ce4] font-semibold" : "text-gray-700"}`}>
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {chips.map(chip => (
                                <div key={chip.label} className="flex items-center gap-1.5 bg-white border border-[#006ce4] rounded-full px-3 py-1.5">
                                    <span className="text-xs font-medium text-gray-700">{chip.label}</span>
                                    <button onClick={chip.onRemove} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                                </div>
                            ))}

                            {chips.length > 0 && (
                                <button onClick={resetFilters} className="text-xs text-[#006ce4] hover:underline ml-1">Clear all</button>
                            )}
                        </div>

                        {/* Results */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-3">
                                <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                                <p className="text-sm text-gray-500">Loading properties...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20">
                                <p className="text-red-500 font-medium mb-2">{error}</p>
                                <button onClick={() => window.location.reload()} className="text-[#006ce4] text-sm hover:underline">Try again</button>
                            </div>
                        ) : displayed.length === 0 ? (
                            <div className="text-center py-20">
                                <SlidersHorizontal size={40} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No properties match your filters</p>
                                <button onClick={resetFilters} className="mt-3 text-[#006ce4] text-sm hover:underline">Reset filters</button>
                            </div>
                        ) : viewMode === "list" ? (
                            <div className="space-y-4">
                                {displayed.map(b => <ListCard key={b._id} building={b} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                                {displayed.map(b => <GridCard key={b._id} building={b} />)}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}