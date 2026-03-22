'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Users, Settings2, BriefcaseBusiness, Briefcase, Gauge,
    MapPin, CheckCircle2, Eye, Info, Mail, ArrowUpDown,
    ChevronDown, ChevronRight, X, Car,
} from 'lucide-react'

type Car = {
    id: number
    name: string
    subtitle: string
    seats: number
    transmission: 'Manuel' | 'Otomatik'
    largeBags: number
    smallBags: number
    unlimited: boolean
    location: string
    distanceKm: number
    price3Day: number
    winterFee: boolean
    provider: string
    score: number
    reviews: number
    scoreLabel: string
    tag?: string
    seen?: boolean
    familyIdeal?: boolean
    img: string
}

const CARS: Car[] = [
    {
        id: 1, name: 'Opel Corsa', subtitle: 'veya benzeri bir küçük araba',
        seats: 5, transmission: 'Manuel', largeBags: 2, smallBags: 3,
        unlimited: true, location: 'Hamburg Havalimanı', distanceKm: 10,
        price3Day: 62, winterFee: true,
        provider: 'Flex', score: 5, reviews: 9, scoreLabel: 'Yeterli',
        tag: 'Favori', seen: true,
        img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
    },
    {
        id: 2, name: 'Volkswagen Polo', subtitle: 'veya benzeri bir küçük araba',
        seats: 5, transmission: 'Manuel', largeBags: 1, smallBags: 1,
        unlimited: true, location: 'Hamburg Havalimanı', distanceKm: 10,
        price3Day: 62, winterFee: false,
        provider: 'Flex', score: 5, reviews: 9, scoreLabel: 'Yeterli',
        seen: true,
        img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80',
    },
    {
        id: 3, name: 'Fiat 500', subtitle: 'veya benzeri bir küçük araba',
        seats: 4, transmission: 'Manuel', largeBags: 1, smallBags: 1,
        unlimited: true, location: 'Hamburg Havalimanı', distanceKm: 10,
        price3Day: 60, winterFee: true,
        provider: 'Flex', score: 5, reviews: 9, scoreLabel: 'Yeterli',
        img: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=400&q=80',
    },
    {
        id: 4, name: 'Kia Picanto', subtitle: 'veya benzeri bir küçük araba',
        seats: 5, transmission: 'Manuel', largeBags: 1, smallBags: 1,
        unlimited: true, location: 'Hamburg Havalimanı', distanceKm: 10,
        price3Day: 61, winterFee: true,
        provider: 'Flex', score: 5, reviews: 9, scoreLabel: 'Yeterli',
        familyIdeal: true,
        img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=80',
    },
]

const SUPPLIERS = [
    { name: 'Europcar', count: 143 },
    { name: 'Flex To Go', count: 48 },
    { name: 'Green Motion', count: 7 },
    { name: 'Hertz', count: 18 },
    { name: 'Sixt', count: 562 },
    { name: 'Budget', count: 34 },
]

const LOCATIONS = [
    { label: 'Havaalanı (terminal)', count: 162 },
    { label: 'Havaalanı (servis aracı)', count: 48 },
    { label: 'Havaalanı (araba kiralama merkezi)', count: 7 },
    { label: 'Tren istasyonu', count: 146 },
    { label: 'Tüm diğer konumlar', count: 433 },
]

const CATEGORIES_NAV = [
    'Orta boy araba', 'Küçük boy araba', 'Büyük boy araba', "SUV'lar", 'Minivan', 'Premium',
]

const CAR_CATEGORIES = [
    { label: 'Küçük boy araba', count: 63 },
    { label: 'Orta boy araba', count: 331 },
    { label: 'Büyük boy araba', count: 380 },
    { label: 'Station wagon', count: 152 },
    { label: 'Premium araba', count: 176 },
    { label: 'Minivanlar', count: 114 },
    { label: "SUV'lar", count: 256 },
]

const PRICE_RANGES = [
    { label: 'US$0 – US$50', count: 49 },
    { label: 'US$50 – US$100', count: 487 },
    { label: 'US$100 – US$150', count: 169 },
    { label: 'US$150 – US$200', count: 54 },
    { label: 'US$200 +', count: 37 },
]

