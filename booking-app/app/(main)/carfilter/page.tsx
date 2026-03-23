'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users, Settings2, Gauge, MapPin, CheckCircle2, ArrowUpDown,
    ChevronDown, ChevronRight, X, Car, Loader2,
    LayoutList, LayoutGrid, SlidersHorizontal, Star,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type CarType = {
    _id: string
    title: string
    brand: string
    model: string
    category: string
    transmission: 'automatic' | 'manual'
    seats: number
    mileage: number
    pricePerDay: number
    isAvailable: boolean
    location: { city: string; country: string }
    features: string[]
    images: string[]
    rating?: number
}

// ─── API ──────────────────────────────────────────────────────────────────────

const BASE = 'http://localhost:5000'
const API = `${BASE}/api/cars`

type FetchCarsParams = { page: number; limit: number; category?: string }
type FetchCarsResponse = { cars: CarType[]; total: number }

const carApi = {
    getAll: async ({ page, limit, category }: FetchCarsParams): Promise<FetchCarsResponse> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (category) params.set('category', category)
        const res = await fetch(`${API}?${params}`)
        if (!res.ok) throw new Error('Məlumatlar yüklənmədi')
        return res.json()
    },
}

// ─── Static filter data ───────────────────────────────────────────────────────

const SUPPLIERS = [
    { name: 'Europcar', count: 143 },
    { name: 'Flex To Go', count: 48 },
    { name: 'Green Motion', count: 7 },
    { name: 'Hertz', count: 18 },
    { name: 'Sixt', count: 562 },
    { name: 'Budget', count: 34 },
]

const LOCATIONS_FILTER = [
    { label: 'Havaalanı (terminal)', count: 162 },
    { label: 'Havaalanı (servis aracı)', count: 48 },
    { label: 'Havaalanı (kiralama merkezi)', count: 7 },
    { label: 'Tren istasyonu', count: 146 },
    { label: 'Diğer konumlar', count: 433 },
]

const CAR_CATEGORIES: { label: string; value: string; count: number }[] = [
    { label: 'Küçük boy', value: 'economy', count: 63 },
    { label: 'Orta boy', value: 'compact', count: 331 },
    { label: 'Büyük boy', value: 'luxury', count: 380 },
    { label: 'Station wagon', value: 'van', count: 152 },
    { label: 'Premium', value: 'premium', count: 176 },
    { label: 'Minivan', value: 'minivan', count: 114 },
    { label: 'SUV', value: 'suv', count: 256 },
    { label: 'Elektrikli', value: 'electric', count: 40 },
]

const PRICE_RANGES = [
    { label: 'US$0 – US$50', min: 0, max: 50, count: 49 },
    { label: 'US$50 – US$100', min: 50, max: 100, count: 487 },
    { label: 'US$100 – US$150', min: 100, max: 150, count: 169 },
    { label: 'US$150 – US$200', min: 150, max: 200, count: 54 },
    { label: 'US$200+', min: 200, max: Infinity, count: 37 },
]

const RATINGS_FILTER = [
    { label: 'Süper: 9+', min: 9, count: 93 },
    { label: 'Çok iyi: 8+', min: 8, count: 386 },
    { label: 'İyi: 7+', min: 7, count: 677 },
]

const CATEGORIES_NAV = [
    { label: 'Orta boy', value: 'compact' },
    { label: 'Küçük boy', value: 'economy' },
    { label: 'Büyük boy', value: 'luxury' },
    { label: 'SUV', value: 'suv' },
    { label: 'Minivan', value: 'van' },
    { label: 'Elektrikli', value: 'electric' },
]

type ActiveFilters = {
    categories: string[]
    transmissions: string[]
    seats: string[]
    priceRanges: string[]
    ratings: string[]
    availability: string[]
}

const EMPTY_FILTERS: ActiveFilters = {
    categories: [], transmissions: [], seats: [], priceRanges: [], ratings: [], availability: [],
}

// ─── Leaflet Map ──────────────────────────────────────────────────────────────

