'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Users, Settings2, Gauge, MapPin, CheckCircle2, Star,
    ChevronLeft, ChevronRight, Shield, Fuel, Wind,
    Phone, Mail, Info, ArrowRight, Clock, Calendar,
    CreditCard, AlertCircle, ThumbsUp, Car, X, ChevronDown,
    Loader2, Snowflake, Navigation, Wifi,
} from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type CarType = {
    _id: string
    title: string
    brand: string
    model: string
    category: string
    transmission: 'automatic' | 'manual'
    seats: number
    doors?: number
    largeBags?: number
    smallBags?: number
    mileage: number
    pricePerDay: number
    isAvailable: boolean
    location: { city: string; country: string; address?: string; lat?: number; lng?: number }
    features: string[]
    images: string[]
    rating?: number
    provider?: string
    providerLabel?: string
    providerReviews?: number
    fuelPolicy?: string
    minAge?: number
    deposit?: number
    winterFee?: boolean
    includes?: string[]
    excludes?: string[]
}

type Review = {
    id: number
    author: string
    date: string
    rating: number
    comment: string
    avatar: string
}

// ─── Config ────────────────────────────────────────────────────────────────────

const BASE = 'http://localhost:5000'
const API = `${BASE}/api/cars`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreLabel(v: number) {
    if (v >= 9) return 'Süper'
    if (v >= 8) return 'Çok iyi'
    if (v >= 7) return 'İyi'
    return 'Yeterli'
}

// ─── Mock Reviews ─────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
    { id: 1, author: 'Mehmet Y.', date: 'Şubat 2025', rating: 9, comment: 'Araç çok temizdi, teslim alma süreci hızlıydı. Personel çok yardımseverdi. Kesinlikle tavsiye ederim.', avatar: 'MY' },
    { id: 2, author: 'Sarah K.', date: 'Ocak 2025', rating: 8, comment: 'Araç iyi durumdaydı. Havalimanından çıkarken biraz bekleme oldu ama genel olarak sorunsuz bir deneyimdi.', avatar: 'SK' },
    { id: 3, author: 'Ahmet D.', date: 'Aralık 2024', rating: 10, comment: 'Mükemmel! Araç tam istediğim gibiydi, yakıt tüketimi çok düşüktü. Fiyat kalite açısından çok iyi.', avatar: 'AD' },
]

// ─── Google Map ───────────────────────────────────────────────────────────────
// Requires: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local
// If lat/lng not provided, falls back to a static embed searched by city name.

