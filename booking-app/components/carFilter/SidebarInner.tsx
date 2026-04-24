'use client'

import Checkbox from './Checkbox'
import FilterSection from './FilterSection'
import {
    CAR_CATEGORIES, PRICE_RANGES,
    RATINGS_FILTER, TRANSMISSIONS, AVAILABILITY, SEATS,
} from './constants'
import type { ActiveFilters } from '@/types/carFilter'

interface Props {
    filters: ActiveFilters
    onChange: (f: ActiveFilters) => void
    onReset: () => void
}

export default function SidebarInner({ filters, onChange }: Props) {
    const toggle = (key: keyof ActiveFilters, value: string) => {
        const arr = filters[key] as string[]
        onChange({ ...filters, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] })
    }

    return (
        <>
            <FilterSection title="Vites">
                {TRANSMISSIONS.map(({ label, value, count }) => (
                    <Checkbox key={value} checked={filters.transmissions.includes(value)}
                        onChange={() => toggle('transmissions', value)} label={label} count={count} />
                ))}
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
        </>
    )
}
