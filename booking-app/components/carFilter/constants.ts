import type { CarType } from '@/types/car'
import type { ActiveFilters } from '@/types/carFilter'

export const SUPPLIERS = [
    { name: 'Europcar', count: 143 },
    { name: 'Flex To Go', count: 48 },
    { name: 'Green Motion', count: 7 },
    { name: 'Hertz', count: 18 },
    { name: 'Sixt', count: 562 },
    { name: 'Budget', count: 34 },
]

export const LOCATIONS_FILTER = [
    { label: 'Havaalanı (terminal)', count: 162 },
    { label: 'Havaalanı (servis aracı)', count: 48 },
    { label: 'Havaalanı (kiralama merkezi)', count: 7 },
    { label: 'Tren istasyonu', count: 146 },
    { label: 'Diğer konumlar', count: 433 },
]

export const CAR_CATEGORIES: { label: string; value: string; count: number }[] = [
    { label: 'Küçük boy',    value: 'economy',  count: 63 },
    { label: 'Orta boy',     value: 'compact',  count: 331 },
    { label: 'Büyük boy',    value: 'luxury',   count: 380 },
    { label: 'Station wagon',value: 'van',      count: 152 },
    { label: 'Premium',      value: 'premium',  count: 176 },
    { label: 'Minivan',      value: 'minivan',  count: 114 },
    { label: 'SUV',          value: 'suv',      count: 256 },
    { label: 'Elektrikli',   value: 'electric', count: 40 },
]

export const PRICE_RANGES = [
    { label: 'US$0 – US$50',    min: 0,   max: 50,       count: 49 },
    { label: 'US$50 – US$100',  min: 50,  max: 100,      count: 487 },
    { label: 'US$100 – US$150', min: 100, max: 150,      count: 169 },
    { label: 'US$150 – US$200', min: 150, max: 200,      count: 54 },
    { label: 'US$200+',         min: 200, max: Infinity,  count: 37 },
]

export const RATINGS_FILTER = [
    { label: 'Süper: 9+',   min: 9, count: 93 },
    { label: 'Çok iyi: 8+', min: 8, count: 386 },
    { label: 'İyi: 7+',     min: 7, count: 677 },
]

export const CATEGORIES_NAV = [
    { label: 'Orta boy',   value: 'compact' },
    { label: 'Küçük boy',  value: 'economy' },
    { label: 'Büyük boy',  value: 'luxury' },
    { label: 'SUV',        value: 'suv' },
    { label: 'Minivan',    value: 'van' },
    { label: 'Elektrikli', value: 'electric' },
]

export const TRANSMISSIONS = [
    { label: 'Otomatik', value: 'automatic', count: 597 },
    { label: 'Manuel',   value: 'manual',    count: 199 },
]

export const AVAILABILITY = [
    { label: 'Mövcud',  value: 'available', count: 331 },
    { label: 'İcarədə', value: 'rented',    count: 465 },
]

export const SEATS = [
    { label: '4 koltuk', count: 46 },
    { label: '5 koltuk', count: 636 },
    { label: '6+ koltuk', count: 114 },
]

export const FEATURES_FILTER = [
    { label: 'Klimalı', count: 486 },
    { label: '4+ kapılı', count: 472 },
]

export function scoreLabel(v: number): string {
    if (v >= 9) return 'Süper'
    if (v >= 8) return 'Çok iyi'
    if (v >= 7) return 'İyi'
    return 'Yeterli'
}

export function applyFilters(cars: CarType[], filters: ActiveFilters): CarType[] {
    return cars.filter(car => {
        if (filters.transmissions.length > 0 && !filters.transmissions.includes(car.transmission)) return false
        if (filters.categories.length > 0 && !filters.categories.includes(car.category)) return false
        if (filters.availability.length > 0 && !filters.availability.includes(car.isAvailable ? 'available' : 'rented')) return false
        if (filters.seats.length > 0) {
            const ok = filters.seats.some(s => s === '4 koltuk' ? car.seats === 4 : s === '5 koltuk' ? car.seats === 5 : car.seats >= 6)
            if (!ok) return false
        }
        if (filters.priceRanges.length > 0) {
            const ok = filters.priceRanges.some(label => {
                const r = PRICE_RANGES.find(x => x.label === label)
                return r ? car.pricePerDay >= r.min && car.pricePerDay < (r.max === Infinity ? 1e9 : r.max) : false
            })
            if (!ok) return false
        }
        if (filters.ratings.length > 0 && car.rating !== undefined) {
            const ok = filters.ratings.some(label => {
                const r = RATINGS_FILTER.find(x => x.label === label)
                return r ? car.rating! >= r.min : false
            })
            if (!ok) return false
        }
        return true
    })
}
