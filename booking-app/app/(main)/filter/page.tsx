"use client";
import { useState, useEffect, useMemo } from "react";
import {
    ArrowUpDown, X, LayoutList, LayoutGrid,
    ChevronRight, Loader2, SlidersHorizontal, ChevronLeft,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { Filters } from "@/types/user-front/buildingsfilter";
import { DEFAULT_FILTERS } from "@/const/user-front/buildingsfilter";
import { capitalize } from "@/utils/user-front/buildingsfilter";
import { useBuildings } from "@/api/user-front/buildingsfilter";
import { Sidebar } from "@/components/buildingsfilter/Sidebar";
import { ListCard } from "@/components/cards/ListCard";
import { GridCard } from "@/components/cards/GridCard";

const LIMIT = 6;

export default function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { allBuildings, loading, error } = useBuildings();

    const [filters, setFilters] = useState<Filters>(() => ({
        ...DEFAULT_FILTERS,
        city: searchParams.get("city") || "",
    }));
    const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

    // Sync page from URL on mount
    useEffect(() => {
        const p = Number(searchParams.get("page")) || 1;
        setPage(p);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Force list on mobile
    useEffect(() => {
        const check = () => { if (window.innerWidth < 640) setViewMode("list"); };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const updatePage = (p: number) => {
        setPage(p);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", p.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handleChange = (partial: Partial<Filters>) => {
        setFilters(prev => ({ ...prev, ...partial }));
        setPage(1);
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    };

    // ── Filtering + sorting ────────────────────────────────────────────────────
    const displayed = useMemo(() => {
        let r = allBuildings;
        if (filters.types.length > 0) r = r.filter(b => filters.types.includes(b.type));
        if (filters.brand.trim()) r = r.filter(b => b.brand?.toLowerCase().includes(filters.brand.toLowerCase()));
        if (filters.city.trim()) r = r.filter(b => b.location.city.toLowerCase().includes(filters.city.toLowerCase()));
        if (filters.country.trim()) r = r.filter(b => b.location.country.toLowerCase().includes(filters.country.toLowerCase()));
        r = r.filter(b => b.pricePerNight >= filters.minPrice && b.pricePerNight <= filters.maxPrice);
        if (filters.bedrooms > 0) r = r.filter(b => (b.rooms?.bedrooms ?? 0) >= filters.bedrooms);
        if (filters.bathrooms > 0) r = r.filter(b => (b.rooms?.bathrooms ?? 0) >= filters.bathrooms);
        if (filters.amenities.length > 0) r = r.filter(b => filters.amenities.every(a => b.amenities?.includes(a)));
        if (filters.travelGroups.length > 0) r = r.filter(b => filters.travelGroups.some(g => b.travelGroups?.includes(g)));
        if (filters.availableOnly) r = r.filter(b => b.isAvailable);
        if (filters.minRating > 0) r = r.filter(b => b.rating >= filters.minRating);

        return [...r].sort((a, b) => {
            if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
            if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
            return b.rating - a.rating;
        });
    }, [allBuildings, filters, sortBy]);

    // ── Pagination ─────────────────────────────────────────────────────────────
    const totalPages = Math.ceil(displayed.length / LIMIT);
    const paginatedItems = displayed.slice((page - 1) * LIMIT, page * LIMIT);

    const getPageRange = (): (number | string)[] => {
        const delta = 2;
        const range: (number | string)[] = [];
        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }
        if (page - delta > 2) range.unshift("...");
        range.unshift(1);
        if (page + delta < totalPages - 1) range.push("...");
        if (totalPages > 1) range.push(totalPages);
        return range;
    };

    // ── Active filter chips ────────────────────────────────────────────────────
    const chips: { label: string; onRemove: () => void }[] = [
        ...filters.types.map(t => ({
            label: capitalize(t),
            onRemove: () => handleChange({ types: filters.types.filter(x => x !== t) }),
        })),
        ...(filters.brand ? [{ label: `Brand: ${filters.brand}`, onRemove: () => handleChange({ brand: "" }) }] : []),
        ...(filters.city ? [{ label: `City: ${filters.city}`, onRemove: () => handleChange({ city: "" }) }] : []),
        ...(filters.country ? [{ label: `Country: ${filters.country}`, onRemove: () => handleChange({ country: "" }) }] : []),
        ...(filters.minPrice > 0 || filters.maxPrice < 2000
            ? [{ label: `$${filters.minPrice}–$${filters.maxPrice}`, onRemove: () => handleChange({ minPrice: 0, maxPrice: 2000 }) }]
            : []),
        ...(filters.bedrooms > 0 ? [{ label: `${filters.bedrooms}+ bed`, onRemove: () => handleChange({ bedrooms: 0 }) }] : []),
        ...(filters.bathrooms > 0 ? [{ label: `${filters.bathrooms}+ bath`, onRemove: () => handleChange({ bathrooms: 0 }) }] : []),
        ...filters.amenities.map(a => ({
            label: a,
            onRemove: () => handleChange({ amenities: filters.amenities.filter(x => x !== a) }),
        })),
        ...filters.travelGroups.map(g => ({
            label: capitalize(g),
            onRemove: () => handleChange({ travelGroups: filters.travelGroups.filter(x => x !== g) }),
        })),
        ...(filters.availableOnly ? [{ label: "Available only", onRemove: () => handleChange({ availableOnly: false }) }] : []),
        ...(filters.minRating > 0 ? [{ label: `Rating ${filters.minRating}+`, onRemove: () => handleChange({ minRating: 0 }) }] : []),
    ];

    const sortLabel =
        sortBy === "price_asc" ? "Price: low to high" :
            sortBy === "price_desc" ? "Price: high to low" : "Top rated";

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
                    {/* Sidebar */}
                    <Sidebar
                        filters={filters}
                        onChange={handleChange}
                        onReset={resetFilters}
                        allBuildings={allBuildings}
                        open={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />

                    <main className="flex-1 min-w-0">
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                {filters.city || filters.country || "All properties"}:{" "}
                                <span className="font-normal">{loading ? "..." : `${displayed.length} found`}</span>
                            </h1>

                            <div className="flex items-center gap-2">
                                {/* Mobile filter button */}
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-700 hover:border-gray-400 transition-colors"
                                >
                                    <SlidersHorizontal size={13} />
                                    Filters
                                    {chips.length > 0 && (
                                        <span className="bg-[#006ce4] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {chips.length}
                                        </span>
                                    )}
                                </button>

                                {/* List / Grid toggle */}
                                {(["list", "grid"] as const).map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setViewMode(mode)}
                                        className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === mode
                                                ? "border-[#006ce4] text-[#006ce4] bg-blue-50"
                                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                            }`}
                                    >
                                        {mode === "list" ? <LayoutList size={13} /> : <LayoutGrid size={13} />}
                                        {capitalize(mode)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort + chips */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <div className="relative group">
                                <button
                                    type="button"
                                    className="border border-gray-300 bg-white rounded-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 flex items-center gap-1.5"
                                >
                                    <ArrowUpDown size={12} /> Sort: {sortLabel}
                                </button>
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 hidden group-hover:block min-w-[180px]">
                                    {(
                                        [
                                            ["rating", "Top rated"],
                                            ["price_asc", "Price: low to high"],
                                            ["price_desc", "Price: high to low"],
                                        ] as const
                                    ).map(([val, label]) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setSortBy(val)}
                                            className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${sortBy === val ? "text-[#006ce4] font-semibold" : "text-gray-700"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {chips.map(chip => (
                                <div
                                    key={chip.label}
                                    className="flex items-center gap-1.5 bg-white border border-[#006ce4] rounded-full px-3 py-1.5"
                                >
                                    <span className="text-xs font-medium text-gray-700">{chip.label}</span>
                                    <button type="button" onClick={chip.onRemove} className="text-gray-400 hover:text-gray-600">
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}

                            {chips.length > 0 && (
                                <button type="button" onClick={resetFilters} className="text-xs text-[#006ce4] hover:underline ml-1">
                                    Clear all
                                </button>
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
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="text-[#006ce4] text-sm hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : displayed.length === 0 ? (
                            <div className="text-center py-20">
                                <SlidersHorizontal size={40} className="text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">No properties match your filters</p>
                                <button type="button" onClick={resetFilters} className="mt-3 text-[#006ce4] text-sm hover:underline">
                                    Reset filters
                                </button>
                            </div>
                        ) : (
                            <>
                                {viewMode === "list" ? (
                                    <div className="space-y-4">
                                        {paginatedItems.map(b => <ListCard key={b._id} building={b} />)}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                                        {paginatedItems.map(b => <GridCard key={b._id} building={b} />)}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-500 order-2 sm:order-1">
                                            Showing{" "}
                                            <span className="font-semibold text-gray-900">
                                                {Math.min((page - 1) * LIMIT + 1, displayed.length)}
                                            </span>
                                            {" – "}
                                            <span className="font-semibold text-gray-900">
                                                {Math.min(page * LIMIT, displayed.length)}
                                            </span>
                                            {" of "}
                                            <span className="font-semibold text-gray-900">{displayed.length}</span>
                                            {" properties"}
                                        </p>

                                        <div className="flex items-center gap-1.5 order-1 sm:order-2">
                                            <button
                                                type="button"
                                                onClick={() => updatePage(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {getPageRange().map((p, i) =>
                                                    p === "..." ? (
                                                        <span key={`els-${i}`} className="px-1.5 text-gray-400">...</span>
                                                    ) : (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => updatePage(Number(p))}
                                                            className={`w-9 h-9 rounded-full text-sm font-semibold transition-all ${page === Number(p)
                                                                    ? "bg-[#006ce4] text-white shadow-md shadow-blue-200"
                                                                    : "text-gray-500 hover:bg-gray-100"
                                                                }`}
                                                        >
                                                            {p}
                                                        </button>
                                                    )
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => updatePage(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className="p-2 rounded-full border border-gray-200 text-gray-500 hover:border-[#006ce4] hover:text-[#006ce4] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}