function GoogleMap({
    lat,
    lng,
    city,
    country,
    apiKey,
}: {
    lat?: number
    lng?: number
    city?: string
    country?: string
    apiKey?: string
}) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    // Resolve the API key from env if not passed directly
    const resolvedKey = apiKey ?? (typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
        : '')

    useEffect(() => {
        if (!mapRef.current) return

        const loadAndInit = (resolvedLat: number, resolvedLng: number) => {
            if (mapInstanceRef.current) return

            const existing = document.querySelector('#google-maps-script')
            const init = () => {
                const google = (window as any).google
                if (!google || !mapRef.current) return

                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: resolvedLat, lng: resolvedLng },
                    zoom: 14,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
                    ],
                })

                new google.maps.Marker({
                    position: { lat: resolvedLat, lng: resolvedLng },
                    map,
                    icon: {
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: '#2563eb',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        scale: 1.8,
                        anchor: new google.maps.Point(12, 22),
                    },
                })

                mapInstanceRef.current = map
            }

            if (existing) {
                if ((window as any).google?.maps) init()
                else existing.addEventListener('load', init)
                return
            }

            const script = document.createElement('script')
            script.id = 'google-maps-script'
            script.src = `https://maps.googleapis.com/maps/api/js?key=${resolvedKey}`
            script.async = true
            script.defer = true
            script.onload = init
            document.head.appendChild(script)
        }

        if (lat !== undefined && lng !== undefined) {
            loadAndInit(lat, lng)
        } else if (city) {
            // Geocode via Google Maps Geocoding API
            const query = encodeURIComponent(`${city}${country ? ', ' + country : ''}`)
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${resolvedKey}`)
                .then(r => r.json())
                .then(data => {
                    const loc = data?.results?.[0]?.geometry?.location
                    if (loc) loadAndInit(loc.lat, loc.lng)
                })
                .catch(() => loadAndInit(48.8566, 2.3522))
        }

        return () => {
            mapInstanceRef.current = null
        }
    }, [lat, lng, city, country, resolvedKey])

    // Fallback: if no API key, render a Google Maps embed iframe
    if (!resolvedKey) {
        const query = lat && lng
            ? `${lat},${lng}`
            : encodeURIComponent(`${city ?? ''}${country ? ', ' + country : ''}`)
        return (
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${query}&output=embed&z=14`}
            />
        )
    }

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images, title }: { images: string[]; title: string }) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const [activeThumb, setActiveThumb] = useState(0)
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

    const srcs = images.map(img => img.startsWith('http') ? img : `${BASE}${img}`)
    const slides = srcs.map(src => ({ src }))

    const openAt = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    if (srcs.length === 0) {
        return (
            <div className="h-[260px] sm:h-[340px] md:h-[420px] rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center">
                <Car className="w-20 h-20 text-gray-200" />
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Main image */}
            <div
                className="relative h-[260px] sm:h-[340px] md:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 group cursor-zoom-in"
                onClick={() => openAt(activeThumb)}
            >
                {!imgErrors[activeThumb] ? (
                    <img
                        src={srcs[activeThumb]}
                        alt={title}
                        onError={() => setImgErrors(p => ({ ...p, [activeThumb]: true }))}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-20 h-20 text-gray-200" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                    {activeThumb + 1} / {srcs.length}
                    <span className="hidden sm:inline"> · Büyütmek için tıkla</span>
                </div>
            </div>

            {/* Thumbnail strip */}
            {srcs.length > 1 && (
                <div className="flex gap-1.5 sm:gap-2 mt-2">
                    {srcs.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveThumb(i)}
                            className={`flex-1 h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                                activeThumb === i
                                    ? 'border-blue-600 opacity-100'
                                    : 'border-transparent opacity-55 hover:opacity-90'
                            }`}
                        >
                            {!imgErrors[i] ? (
                                <img
                                    src={img}
                                    alt=""
                                    onError={() => setImgErrors(p => ({ ...p, [i]: true }))}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Car className="w-5 h-5 text-gray-300" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Thumbnails, Zoom, Counter]}
                thumbnails={{
                    position: 'bottom',
                    width: 80,
                    height: 56,
                    border: 2,
                    borderRadius: 8,
                    padding: 2,
                    gap: 8,
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    scrollToZoom: true,
                }}
                counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
                styles={{
                    container: { backgroundColor: 'rgba(0,0,0,0.92)' },
                }}
            />
        </div>
    )
}

// ─── Spec Badge ───────────────────────────────────────────────────────────────

function SpecBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center gap-1 sm:gap-1.5 bg-gray-50 rounded-xl px-2 sm:px-3 py-2 sm:py-3 min-w-[68px] sm:min-w-[80px]">
            <div className="text-blue-600">{icon}</div>
            <span className="text-[10px] sm:text-xs text-gray-600 text-center leading-tight font-medium">{label}</span>
        </div>
    )
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ score }: { score: number }) {
    const stars = Math.round(score / 2)
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                />
            ))}
        </div>
    )
}

// ─── Desktop Booking Card (from code 2, styled like code 1) ──────────────────

