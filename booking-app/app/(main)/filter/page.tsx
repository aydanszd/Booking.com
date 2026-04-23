"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filters } from "@/types/buildingFilter";
import { DEFAULT_FILTERS } from "@/lib/buildings/constants";
import { capitalize } from "@/lib/buildings/utils";
import { useBuildingsList } from "@/hooks/useBuildingsList";
import { Sidebar } from "@/components/filters/Sidebar";
import FilterBreadcrumb from "@/components/filter/FilterBreadcrumb";
import FilterToolbar from "@/components/filter/FilterToolbar";
import SortBar from "@/components/filter/SortBar";
import ResultsArea from "@/components/filter/ResultsArea";
import FilterPagination from "@/components/filter/FilterPagination";
const LIMIT = 6;
export default function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const { allBuildings, loading, error } = useBuildingsList();

    const [filters, setFilters] = useState<Filters>(() => ({
        ...DEFAULT_FILTERS,
        city: searchParams.get("city") || "",
    }));
    const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);

    useEffect(() => {
        const p = Number(searchParams.get("page")) || 1;
        setPage(p);
    }, []);

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

    const totalPages = Math.ceil(displayed.length / LIMIT);
    const paginatedItems = displayed.slice((page - 1) * LIMIT, page * LIMIT);

    const chips = [
        ...filters.types.map(t => ({ label: capitalize(t), onRemove: () => handleChange({ types: filters.types.filter(x => x !== t) }) })),
        ...(filters.brand ? [{ label: `Brand: ${filters.brand}`, onRemove: () => handleChange({ brand: "" }) }] : []),
        ...(filters.city ? [{ label: `City: ${filters.city}`, onRemove: () => handleChange({ city: "" }) }] : []),
        ...(filters.country ? [{ label: `Country: ${filters.country}`, onRemove: () => handleChange({ country: "" }) }] : []),
        ...(filters.minPrice > 0 || filters.maxPrice < 10000 ? [{ label: `$${filters.minPrice}–$${filters.maxPrice}`, onRemove: () => handleChange({ minPrice: 0, maxPrice: 10000 }) }] : []),
        ...(filters.bedrooms > 0 ? [{ label: `${filters.bedrooms}+ bed`, onRemove: () => handleChange({ bedrooms: 0 }) }] : []),
        ...(filters.bathrooms > 0 ? [{ label: `${filters.bathrooms}+ bath`, onRemove: () => handleChange({ bathrooms: 0 }) }] : []),
        ...filters.amenities.map(a => ({ label: a, onRemove: () => handleChange({ amenities: filters.amenities.filter(x => x !== a) }) })),
        ...filters.travelGroups.map(g => ({ label: capitalize(g), onRemove: () => handleChange({ travelGroups: filters.travelGroups.filter(x => x !== g) }) })),
        ...(filters.availableOnly ? [{ label: "Available only", onRemove: () => handleChange({ availableOnly: false }) }] : []),
        ...(filters.minRating > 0 ? [{ label: `Rating ${filters.minRating}+`, onRemove: () => handleChange({ minRating: 0 }) }] : []),
    ];

    return (
        <div className="min-h-screen mt-14">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <FilterBreadcrumb />

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
                        <FilterToolbar
                            city={filters.city}
                            country={filters.country}
                            count={displayed.length}
                            loading={loading}
                            viewMode={viewMode}
                            chipsCount={chips.length}
                            onViewMode={setViewMode}
                            onOpenSidebar={() => setSidebarOpen(true)}
                        />

                        <SortBar
                            sortBy={sortBy}
                            chips={chips}
                            onSortChange={setSortBy}
                            onClearAll={resetFilters}
                        />

                        <ResultsArea
                            loading={loading}
                            error={error}
                            viewMode={viewMode}
                            items={paginatedItems}
                            onReset={resetFilters}
                        />

                        <FilterPagination
                            page={page}
                            totalPages={totalPages}
                            totalCount={displayed.length}
                            limit={LIMIT}
                            onPageChange={updatePage}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}
