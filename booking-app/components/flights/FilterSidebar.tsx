'use client'

import { useTranslations } from 'next-intl'
import type { Filters } from '@/types/flight'
import { DEFAULT_FILTERS } from '@/types/flight'
import FilterSection from './FilterSection'
import RangeSlider from './RangeSlider'

interface Props {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
    airlines: string[]
    origins: string[]
    destinations: string[]
}

export default function FilterSidebar({ filters, setFilters, airlines, origins, destinations }: Props) {
    const t = useTranslations('flights')

    const toggleStop = (val: string) =>
        setFilters(f => ({ ...f, stops: f.stops.includes(val) ? f.stops.filter(s => s !== val) : [...f.stops, val] }))

    const toggleCabin = (val: string) =>
        setFilters(f => ({ ...f, cabin: f.cabin.includes(val) ? f.cabin.filter(c => c !== val) : [...f.cabin, val] }))

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-500 text-base">✦</span>
                        <h3 className="text-sm font-semibold text-gray-800">{t('smartFilters')}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                        {t('aiPowered')}{' '}
                        <span className="text-blue-500 cursor-pointer hover:underline">{t('learnMore')}</span>
                    </p>
                    <textarea className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-400 h-20 placeholder:text-gray-400"
                        placeholder={t('filterPlaceholder')} />
                    <button className="mt-2 w-full text-xs font-medium text-gray-400 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">
                        {t('filterFlights')}
                    </button>
                </div>

                <FilterSection title={t('stopsFilter')}>
                    <div className="space-y-1.5">
                        {[
                            { val: 'direct', labelKey: 'directFlight' },
                            { val: '1stop',  labelKey: 'oneStopLabel' },
                            { val: '2stop',  labelKey: 'twoStopsLabel' },
                        ].map(item => (
                            <label key={item.val} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={filters.stops.includes(item.val)} onChange={() => toggleStop(item.val)} className="w-4 h-4 rounded accent-blue-500" />
                                <span className="text-sm text-gray-700">{t(item.labelKey as any)}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <FilterSection title={t('airlines')}>
                    <div className="flex gap-2 mb-2 text-xs">
                        <button onClick={() => setFilters(f => ({ ...f, airline: '' }))} className="text-blue-500 hover:underline">
                            {t('selectAll')}
                        </button>
                    </div>
                    <select value={filters.airline} onChange={e => setFilters(f => ({ ...f, airline: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                        <option value="">{t('allAirlines')}</option>
                        {airlines.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                </FilterSection>

                <FilterSection title={t('airports')} defaultOpen={false}>
                    <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-500 mb-1">{t('originFilter')}</p>
                        <select value={filters.origin} onChange={e => setFilters(f => ({ ...f, origin: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                            <option value="">{t('allOption')}</option>
                            {origins.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">{t('destinationFilter')}</p>
                        <select value={filters.destination} onChange={e => setFilters(f => ({ ...f, destination: e.target.value }))}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 bg-white">
                            <option value="">{t('allOption')}</option>
                            {destinations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </FilterSection>

                <FilterSection title={t('priceFilter')}>
                    <RangeSlider min={0} max={5000} value={filters.maxPrice}
                        onChange={v => setFilters(f => ({ ...f, maxPrice: v }))}
                        format={v => `$${v.toLocaleString()}`} />
                </FilterSection>

                <FilterSection title={t('cabinFilter')}>
                    <div className="space-y-1.5">
                        {[
                            { key: 'economy',         labelKey: 'economy' },
                            { key: 'premium_economy', labelKey: 'premiumEconomy' },
                            { key: 'business',        labelKey: 'business' },
                            { key: 'first',           labelKey: 'first' },
                        ].map(c => (
                            <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={filters.cabin.includes(c.key)} onChange={() => toggleCabin(c.key)} className="w-4 h-4 rounded accent-blue-500" />
                                <span className="text-sm text-gray-700">{t(c.labelKey as any)}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>

                <div className="border-t border-gray-100 pt-4">
                    <button onClick={() => setFilters(DEFAULT_FILTERS)} className="w-full text-xs text-blue-500 hover:underline">
                        {t('resetFilters')}
                    </button>
                </div>
            </div>
        </aside>
    )
}
