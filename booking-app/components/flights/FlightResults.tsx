'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { FlightType, FetchFlightsResponse, Filters } from '@/types/flight'
import { DEFAULT_FILTERS } from '@/types/flight'
import { BASE } from '@/utils/imageUrl'
import SearchHeader from './SearchHeader'
import FilterSidebar from './FilterSidebar'
import SortTabs from './SortTabs'
import FlightCard from './FlightCard'

const API = `${BASE}/api/flights`

async function fetchFlightsApi(params: Record<string, string>): Promise<FetchFlightsResponse> {
    const p = new URLSearchParams(params)
    const res = await fetch(`${API}?${p}`)
    if (!res.ok) throw new Error('Failed to load flights')
    return res.json()
}

const LIMIT = 10

export default function FlightResults() {
    const t = useTranslations('flights')
    const [flights, setFlights] = useState<FlightType[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
    const [allAirlines, setAllAirlines] = useState<string[]>([])
    const [allOrigins, setAllOrigins] = useState<string[]>([])
    const [allDests, setAllDests] = useState<string[]>([])

    const fetchFlights = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params: Record<string, string> = { page: String(page), limit: String(LIMIT) }
            if (filters.airline) params.airline = filters.airline
            if (filters.origin) params.origin = filters.origin
            if (filters.destination) params.destination = filters.destination
            if (filters.cabin.length === 1) params.cabin = filters.cabin[0]

            const data = await fetchFlightsApi(params)
            let result = data.flights

            if (filters.stops.length > 0) {
                result = result.filter(f => {
                    const sc = f.stops?.length ?? 0
                    if (filters.stops.includes('direct') && sc === 0) return true
                    if (filters.stops.includes('1stop') && sc === 1) return true
                    if (filters.stops.includes('2stop') && sc >= 2) return true
                    return false
                })
            }

            result = result.filter(f => f.price >= filters.minPrice && f.price <= filters.maxPrice)
            result = [...result].sort((a, b) => {
                if (filters.sortBy === 'price_asc') return a.price - b.price
                if (filters.sortBy === 'price_desc') return b.price - a.price
                if (filters.sortBy === 'duration') return a.duration - b.duration
                if (filters.sortBy === 'quality') return (b.flightQuality ?? 0) - (a.flightQuality ?? 0)
                return 0
            })

            setFlights(result)
            setTotal(data.total)

            if (allAirlines.length === 0 && data.flights.length > 0) {
                setAllAirlines([...new Set(data.flights.map(f => f.airline))].filter(Boolean))
                setAllOrigins([...new Set(data.flights.map(f => f.origin?.code))].filter(Boolean) as string[])
                setAllDests([...new Set(data.flights.map(f => f.destination?.code))].filter(Boolean) as string[])
            }
        } catch (e: any) {
            setError(e.message || t('searchingError'))
        } finally {
            setLoading(false)
        }
    }, [page, filters])

    useEffect(() => { fetchFlights() }, [fetchFlights])

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
                                <span className="text-gray-400"> / {t('flightsCount', { count: total })}</span>
                            </p>
                            {loading && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {t('loadingFlights')}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <SortTabs active={filters.sortBy} onChange={v => setFilters(f => ({ ...f, sortBy: v }))} />
                        </div>
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                                <button onClick={fetchFlights} className="text-xs text-red-500 hover:underline mt-1">{t('tryAgain')}</button>
                            </div>
                        )}
                        {!loading && !error && flights.length === 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
                                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <p className="text-gray-400 text-sm">{t('noFlights')}</p>
                                <button onClick={() => setFilters(f => ({ ...f, cabin: [], stops: [], airline: '', maxPrice: 5000 }))}
                                    className="mt-3 text-xs text-blue-500 hover:underline">
                                    {t('resetFilters')}
                                </button>
                            </div>
                        )}
                        {loading && flights.length === 0 && (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
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
                                {flights.map(f => <FlightCard key={f._id} flight={f} />)}
                            </div>
                        )}
                        {total > LIMIT && (
                            <div className="flex items-center justify-center gap-2 mt-5">
                                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                                    {t('prevPage')}
                                </button>
                                <span className="text-sm text-gray-500 px-2">{t('pageNum', { num: page })}</span>
                                <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                                    {t('nextPage')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