function LeafletMap() {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    useEffect(() => {
        if (mapInstanceRef.current || !mapRef.current) return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
            const L = (window as any).L
            if (!L || !mapRef.current) return
            const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false, dragging: false, attributionControl: false })
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15 }).addTo(map)
            map.setView([53.6304, 10.0058], 12)
            const icon = L.divIcon({
                html: `<div style="width:22px;height:22px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
                className: '', iconSize: [22, 22], iconAnchor: [11, 22],
            })
            L.marker([53.6304, 10.0058], { icon }).addTo(map)
            mapRef.current?.addEventListener('click', () => { map.scrollWheelZoom.enable(); map.dragging.enable() })
            mapInstanceRef.current = map
        }
        document.head.appendChild(script)
        return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
    }, [])

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, label, count }: {
    checked: boolean; onChange: () => void; label: string; count?: number
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group py-0.5 select-none">
            <div className="flex items-center gap-2.5">
                <button
                    onClick={onChange}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400 bg-white'}`}
                >
                    {checked && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </button>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{label}</span>
            </div>
            {count !== undefined && <span className="text-xs text-gray-400 tabular-nums ml-2">{count}</span>}
        </label>
    )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
            <div className="space-y-1.5">{children}</div>
        </div>
    )
}

// ─── Sidebar inner ────────────────────────────────────────────────────────────

