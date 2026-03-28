'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Checkbox from './Checkbox'
import FilterSection from './FilterSection'
import {
    SUPPLIERS, LOCATIONS_FILTER, CAR_CATEGORIES, PRICE_RANGES,
    RATINGS_FILTER, TRANSMISSIONS, AVAILABILITY, SEATS, FEATURES_FILTER,
} from './constants'
import type { ActiveFilters } from '@/types/carFilter'

interface Props {
    filters: ActiveFilters
    onChange: (f: ActiveFilters) => void
    onReset: () => void
}

export default function SidebarInner({ filters, onChange }: Props) {
    const [suppExpanded, setSuppExpanded] = useState(false)
    const visibleSuppliers = suppExpanded ? SUPPLIERS : SUPPLIERS.slice(0, 4)

    const toggle = (key: keyof ActiveFilters, value: string) => {
        const arr = filters[key] as string[]
        onChange({ ...filters, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] })
    }

    return (
        <>
            <FilterSection title="Konum">
                {LOCATIONS_FILTER.map(({ label, count }) => (
                    <Checkbox key={label} checked={false} onChange={() => {}} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Vites">
                {TRANSMISSIONS.map(({ label, value, count }) => (
                    <Checkbox key={value} checked={filters.transmissions.includes(value)}
                        onChange={() => toggle('transmissions', value)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Tedarikçi">
                {visibleSuppliers.map(({ name, count }) => (
                    <Checkbox key={name} checked={false} onChange={() => {}} label={name} count={count} />
                ))}
                <button onClick={() => setSuppExpanded(!suppExpanded)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5">
                    {suppExpanded ? 'Daha az göster' : `Tümünü göster (${SUPPLIERS.length})`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${suppExpanded ? 'rotate-180' : ''}`} />
                </button>
            </FilterSection>
            <FilterSection title="Müsaitlik">
                {AVAILABILITY.map(({ label, value, count }) => (
                    <Checkbox key={value} checked={filters.availability.includes(value)}
                        onChange={() => toggle('availability', value)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Araba kategorisi">
                {CAR_CATEGORIES.map(({ label, value, count }) => (
                    <Checkbox key={value} checked={filters.categories.includes(value)}
                        onChange={() => toggle('categories', value)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Günlük fiyat">
                {PRICE_RANGES.map(({ label, count }) => (
                    <Checkbox key={label} checked={filters.priceRanges.includes(label)}
                        onChange={() => toggle('priceRanges', label)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Koltuk sayısı">
                {SEATS.map(({ label, count }) => (
                    <Checkbox key={label} checked={filters.seats.includes(label)}
                        onChange={() => toggle('seats', label)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Değerlendirme">
                {RATINGS_FILTER.map(({ label, count }) => (
                    <Checkbox key={label} checked={filters.ratings.includes(label)}
                        onChange={() => toggle('ratings', label)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Araç özellikleri">
                {FEATURES_FILTER.map(({ label, count }) => (
                    <Checkbox key={label} checked={false} onChange={() => {}} label={label} count={count} />
                ))}
            </FilterSection>
        </>
    )
}
