"use client";
import { MapPin, X } from "lucide-react";
import { Building, Filters } from "@/types/buildingFilter";
import {
    BUILDING_TYPES,
    TRAVEL_GROUPS,
    AMENITY_OPTIONS,
    RATING_FILTERS,
} from "@/lib/buildings/constants";
import { capitalize } from "@/lib/buildings/utils";
import { CheckRow } from "./CheckRow";
import { CounterRow } from "./CounterRow";
import { PillButton } from "./PillButton";
import { Section } from "./Section";

interface Props {
    filters: Filters;
    onChange: (f: Partial<Filters>) => void;
    onReset: () => void;
    allBuildings: Building[];
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ filters, onChange, onReset, allBuildings, open, onClose }: Props) {
    const pool = (exclude: keyof Filters) =>
        allBuildings.filter((b) => {
            if (exclude !== "types" && filters.types.length > 0 && !filters.types.includes(b.type)) return false;
            if (exclude !== "brand" && filters.brand.trim() && !b.brand?.toLowerCase().includes(filters.brand.toLowerCase())) return false;
            if (exclude !== "city" && filters.city.trim() && !b.location.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
            if (exclude !== "country" && filters.country.trim() && !b.location.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
            if (exclude !== "maxPrice" && b.pricePerNight > filters.maxPrice) return false;
            if (exclude !== "minPrice" && b.pricePerNight < filters.minPrice) return false;
            if (exclude !== "bedrooms" && filters.bedrooms > 0 && (b.rooms?.bedrooms ?? 0) < filters.bedrooms) return false;
            if (exclude !== "bathrooms" && filters.bathrooms > 0 && (b.rooms?.bathrooms ?? 0) < filters.bathrooms) return false;
            if (exclude !== "amenities" && filters.amenities.length > 0 && !filters.amenities.every(a => b.amenities?.includes(a))) return false;
            if (exclude !== "travelGroups" && filters.travelGroups.length > 0 && !filters.travelGroups.some(g => b.travelGroups?.includes(g))) return false;
            if (exclude !== "availableOnly" && filters.availableOnly && !b.isAvailable) return false;
            if (exclude !== "minRating" && filters.minRating > 0 && b.rating < filters.minRating) return false;
            return true;
        });

    const typePool = pool("types");
    const amenityPool = pool("amenities");
    const groupPool = pool("travelGroups");
    const ratingPool = pool("minRating");
    const availPool = pool("availableOnly");

    const toggle = (key: "types" | "amenities" | "travelGroups", val: string) => {
        const arr = filters[key] as string[];
        onChange({ [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] });
    };

    const content = (
        <div className="space-y-0 overflow-y-auto h-full pb-6">
            {/* Map */}
            <div className="rounded-xl overflow-hidden h-32 relative border border-gray-200 shadow-sm mb-3">
                <iframe
                    title="map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96058!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab9e7a7777c43%3A0x4c76cf3dcc8b330b!2sIstanbul%2C%20Turkey!5e0!3m2!1sen!2str!4v1620000000000"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                    <button className="bg-white border border-gray-300 shadow text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 hover:shadow-md whitespace-nowrap">
                        <MapPin size={11} className="text-[#006ce4]" /> Show on map
                    </button>
                </div>
            </div>

            {/* Card wrapper */}
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-800">Filter:</p>
                    <button onClick={onReset} className="text-xs text-[#006ce4] hover:text-blue-700 font-semibold">
                        Reset all
                    </button>
                </div>

                <div className="px-4">
                    <Section title="Property type">
                        {BUILDING_TYPES.map(t => (
                            <CheckRow
                                key={t}
                                label={capitalize(t)}
                                checked={filters.types.includes(t)}
                                onChange={() => toggle("types", t)}
                                count={typePool.filter(b => b.type === t).length}
                            />
                        ))}
                    </Section>

                    <Section title="Brand">
                        <input
                            type="text"
                            value={filters.brand}
                            onChange={e => onChange({ brand: e.target.value })}
                            placeholder="Hilton, Marriott..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors"
                        />
                    </Section>

                    <Section title="Location">
                        <input
                            type="text"
                            value={filters.city}
                            onChange={e => onChange({ city: e.target.value })}
                            placeholder="City"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors mb-2"
                        />
                        <input
                            type="text"
                            value={filters.country}
                            onChange={e => onChange({ country: e.target.value })}
                            placeholder="Country"
                            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#006ce4] transition-colors"
                        />
                    </Section>

                    <Section title="Budget (per night)">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-500">$0</span>
                            <span className="text-xs bg-blue-50 border border-blue-100 text-[#006ce4] font-semibold px-2 py-0.5 rounded-md">
                                up to ${filters.maxPrice}
                            </span>
                        </div>
                        <div className="relative h-5 flex items-center">
                            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
                            <div
                                className="absolute h-1.5 bg-[#006ce4] rounded-full pointer-events-none"
                                style={{ left: 0, right: `${100 - (filters.maxPrice / 2000) * 100}%` }}
                            />
                            <input
                                type="range" min={0} max={2000} step={10} value={filters.maxPrice}
                                onChange={e => onChange({ maxPrice: Number(e.target.value), minPrice: 0 })}
                                className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#006ce4]
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#006ce4]"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                            <span>$0</span><span>$2000</span>
                        </div>
                    </Section>

                    <Section title="Rooms">
                        <CounterRow label="Bedrooms" value={filters.bedrooms} onChange={v => onChange({ bedrooms: v })} />
                        <div className="mt-2.5">
                            <CounterRow label="Bathrooms" value={filters.bathrooms} onChange={v => onChange({ bathrooms: v })} />
                        </div>
                    </Section>

                    <Section title="Amenities">
                        {AMENITY_OPTIONS.map(a => (
                            <CheckRow
                                key={a}
                                label={a}
                                checked={filters.amenities.includes(a)}
                                onChange={() => toggle("amenities", a)}
                                count={amenityPool.filter(b => b.amenities?.includes(a)).length}
                            />
                        ))}
                    </Section>

                    <Section title="Travel group">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {TRAVEL_GROUPS.map(g => (
                                <PillButton
                                    key={g}
                                    label={capitalize(g)}
                                    active={filters.travelGroups.includes(g)}
                                    onClick={() => toggle("travelGroups", g)}
                                />
                            ))}
                        </div>
                        {TRAVEL_GROUPS.map(g => (
                            <CheckRow
                                key={g}
                                label={capitalize(g)}
                                checked={filters.travelGroups.includes(g)}
                                onChange={() => toggle("travelGroups", g)}
                                count={groupPool.filter(b => b.travelGroups?.includes(g)).length}
                            />
                        ))}
                    </Section>

                    <Section title="Availability">
                        <CheckRow
                            label="Available only"
                            checked={filters.availableOnly}
                            onChange={() => onChange({ availableOnly: !filters.availableOnly })}
                            count={availPool.filter(b => b.isAvailable).length}
                        />
                    </Section>

                    <Section title="Rating">
                        {RATING_FILTERS.map(r => (
                            <CheckRow
                                key={r.value}
                                label={r.label}
                                checked={filters.minRating === r.value}
                                onChange={() => onChange({ minRating: filters.minRating === r.value ? 0 : r.value })}
                                count={ratingPool.filter(b => b.rating >= r.value).length}
                            />
                        ))}
                    </Section>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop */}
            <aside className="hidden lg:block w-67 shrink-0 self-start sticky top-4">
                {content}
            </aside>

            {/* Mobile drawer */}
            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                    <div className="relative z-10 bg-white w-72 max-w-[85vw] h-full shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                            <p className="text-base font-bold text-gray-800">Filters</p>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                                <X size={18} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4">{content}</div>
                        <div className="px-4 py-4 border-t border-gray-100">
                            <button
                                onClick={onClose}
                                className="w-full bg-[#006ce4] hover:bg-[#0055b3] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                            >
                                Show results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}