function SidebarInner({ filters, onChange, onReset }: {
    filters: ActiveFilters; onChange: (f: ActiveFilters) => void; onReset: () => void
}) {
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
                {[{ label: 'Otomatik', value: 'automatic', count: 597 }, { label: 'Manuel', value: 'manual', count: 199 }].map(({ label, value, count }) => (
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
                {[{ label: 'Mövcud', value: 'available', count: 331 }, { label: 'İcarədə', value: 'rented', count: 465 }].map(({ label, value, count }) => (
                    <Checkbox key={value} checked={filters.availability.includes(value)}
                        onChange={() => toggle('availability', value)} label={label} count={count} />
                ))}
            </FilterSection>
            <FilterSection title="Araba kategorisi">
                {CAR_CATEGORIES.map(({ label, value, count }) => (
                    <Checkbox key={label} checked={filters.categories.includes(value)}
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
                {[{ label: '4 koltuk', count: 46 }, { label: '5 koltuk', count: 636 }, { label: '6+ koltuk', count: 114 }].map(({ label, count }) => (
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
                {[{ label: 'Klimalı', count: 486 }, { label: '4+ kapılı', count: 472 }].map(({ label, count }) => (
                    <Checkbox key={label} checked={false} onChange={() => {}} label={label} count={count} />
                ))}
            </FilterSection>
        </>
    )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({ filters, onChange, onReset, open, onClose }: {
    filters: ActiveFilters; onChange: (f: ActiveFilters) => void; onReset: () => void; open: boolean; onClose: () => void
}) {
    return (
        <>
            <aside className="hidden lg:block w-[268px] flex-shrink-0 self-start sticky top-4">
                <div className="rounded-2xl overflow-hidden mb-3 h-[130px] border border-gray-200">
                    <LeafletMap />
                </div>
                <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-sm font-bold text-gray-900">Filtreleme</h2>
                        <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-700 font-semibold">
                            Tüm filtreleri temizle
                        </button>
                    </div>
                    <div className="px-4">
                        <SidebarInner filters={filters} onChange={onChange} onReset={onReset} />
                    </div>
                </div>
            </aside>

            {open && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                    <div className="relative z-10 bg-white w-72 max-w-[85vw] h-full shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                            <p className="text-base font-bold text-gray-800">Filtreleme</p>
                            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                                <X size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4">
                            <SidebarInner filters={filters} onChange={onChange} onReset={onReset} />
                        </div>
                        <div className="px-4 py-4 border-t border-gray-100">
                            <button onClick={onClose}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                                Sonuçları gör
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// ─── Genius Banner ────────────────────────────────────────────────────────────

function GeniusBanner() {
    const [visible, setVisible] = useState(true)
    if (!visible) return null
    return (
        <div className="relative bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4 mb-4 flex items-center gap-4 border border-blue-50 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700 rounded-l-2xl" />
            <div className="flex-1 pl-2">
                <p className="text-sm font-bold text-gray-900">Giriş yapın, tasarruf edin</p>
                <p className="text-xs text-gray-500 mt-0.5">Bu konumdaki seçili arabalarda %10 tasarruf edin</p>
                <div className="flex gap-2 mt-2.5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">Giriş yap</button>
                    <button className="border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Kaydol</button>
                </div>
            </div>
            <div className="w-20 flex-shrink-0">
                <img
                    src="https://t-cf.bstatic.com/design-assets/assets/v3.172.2/illustrations-traveller/GeniusCarsBadge.png"
                    alt=""
                    onError={e => (e.currentTarget.style.display = 'none')}
                />
            </div>
            <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreLabel(v: number) {
    if (v >= 9) return 'Süper'
    if (v >= 8) return 'Çok iyi'
    if (v >= 7) return 'İyi'
    return 'Yeterli'
}

// ─── List Card ────────────────────────────────────────────────────────────────

function ListCard({ car, onNavigate }: { car: CarType; onNavigate: (id: string) => void }) {
    const [imgError, setImgError] = useState(false)
    const imgSrc = car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${BASE}${car.images[0]}`) : null

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row overflow-hidden">
            {/* Image — clickable */}
            <div
                className="relative w-full sm:w-48 md:w-56 flex-shrink-0 h-52 sm:h-auto cursor-pointer"
                onClick={() => onNavigate(car._id)}
            >
                {imgSrc && !imgError ? (
                    <img src={imgSrc} alt={car.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full min-h-[120px] flex items-center justify-center bg-gray-50">
                        <Car className="w-12 h-12 text-gray-200" />
                    </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {car.isAvailable ? 'Mövcud' : 'İcarədə'}
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 flex flex-col sm:flex-row gap-3 justify-between min-w-0">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        {/* Title — clickable */}
                        <h3
                            onClick={() => onNavigate(car._id)}
                            className="text-[#006ce4] font-bold text-base hover:underline cursor-pointer leading-tight"
                        >
                            {car.title}
                        </h3>
                        <span className="bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                            {car.category}
                        </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">{car.brand} {car.model}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Users className="w-3.5 h-3.5 text-gray-400" />{car.seats} koltuk
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Settings2 className="w-3.5 h-3.5 text-gray-400" />
                            {car.transmission === 'automatic' ? 'Otomatik' : 'Manuel'}
                        </span>
                        {car.mileage > 0 && (
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Gauge className="w-3.5 h-3.5 text-gray-400" />{car.mileage.toLocaleString()} km
                            </span>
                        )}
                        {car.features?.slice(0, 1).map((f, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />{f}
                            </span>
                        ))}
                    </div>

                    {car.location && (
                        <div className="mt-2 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="text-xs font-semibold text-blue-500">{car.location.city}</span>
                            <span className="text-xs text-gray-400">· {car.location.country}</span>
                        </div>
                    )}
                </div>

                {/* Price + CTA */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 flex-shrink-0 sm:min-w-[120px]">
                    {car.rating !== undefined && (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:block text-right">
                                <p className="text-xs font-semibold text-gray-700">{scoreLabel(car.rating)}</p>
                            </div>
                            <div className="flex items-center gap-1 sm:hidden">
                                <Star size={11} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-semibold text-gray-700">{car.rating.toFixed(1)}</span>
                            </div>
                            <div className="bg-[#003580] text-white text-xs font-bold px-2 py-1 rounded-lg rounded-tr-none min-w-[2rem] text-center">
                                {car.rating.toFixed(1)}
                            </div>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-xs text-gray-400">Günlük</p>
                        <p className="text-xl font-black text-gray-900">US${car.pricePerDay}</p>
                    </div>
                    {/* CTA button — clickable */}
                    <button
                        onClick={() => car.isAvailable && onNavigate(car._id)}
                        disabled={!car.isAvailable}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 ${car.isAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {car.isAvailable ? <>Görüntüle <ChevronRight size={12} /></> : 'Müsait değil'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Grid Card ────────────────────────────────────────────────────────────────

function GridCard({ car, onNavigate }: { car: CarType; onNavigate: (id: string) => void }) {
    const [imgError, setImgError] = useState(false)
    const imgSrc = car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : `${BASE}${car.images[0]}`) : null

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden h-full">
            {/* Image — clickable */}
            <div
                className="relative h-44 flex-shrink-0 cursor-pointer"
                onClick={() => onNavigate(car._id)}
            >
                {imgSrc && !imgError ? (
                    <img src={imgSrc} alt={car.title} onError={() => setImgError(true)} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Car className="w-10 h-10 text-gray-200" />
                    </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${car.isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {car.isAvailable ? 'Mövcud' : 'İcarədə'}
                </span>
                <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize">
                    {car.category}
                </span>
            </div>

            <div className="flex-1 flex flex-col p-3 gap-1.5">
                {car.rating !== undefined && (
                    <div className="flex items-center gap-1">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{car.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">· {scoreLabel(car.rating)}</span>
                    </div>
                )}
                {/* Title — clickable */}
                <h3
                    onClick={() => onNavigate(car._id)}
                    className="text-[#006ce4] font-bold text-sm hover:underline cursor-pointer leading-snug line-clamp-2"
                >
                    {car.title}
                </h3>
                <p className="text-[10px] text-gray-400">{car.brand} {car.model}</p>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Users className="w-3 h-3 text-gray-400" />{car.seats} koltuk
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                        <Settings2 className="w-3 h-3 text-gray-400" />{car.transmission === 'automatic' ? 'Oto.' : 'Man.'}
                    </span>
                </div>

                {car.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-0.5">
                        <MapPin size={10} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{car.location.city}, {car.location.country}</span>
                    </p>
                )}

                <div className="mt-auto pt-2 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div>
                        <p className="text-[10px] text-gray-400">Günlük</p>
                        <p className="text-base font-black text-gray-900">US${car.pricePerDay}</p>
                    </div>
                    {/* CTA button — clickable */}
                    <button
                        onClick={() => car.isAvailable && onNavigate(car._id)}
                        disabled={!car.isAvailable}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 ${car.isAvailable ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {car.isAvailable ? <>Gör <ChevronRight size={11} /></> : 'N/A'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <SlidersHorizontal className="w-10 h-10 text-gray-300 mb-4" />
            <p className="font-semibold text-gray-500">Araç bulunamadı</p>
            <button onClick={onReset} className="mt-3 text-sm text-blue-600 hover:underline">Filtreleri sıfırla</button>
        </div>
    )
}

// ─── Client-side filter ───────────────────────────────────────────────────────

function applyFilters(cars: CarType[], filters: ActiveFilters): CarType[] {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarRentalPage() {
    const router = useRouter()

    const [allCars, setAllCars] = useState<CarType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const LIMIT = 20

    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState('Önerilen')
    const [filters, setFilters] = useState<ActiveFilters>(EMPTY_FILTERS)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

    // Navigate to detail page
    const goToDetail = (id: string) => router.push(`/cardetails?id=${id}`)

    // Force list on mobile
    useEffect(() => {
        const check = () => { if (window.innerWidth < 640) setViewMode('list') }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const fetchCars = useCallback(async () => {
        setLoading(true); setError(null)
        try {
            const res = await carApi.getAll({ page, limit: LIMIT, category: activeCategory ?? undefined })
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

    const filterChips: { label: string; onRemove: () => void }[] = [
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
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                {loading ? '...' : <>{displayedCars.length} <span className="font-normal text-gray-500">araba mevcut</span></>}
                            </h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Mobile filter btn */}
                                <button onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 text-gray-700 hover:border-gray-400 transition-colors">
                                    <SlidersHorizontal size={13} />
                                    Filtrele
                                    {filterChips.length > 0 && (
                                        <span className="bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {filterChips.length}
                                        </span>
                                    )}
                                </button>

                                {/* List / Grid — desktop only */}
                                <button onClick={() => setViewMode('list')}
                                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === 'list' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                                    <LayoutList size={13} /> Liste
                                </button>
                                <button onClick={() => setViewMode('grid')}
                                    className={`hidden sm:flex border rounded-lg px-3 py-1.5 text-xs items-center gap-1.5 transition-colors ${viewMode === 'grid' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'}`}>
                                    <LayoutGrid size={13} /> Grid
                                </button>

                                {/* Sort */}
                                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                                        className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer">
                                        <option>Önerilen</option>
                                        <option>Fiyat: Artan</option>
                                        <option>Fiyat: Azalan</option>
                                        <option>Değerlendirme</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
                            {CATEGORIES_NAV.map(cat => (
                                <button key={cat.value} onClick={() => handleCategoryNav(cat.value)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${activeCategory === cat.value
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}>
                                    <Car className="w-3.5 h-3.5" />
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Active filter chips */}
                        {filterChips.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                {filterChips.map(chip => (
                                    <div key={chip.label} className="flex items-center gap-1.5 bg-white border border-blue-300 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                                        {chip.label}
                                        <button onClick={chip.onRemove} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={clearAll} className="text-xs font-semibold text-blue-600 hover:underline">
                                    Tümünü temizle
                                </button>
                            </div>
                        )}

                        {/* Genius banner */}
                        <GeniusBanner />

                        {/* Content */}
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
                                {displayedCars.map(car => (
                                    <ListCard key={car._id} car={car} onNavigate={goToDetail} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                                {displayedCars.map(car => (
                                    <GridCard key={car._id} car={car} onNavigate={goToDetail} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                    <button key={p} onClick={() => setPage(p)}
                                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page === p ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'}`}>
                                        {p}
                                    </button>
                                ))}
                                {totalPages > 5 && <span className="text-gray-400 text-sm">...</span>}
                                {page < totalPages && (
                                    <button onClick={() => setPage(p => p + 1)}
                                        className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ml-1">
                                        Sonraki <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}