const RATINGS = [
    { label: 'Süper: 9+', count: 93 },
    { label: 'Çok iyi: 8+', count: 386 },
    { label: 'İyi: 7+', count: 677 },
]

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

            const map = L.map(mapRef.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                dragging: false,
                attributionControl: false,
            })

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 15,
            }).addTo(map)

            map.setView([53.6304, 10.0058], 12)

            const icon = L.divIcon({
                html: `<div style="width:28px;height:28px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
                className: '',
                iconSize: [28, 28],
                iconAnchor: [14, 28],
            })

            L.marker([53.6304, 10.0058], { icon }).addTo(map)

            mapRef.current.addEventListener('click', () => {
                map.scrollWheelZoom.enable()
                map.dragging.enable()
            })

            mapInstanceRef.current = map
        }
        document.head.appendChild(script)

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, label, count }: {
    checked: boolean; onChange: () => void; label: string; count?: number
}) {
    return (
        <label className="flex items-center justify-between cursor-pointer group py-0.5">
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

// ─── Filter Section ───────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="py-4 border-b border-gray-100 last:border-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
            <div className="space-y-1.5">{children}</div>
        </div>
    )
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar() {
    const [checked, setChecked] = useState<Set<string>>(new Set())
    const [suppExpanded, setSuppExpanded] = useState(false)

    const toggle = (key: string) =>
        setChecked(prev => {
            const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n
        })

    const visibleSuppliers = suppExpanded ? SUPPLIERS : SUPPLIERS.slice(0, 5)

    return (
        <aside className="w-[268px] flex-shrink-0 self-start sticky top-4">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden mb-3 h-[130px] border border-gray-200">
                <LeafletMap />
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
                <div className="px-4 py-3.5 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-sm font-bold text-gray-900">Filtreleme</h2>
                    <button
                        onClick={() => setChecked(new Set())}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        Tüm filtreleri temizle
                    </button>
                </div>
                <div className="px-4">
                    <FilterSection title="Konum">
                        {LOCATIONS.map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Vites">
                        {[{ label: 'Otomatik', count: 597 }, { label: 'Manuel', count: 199 }].map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Tedarikçi">
                        {visibleSuppliers.map(({ name, count }) => (
                            <Checkbox key={name} checked={checked.has(name)} onChange={() => toggle(name)} label={name} count={count} />
                        ))}
                        <button
                            onClick={() => setSuppExpanded(!suppExpanded)}
                            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-1.5"
                        >
                            {suppExpanded ? 'Daha az göster' : `Tümünü göster (${SUPPLIERS.length})`}
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${suppExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </FilterSection>
                    <FilterSection title="Mesafe/Kilometre">
                        {[{ label: 'Sınırlı', count: 465 }, { label: 'Sınırsız', count: 331 }].map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Araba kategorisi">
                        {CAR_CATEGORIES.map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Günlük fiyat">
                        {PRICE_RANGES.map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Koltuk sayısı">
                        {[{ label: '4 koltuk', count: 46 }, { label: '5 koltuk', count: 636 }, { label: '6+ koltuk', count: 114 }].map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Değerlendirme puanı">
                        {RATINGS.map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                    <FilterSection title="Araç özellikleri">
                        {[{ label: 'Klimalı', count: 486 }, { label: '4+ kapılı', count: 472 }].map(({ label, count }) => (
                            <Checkbox key={label} checked={checked.has(label)} onChange={() => toggle(label)} label={label} count={count} />
                        ))}
                    </FilterSection>
                </div>
            </div>
        </aside>
    )
}

// ─── Genius Banner ────────────────────────────────────────────────────────────

function GeniusBanner() {
    const [visible, setVisible] = useState(true)
    if (!visible) return null
    return (
        <div className="relative bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4 mb-4 flex items-center gap-4 overflow-hidden border border-blue-50">
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

// ─── Car Card ─────────────────────────────────────────────────────────────────

function CarCard({ car }: { car: Car }) {
    const [hovered, setHovered] = useState(false)
    const [imgError, setImgError] = useState(false)

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 ${hovered
                ? 'shadow-[0_8px_32px_rgba(0,0,0,0.13)] -translate-y-0.5'
                : 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                }`}
        >
            <div className="p-5">
                {/* Tags */}
                {(car.seen || car.tag || car.familyIdeal) && (
                    <div className="flex items-center gap-2 mb-3">
                        {car.seen && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                <Eye className="w-3 h-3" /> Görüldü
                            </span>
                        )}
                        {car.tag && (
                            <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">{car.tag}</span>
                        )}
                        {car.familyIdeal && (
                            <span className="text-xs font-semibold bg-emerald-600 text-white px-2.5 py-1 rounded-full">Aileler için ideal</span>
                        )}
                    </div>
                )}

                <div className="flex gap-4">
                    {/* Car Image */}
                    <div className="w-48 h-[116px] rounded-xl flex-shrink-0 overflow-hidden bg-gray-100">
                        {!imgError ? (
                            <img
                                src={car.img}
                                alt={car.name}
                                onError={() => setImgError(true)}
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                <Car className="w-12 h-12 text-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
                            {car.name}
                            <span className="text-sm font-normal text-gray-400 ml-1.5">{car.subtitle}</span>
                        </h3>

                        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {car.seats} koltuklu
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Settings2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {car.transmission}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                <BriefcaseBusiness className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {car.largeBags} büyük çanta
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {car.smallBags} küçük çanta
                            </span>
                            {car.unlimited && (
                                <span className="flex items-center gap-1.5 text-sm text-gray-600 col-span-2">
                                    <Gauge className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    Sınırsız mesafe
                                </span>
                            )}
                        </div>

                        <div className="mt-2.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-blue-600">{car.location}</span>
                            <span className="text-xs text-gray-400 ml-0.5">· Merkeze {car.distanceKm} km</span>
                        </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0 min-w-[130px]">
                        <div className="text-right">
                            <p className="text-xs text-gray-400 mb-0.5">3 günlük fiyat:</p>
                            <p
                                className="text-[26px] font-black text-gray-900 leading-none"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                US${car.price3Day}
                            </p>
                        </div>
                        <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
                            Fırsatı görüntüle
                        </button>
                    </div>
                </div>

                {/* Winter fee */}
                {car.winterFee && (
                    <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3.5 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        Fiyata kış mevsimi ücreti dahildir
                    </div>
                )}

                {/* Provider row */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                            <span className="text-xs font-bold text-blue-700">{car.provider}</span>
                        </div>
                        <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">
                            {car.score}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{car.scoreLabel}</span>
                        <span className="text-xs text-gray-400">{car.reviews} değerlendirme</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Info className="w-3.5 h-3.5" /> Önemli bilgiler
                        </button>
                        <button className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Mail className="w-3.5 h-3.5" /> Teklifi e-postayla gönder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarRentalPage() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState('Önerilen')
    const [driverAge, setDriverAge] = useState(true)
    const [diffReturn, setDiffReturn] = useState(false)

    return (
        <div className="min-h-screen " style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap');
            `}</style>

            {/* ── Main Content ── */}
            <div className="max-w-7xl mx-auto px-6 py-5 mt-10 ">
                <div className="flex items-center gap-6 mb-5" />

                <div className="flex gap-6 items-start">
                    <FilterSidebar />

                    <div className="flex-1 min-w-0">
                        {/* Results header */}
                        <div className="flex items-center justify-between mb-4">
                            <h1
                                className="text-2xl font-black text-gray-900"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                796{' '}
                                <span
                                    className="font-normal text-gray-500 text-xl"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    araba mevcut
                                </span>
                            </h1>
                            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500">Sıralama:</span>
                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value)}
                                    className="text-sm font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                                >
                                    <option>Önerilen</option>
                                    <option>Fiyat: Artan</option>
                                    <option>Fiyat: Azalan</option>
                                    <option>Değerlendirme</option>
                                </select>
                            </div>
                        </div>

                        {/* Category pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: 'none' }}>
                            {CATEGORIES_NAV.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap border transition-all
                    ${activeCategory === cat
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                                        }`}
                                >
                                    <Car className="w-4 h-4 flex-shrink-0" />
                                    {cat}
                                </button>
                            ))}
                            <button className="w-9 h-9 shrink-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:border-blue-300 text-gray-500 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Genius banner */}
                        <GeniusBanner />

                        {/* Car listings */}
                        <div className="space-y-4">
                            {CARS.map(car => <CarCard key={car.id} car={car} />)}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {[1, 2, 3, '...', 8].map((p, i) => (
                                <button
                                    key={i}
                                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                    ${p === 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors ml-1">
                                Sonraki <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}