function BookingCard({ car }: { car: CarType }) {
    const [days, setDays] = useState(3)
    const total = car.pricePerDay * days

    return (
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-[#003b94] px-5 py-4">
                <p className="text-white/60 text-xs font-medium mb-0.5">{days} günlük toplam</p>
                <p className="text-white text-3xl font-bold leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    US${total}
                </p>
                <p className="text-white/40 text-xs mt-1">
                    Vergiler dahil{car.winterFee ? ' · Kış ücreti dahil' : ''}
                </p>
            </div>

            <div className="px-5 py-4 space-y-3">
                {/* Availability badge */}
                <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                    car.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {car.isAvailable ? 'Müsait' : 'Şu an müsait değil'}
                </div>

                {/* Date pickers */}
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    <div className="p-3 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Alış tarihi
                        </div>
                        <input
                            type="date"
                            className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none w-full"
                        />
                    </div>
                    <div className="p-3">
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <Calendar className="w-3.5 h-3.5" />
                            İade tarihi
                        </div>
                        <input
                            type="date"
                            className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none w-full"
                        />
                    </div>
                </div>

                {/* Days selector */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-xs text-gray-500">Kiralama süresi</span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDays(d => Math.max(1, d - 1))}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-base leading-none transition-colors"
                        >
                            −
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-10 text-center">{days} gün</span>
                        <button
                            onClick={() => setDays(d => d + 1)}
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-base leading-none transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-400">Alış / iade yeri</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                            {car.location.city}, {car.location.country}
                        </p>
                        {car.location.address && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{car.location.address}</p>
                        )}
                    </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                        <span>US${car.pricePerDay} × {days} gün</span>
                        <span>US${total}</span>
                    </div>
                    {car.winterFee && (
                        <div className="flex justify-between text-gray-500">
                            <span>Kış mevsimi ücreti</span>
                            <span className="text-emerald-600 font-semibold">Dahil</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                        <span>Temel sigorta</span>
                        <span className="text-emerald-600 font-semibold">Dahil</span>
                    </div>
                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-800 text-sm">
                        <span>Toplam</span>
                        <span>US${total}</span>
                    </div>
                </div>

                <button
                    disabled={!car.isAvailable}
                    className={`w-full font-bold py-3 rounded-xl transition-colors text-sm ${
                        car.isAvailable
                            ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {car.isAvailable ? 'Şimdi rezervasyon yap' : 'Şu an müsait değil'}
                </button>

                <p className="text-center text-xs text-gray-400">Ücretsiz iptal · Şimdi öde sonra öde</p>
            </div>
        </div>
    )
}

// ─── Mobile Sticky Bottom Bar ─────────────────────────────────────────────────

function MobileStickyBar({ price, days, onBook }: { price: number; days: number; onBook: () => void }) {
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex-1">
                <p className="text-xs text-gray-400 leading-none">{days} günlük toplam</p>
                <p className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    US${price * days}
                </p>
            </div>
            <button
                onClick={onBook}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
            >
                Rezervasyon yap
            </button>
        </div>
    )
}

// ─── Mobile Booking Sheet ─────────────────────────────────────────────────────

function MobileBookingSheet({ open, onClose, car }: { open: boolean; onClose: () => void; car: CarType }) {
    const [days, setDays] = useState(3)
    const total = car.pricePerDay * days

    return (
        <>
            <div
                className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${open ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                <div className="overflow-y-auto max-h-[85vh]">
                    {/* Header */}
                    <div className="bg-[#003b94] px-5 py-4 flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-xs font-medium mb-0.5">{days} günlük toplam</p>
                            <p className="text-white text-3xl font-bold leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                US${total}
                            </p>
                            <p className="text-white/40 text-xs mt-1">
                                Vergiler dahil{car.winterFee ? ' · Kış ücreti dahil' : ''}
                            </p>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-white mt-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="px-5 py-4 space-y-3">
                        {/* Availability */}
                        <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl ${
                            car.isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${car.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {car.isAvailable ? 'Müsait' : 'Şu an müsait değil'}
                        </div>

                        {/* Dates */}
                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Alış tarihi
                                </div>
                                <input type="date" className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none" />
                            </div>
                            <div className="border-t border-gray-200" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    İade tarihi
                                </div>
                                <input type="date" className="text-xs font-semibold text-gray-800 bg-transparent focus:outline-none" />
                            </div>
                        </div>

                        {/* Days selector */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                            <span className="text-xs text-gray-500">Kiralama süresi</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDays(d => Math.max(1, d - 1))}
                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-base leading-none transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-xs font-bold text-gray-800 w-10 text-center">{days} gün</span>
                                <button
                                    onClick={() => setDays(d => d + 1)}
                                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-base leading-none transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-gray-400">Alış / iade yeri</p>
                                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                                    {car.location.city}, {car.location.country}
                                </p>
                            </div>
                        </div>

                        {/* Price breakdown */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between text-gray-500">
                                <span>US${car.pricePerDay} × {days} gün</span>
                                <span>US${total}</span>
                            </div>
                            {car.winterFee && (
                                <div className="flex justify-between text-gray-500">
                                    <span>Kış mevsimi ücreti</span>
                                    <span className="text-emerald-600 font-semibold">Dahil</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-500">
                                <span>Temel sigorta</span>
                                <span className="text-emerald-600 font-semibold">Dahil</span>
                            </div>
                            <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-800 text-sm">
                                <span>Toplam</span>
                                <span>US${total}</span>
                            </div>
                        </div>

                        <button
                            disabled={!car.isAvailable}
                            className={`w-full font-bold py-3 rounded-xl transition-colors text-sm ${
                                car.isAvailable
                                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {car.isAvailable ? 'Şimdi rezervasyon yap' : 'Şu an müsait değil'}
                        </button>
                        <p className="text-center text-xs text-gray-400">Ücretsiz iptal · Şimdi öde sonra öde</p>

                        {/* Trust badges */}
                        <div className="flex justify-around pt-2 pb-4">
                            {[
                                { icon: <Shield className="w-4 h-4 text-emerald-500" />, text: 'Güvenli ödeme' },
                                { icon: <ThumbsUp className="w-4 h-4 text-blue-500" />, text: 'Ücretsiz iptal' },
                                { icon: <Info className="w-4 h-4 text-amber-500" />, text: '7/24 destek' },
                            ].map(({ icon, text }) => (
                                <div key={text} className="flex flex-col items-center gap-1 text-center">
                                    {icon}
                                    <span className="text-[10px] text-gray-500 font-medium">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

// ─── Inner Page (uses useSearchParams) ───────────────────────────────────────

function CarDetailInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const [car, setCar] = useState<CarType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [days] = useState(3)

    useEffect(() => {
        if (!id) { setError('Araç ID bulunamadı'); setLoading(false); return }
        setLoading(true)
        fetch(`${API}/${id}`)
            .then(res => { if (!res.ok) throw new Error('Araç bulunamadı'); return res.json() })
            .then(data => { setCar(data); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-500 text-sm">Yükleniyor...</span>
        </div>
    )

    if (error || !car) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <p className="text-red-500 font-semibold">{error ?? 'Araç bulunamadı'}</p>
            <button onClick={() => router.push('/carfilter')} className="text-blue-600 hover:underline text-sm">
                Araçlara dön
            </button>
        </div>
    )

    const featureIcons: Record<string, any> = {
        'Klima': Snowflake, 'GPS': Navigation, 'WiFi': Wifi, 'Bluetooth': Wifi, 'Yakıt': Fuel,
    }

    const displayIncludes = car.includes ?? [
        'Üçüncü şahıs sigortası',
        'Hırsızlık koruması',
        ...(car.mileage === 0 ? ['Sınırsız kilometre'] : []),
        ...(car.winterFee ? ['Kış mevsimi ücreti'] : []),
    ]

    const displayExcludes = car.excludes ?? [
        'Kasko (ek ücret)',
        ...(car.minAge && car.minAge > 21 ? [`Genç sürücü ücreti (21–${car.minAge} yaş)`] : []),
        'Yakıt',
    ]

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 mt-4 sm:mt-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 pb-2">
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/')}>Ana sayfa</span>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/carfilter')}>
                    {car.location.city}
                </span>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium truncate">{car.title}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">

                {/* ── Left Column ── */}
                <div className="w-full lg:flex-1 lg:min-w-0 space-y-4 sm:space-y-5">

                    {/* Header */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <div className="flex items-start justify-between gap-3 sm:gap-4 mb-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${
                                        car.isAvailable
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                        {car.isAvailable ? 'Müsait' : 'İcarədə'}
                                    </span>
                                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full whitespace-nowrap capitalize">
                                        {car.category}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                    {car.title}
                                </h1>
                                <p className="text-sm text-gray-400 mt-0.5">{car.brand} {car.model}</p>
                                <p className="flex items-center gap-1 text-sm text-blue-500 font-semibold mt-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {car.location.city}, {car.location.country}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-400">Günlük fiyat</p>
                                <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mt-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                    US${car.pricePerDay}
                                </p>
                                {car.rating !== undefined && (
                                    <div className="flex items-center justify-end gap-1.5 mt-1">
                                        <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded-lg">
                                            {car.rating.toFixed(1)}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-600">{scoreLabel(car.rating)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Specs row */}
                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                            <SpecBadge icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} label={`${car.seats} koltuk`} />
                            <SpecBadge
                                icon={<Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                label={car.transmission === 'automatic' ? 'Otomatik' : 'Manuel'}
                            />
                            <SpecBadge
                                icon={<Gauge className="w-4 h-4 sm:w-5 sm:h-5" />}
                                label={car.mileage > 0 ? `${car.mileage.toLocaleString()} km` : 'Sınırsız km'}
                            />
                            <SpecBadge icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5" />} label="Klimalı" />
                            {car.doors && (
                                <SpecBadge icon={<Car className="w-4 h-4 sm:w-5 sm:h-5" />} label={`${car.doors} kapı`} />
                            )}
                            <SpecBadge icon={<Fuel className="w-4 h-4 sm:w-5 sm:h-5" />} label="Benzin" />
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <ImageGallery images={car.images ?? []} title={car.title} />
                    </div>

                    {/* Extra Features (from code 2) */}
                    {car.features?.length > 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Ekstra Özellikler</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {car.features.map((f, i) => {
                                    const Icon = Object.entries(featureIcons).find(([k]) => f.includes(k))?.[1] ?? CheckCircle2
                                    return (
                                        <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                                            <Icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm text-gray-700 font-medium">{f}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Includes / Excludes */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Fiyata dahil olanlar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            <div className="space-y-2">
                                {displayIncludes.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 mt-2 sm:mt-0">
                                {displayExcludes.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                                        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {car.winterFee && (
                            <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                Fiyata kış mevsimi ücreti dahildir
                            </div>
                        )}
                    </div>

                    {/* Policies */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">Kiralama koşulları</h2>
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                            {[
                                { icon: <CreditCard className="w-4 h-4" />, label: 'Depozit', value: `US$${car.deposit ?? 200}` },
                                { icon: <Users className="w-4 h-4" />, label: 'Minimum yaş', value: `${car.minAge ?? 21} yaş` },
                                { icon: <Fuel className="w-4 h-4" />, label: 'Yakıt politikası', value: car.fuelPolicy ?? 'Dolu getir dolu götür' },
                                { icon: <Shield className="w-4 h-4" />, label: 'Sigorta', value: 'Temel sigorta dahil' },
                            ].map(({ icon, label, value }) => (
                                <div key={label} className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                                    <div className="text-blue-600 mt-0.5 flex-shrink-0">{icon}</div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{label}</p>
                                        <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-0.5 leading-tight">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">Alış konumu</h2>
                        <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-blue-600">
                                {car.location.city}, {car.location.country}
                            </span>
                        </div>
                        {car.location.address && (
                            <p className="text-xs text-gray-400 mb-3">{car.location.address}</p>
                        )}
                        <div className="h-[200px] sm:h-[240px] rounded-xl overflow-hidden border border-gray-200">
                            <GoogleMap
                                lat={car.location.lat}
                                lng={car.location.lng}
                                city={car.location.city}
                                country={car.location.country}
                            />
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900">Değerlendirmeler</h2>
                            {car.rating !== undefined && (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="bg-amber-100 text-amber-700 text-sm font-black px-2.5 py-1 rounded-lg">
                                        {car.rating.toFixed(1)}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{scoreLabel(car.rating)}</span>
                                    {car.providerReviews && (
                                        <span className="text-xs text-gray-400 hidden sm:inline">{car.providerReviews} yorum</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            {MOCK_REVIEWS.map(review => (
                                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                            {review.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-semibold text-gray-800 truncate">{review.author}</span>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <StarRating score={review.rating} />
                                                <span className="text-xs font-bold text-amber-600">{review.rating}/10</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline">
                            Tüm yorumları gör <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Right Column (desktop only) ── */}
                <div className="hidden lg:block w-[300px] flex-shrink-0 sticky top-4 space-y-3">

                    {/* Dynamic Booking Card */}
                    <BookingCard car={car} />

                    {/* Provider card */}
                    {car.provider && (
                        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-black text-blue-700">{car.provider}</span>
                                </div>
                                {car.rating !== undefined && (
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded">
                                                {car.rating.toFixed(1)}
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700">{scoreLabel(car.rating)}</span>
                                        </div>
                                        {car.providerReviews && (
                                            <p className="text-xs text-gray-400 mt-0.5">{car.providerReviews} değerlendirme</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                                    <Phone className="w-3.5 h-3.5" /> Tedarikçiyi ara
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                                    <Mail className="w-3.5 h-3.5" /> Teklifi e-postayla gönder
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100 space-y-2.5">
                        {[
                            { icon: <Shield className="w-4 h-4 text-emerald-500" />, text: 'Güvenli ödeme' },
                            { icon: <ThumbsUp className="w-4 h-4 text-blue-500" />, text: 'Ücretsiz iptal imkânı' },
                            { icon: <Info className="w-4 h-4 text-amber-500" />, text: '7/24 müşteri desteği' },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                {icon}
                                {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function CarDetailPage() {
    return (
        <div className="min-h-screen bg-[#F4F6F9] pb-24 lg:pb-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap');
            `}</style>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
            }>
                <CarDetailInner />
            </Suspense>
        </div>
    )
}