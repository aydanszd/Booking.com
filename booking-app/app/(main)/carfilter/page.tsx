'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { carFilterApi } from '@/api/carFilterApi'
import { applyFilters, CAR_CATEGORIES } from '@/components/carFilter/constants'
import { EMPTY_FILTERS } from '@/types/carFilter'
import type { ActiveFilters } from '@/types/carFilter'
import type { CarType } from '@/types/car'
import FilterSidebar from '@/components/carFilter/FilterSidebar'
import CarFilterToolbar from '@/components/carFilter/CarFilterToolbar'
import CategoryPills from '@/components/carFilter/CategoryPills'
import FilterChips from '@/components/carFilter/FilterChips'
import GeniusBanner from '@/components/carFilter/GeniusBanner'
import ListCard from '@/components/carFilter/ListCard'
import GridCard from '@/components/carFilter/GridCard'
import EmptyState from '@/components/carFilter/EmptyState'
import CarPagination from '@/components/carFilter/CarPagination'

const LIMIT = 20

export default function CarRentalPage() {
    const router = useRouter()

    const [allCars, setAllCars] = useState<CarType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)

    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState('Önerilen')
    const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    const goToDetail = (id: string) => router.push(`/cardetails?id=${id}`)

    useEffect(() => {
        const check = () => { if (window.innerWidth < 640) setViewMode('list') }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const fetchCars = useCallback(async () => {
        setLoading(true); setError(null)
        try {
            const res = await carFilterApi.getAll({ page, limit: LIMIT, category: activeCategory ?? undefined })
            setAllCars(res.cars); setTotal(res.total)
        } catch (e: any) {
            setError(e.message || 'Xəta baş verdi')
        } finally {
            setLoading(false)
        }
    }, [page, activeCategory])

    useEffect(() => { fetchCars() }, [fetchCars])

    const displayedCars = useMemo(() => {
        let cars = applyFilters(allCars, filters)
        if (sortOrder === 'Fiyat: Artan') cars = [...cars].sort((a, b) => a.pricePerDay - b.pricePerDay)
        else if (sortOrder === 'Fiyat: Azalan') cars = [...cars].sort((a, b) => b.pricePerDay - a.pricePerDay)
        else if (sortOrder === 'Değerlendirme') cars = [...cars].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        return cars
    }, [allCars, filters, sortOrder])

    const totalPages = Math.ceil(total / LIMIT)

    const handleCategoryNav = (value: string) => {
        const next = activeCategory === value ? null : value
        setActiveCategory(next); setPage(1)
        setFilters(f => ({ ...f, categories: next ? [next] : [] }))
    }

    const handleFiltersChange = (f: ActiveFilters) => {
        setFilters(f)
        if (f.categories.length === 1 && f.categories[0] !== activeCategory) { setActiveCategory(f.categories[0]); setPage(1) }
        else if (f.categories.length === 0 && activeCategory) { setActiveCategory(null); setPage(1) }
    }

    const clearAll = () => { setFilters(EMPTY_FILTERS); setActiveCategory(null); setPage(1) }

    const filterChips = [
        ...filters.categories.map(v => ({
            label: CAR_CATEGORIES.find(c => c.value === v)?.label ?? v,
            onRemove: () => handleFiltersChange({ ...filters, categories: filters.categories.filter(x => x !== v) }),
        })),
        ...filters.transmissions.map(v => ({
            label: v === 'automatic' ? 'Otomatik' : 'Manuel',
            onRemove: () => handleFiltersChange({ ...filters, transmissions: filters.transmissions.filter(x => x !== v) }),
        })),
        ...filters.availability.map(v => ({
            label: v === 'available' ? 'Mövcud' : 'İcarədə',
            onRemove: () => handleFiltersChange({ ...filters, availability: filters.availability.filter(x => x !== v) }),
        })),
        ...filters.seats.map(v => ({ label: v, onRemove: () => handleFiltersChange({ ...filters, seats: filters.seats.filter(x => x !== v) }) })),
        ...filters.priceRanges.map(v => ({ label: v, onRemove: () => handleFiltersChange({ ...filters, priceRanges: filters.priceRanges.filter(x => x !== v) }) })),
        ...filters.ratings.map(v => ({ label: v, onRemove: () => handleFiltersChange({ ...filters, ratings: filters.ratings.filter(x => x !== v) }) })),
    ]

    return (
        <div className="min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap');
                h1, h2, h3 { font-family: 'Sora', sans-serif; }
            `}</style>

            <div className="max-w-6xl mx-auto px-4 py-6 mt-14">
                <div className="flex gap-6">
                    <FilterSidebar filters={filters} onChange={handleFiltersChange} onReset={clearAll}
                        open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                    <main className="flex-1 min-w-0">
                        <CarFilterToolbar
                            count={displayedCars.length}
                            loading={loading}
                            viewMode={viewMode}
                            sortOrder={sortOrder}
                            filterChipsCount={filterChips.length}
                            onViewMode={setViewMode}
                            onSort={setSortOrder}
                            onOpenSidebar={() => setSidebarOpen(true)}
                        />

                        <CategoryPills activeCategory={activeCategory} onSelect={handleCategoryNav} />

                        <FilterChips chips={filterChips} onClearAll={clearAll} />

                        <GeniusBanner />

                        {loading ? (
                            <div className="flex items-center justify-center py-24 bg-white rounded-xl border border-gray-200">
                                <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                                <span className="ml-3 text-gray-500 text-sm">Arabalar yükleniyor...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                                <p className="text-red-500 font-semibold">{error}</p>
                                <button onClick={fetchCars} className="mt-3 text-sm text-blue-600 hover:underline">Tekrar dene</button>
                            </div>
                        ) : displayedCars.length === 0 ? (
                            <EmptyState onReset={clearAll} />
                        ) : viewMode === 'list' ? (
                            <div className="space-y-3">
                                {displayedCars.map(car => <ListCard key={car._id} car={car} onNavigate={goToDetail} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                                {displayedCars.map(car => <GridCard key={car._id} car={car} onNavigate={goToDetail} />)}
                            </div>
                        )}

                        {!loading && <CarPagination page={page} totalPages={totalPages} onPageChange={setPage} />}
                    </main>
                </div>
            </div>
        </div>
    )
}
