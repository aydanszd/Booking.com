'use client'

import { useState, useEffect, useRef } from 'react'
import {
    Users, Settings2, Gauge, MapPin, CheckCircle2, Star,
    ChevronLeft, ChevronRight, Shield, Fuel, Wind,
    Phone, Mail, Info, ArrowRight, Clock, Calendar,
    CreditCard, AlertCircle, ThumbsUp, Car,
} from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type Review = {
    id: number
    author: string
    date: string
    rating: number
    comment: string
    avatar: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CAR = {
    name: 'Volkswagen Golf',
    subtitle: 'veya benzeri bir orta boy araba',
    category: 'Orta boy araba',
    year: 2023,
    transmission: 'Otomatik',
    seats: 5,
    doors: 4,
    largeBags: 2,
    smallBags: 3,
    unlimited: true,
    ac: true,
    fuelPolicy: 'Dolu getir dolu götür',
    minAge: 21,
    provider: 'Sixt',
    providerScore: 8.4,
    providerLabel: 'Çok İyi',
    providerReviews: 1284,
    pricePerDay: 38,
    price3Day: 114,
    deposit: 250,
    location: 'Hamburg Havalimanı Terminal 1',
    locationAddress: 'Flughafenstr. 1-3, 22335 Hamburg, Almanya',
    lat: 53.6304,
    lng: 10.0058,
    winterFee: true,
    images: [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=85',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=85',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&q=85',
        'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=900&q=85',
    ],
    includes: [
        'Üçüncü şahıs sigortası',
        'Hırsızlık koruması',
        'Yangın sigortası',
        'Sınırsız kilometre',
        'Kış mevsimi ücreti',
    ],
    excludes: [
        'Kasko (ek ücret)',
        'Genç sürücü ücreti (21–24 yaş)',
        'Yakıt',
    ],
}

const REVIEWS: Review[] = [
    { id: 1, author: 'Mehmet Y.', date: 'Şubat 2025', rating: 9, comment: 'Araç çok temizdi, teslim alma süreci hızlıydı. Sixt personeli çok yardımseverdi. Kesinlikle tavsiye ederim.', avatar: 'MY' },
    { id: 2, author: 'Sarah K.', date: 'Ocak 2025', rating: 8, comment: 'Araç iyi durumdaydı. Havalimanından çıkarken biraz bekleme oldu ama genel olarak sorunsuz bir deneyimdi.', avatar: 'SK' },
    { id: 3, author: 'Ahmet D.', date: 'Aralık 2024', rating: 10, comment: 'Mükemmel! Golf tam istediğim gibiydi, yakıt tüketimi çok düşüktü. Fiyat kalite açısından çok iyi.', avatar: 'AD' },
]

// ─── Leaflet Map ──────────────────────────────────────────────────────────────

function LeafletMap({ lat, lng }: { lat: number; lng: number }) {
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
                zoomControl: true,
                scrollWheelZoom: false,
                attributionControl: false,
            })

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17 }).addTo(map)
            map.setView([lat, lng], 14)

            const icon = L.divIcon({
                html: `<div style="width:32px;height:32px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 10px rgba(37,99,235,0.4)"></div>`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            })

            L.marker([lat, lng], { icon }).addTo(map)
            mapInstanceRef.current = map
        }
        document.head.appendChild(script)

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [lat, lng])

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ images }: { images: string[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const [activeThumb, setActiveThumb] = useState(0)

    const slides = images.map(src => ({ src }))

    const openAt = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    return (
        <div className="relative">
            {/* Main image — click to open lightbox */}
            <div
                className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-100 group cursor-zoom-in"
                onClick={() => openAt(activeThumb)}
            >
                <img
                    src={images[activeThumb]}
                    alt="Araba"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm select-none">
                    {activeThumb + 1} / {images.length} · Büyütmek için tıkla
                </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-2">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveThumb(i)}
                        className={`flex-1 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                            activeThumb === i
                                ? 'border-blue-600 opacity-100'
                                : 'border-transparent opacity-55 hover:opacity-90'
                        }`}
                    >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>

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
        <div className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-3 min-w-[80px]">
            <div className="text-blue-600">{icon}</div>
            <span className="text-xs text-gray-600 text-center leading-tight font-medium">{label}</span>
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CarDetailPage() {
    const [selectedDays] = useState(3)

    return (
        <div className="min-h-screen bg-[#F4F6F9]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=DM+Serif+Display&display=swap');
            `}</style>

            <div className="max-w-7xl mx-auto px-6 py-6 mt-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-400 pb-2">
                    <span className="hover:text-blue-600 cursor-pointer ">Ana sayfa</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="hover:text-blue-600 cursor-pointer">Hamburg</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-gray-700 font-medium">{CAR.name}</span>
                </nav>

                <div className="flex gap-6 items-start">

                    {/* ── Left Column ── */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Header */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">{CAR.category}</span>
                                        <span className="text-xs text-gray-400">{CAR.year}</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                        {CAR.name}
                                    </h1>
                                    <p className="text-sm text-gray-400 mt-0.5">{CAR.subtitle}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-400">Günlük fiyat</p>
                                    <p className="text-3xl font-bold text-gray-900 leading-none mt-0.5" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                        US${CAR.pricePerDay}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">{selectedDays} gün toplam: <span className="font-semibold text-gray-700">US${CAR.price3Day}</span></p>
                                </div>
                            </div>

                            {/* Specs row */}
                            <div className="flex gap-2 flex-wrap">
                                <SpecBadge icon={<Users className="w-5 h-5" />} label={`${CAR.seats} koltuk`} />
                                <SpecBadge icon={<Settings2 className="w-5 h-5" />} label={CAR.transmission} />
                                <SpecBadge icon={<Gauge className="w-5 h-5" />} label="Sınırsız km" />
                                <SpecBadge icon={<Wind className="w-5 h-5" />} label="Klimalı" />
                                <SpecBadge icon={<Car className="w-5 h-5" />} label={`${CAR.doors} kapı`} />
                                <SpecBadge icon={<Fuel className="w-5 h-5" />} label="Benzin" />
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <ImageGallery images={CAR.images} />
                        </div>

                        {/* Includes / Excludes */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Fiyata dahil olanlar</h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                <div className="space-y-2">
                                    {CAR.includes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {CAR.excludes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                                            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {CAR.winterFee && (
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-2.5 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    Fiyata kış mevsimi ücreti dahildir
                                </div>
                            )}
                        </div>

                        {/* Policies */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Kiralama koşulları</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { icon: <CreditCard className="w-4 h-4" />, label: 'Depozit', value: `US$${CAR.deposit}` },
                                    { icon: <Users className="w-4 h-4" />, label: 'Minimum yaş', value: `${CAR.minAge} yaş` },
                                    { icon: <Fuel className="w-4 h-4" />, label: 'Yakıt politikası', value: CAR.fuelPolicy },
                                    { icon: <Shield className="w-4 h-4" />, label: 'Sigorta', value: 'Temel sigorta dahil' },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                                        <div className="text-blue-600 mt-0.5">{icon}</div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-medium">{label}</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Location Map */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-base font-bold text-gray-900 mb-1">Alış konumu</h2>
                            <div className="flex items-center gap-1.5 mb-3">
                                <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                <span className="text-sm font-semibold text-blue-600">{CAR.location}</span>
                            </div>
                            <p className="text-xs text-gray-400 mb-3">{CAR.locationAddress}</p>
                            <div className="h-[240px] rounded-xl overflow-hidden border border-gray-200">
                                <LeafletMap lat={CAR.lat} lng={CAR.lng} />
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-gray-900">Değerlendirmeler</h2>
                                <div className="flex items-center gap-2">
                                    <div className="bg-amber-100 text-amber-700 text-sm font-black px-2.5 py-1 rounded-lg">
                                        {CAR.providerScore}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{CAR.providerLabel}</span>
                                    <span className="text-xs text-gray-400">{CAR.providerReviews} yorum</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {REVIEWS.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {review.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold text-gray-800">{review.author}</span>
                                                    <span className="text-xs text-gray-400">{review.date}</span>
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

                    {/* ── Right Column (sticky CTA) ── */}
                    <div className="w-[300px] flex-shrink-0 sticky top-4 space-y-3">

                        {/* Booking card */}
                        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
                            <div className="bg-[#003b94] px-5 py-4">
                                <p className="text-white/60 text-xs font-medium mb-0.5">3 günlük toplam</p>
                                <p className="text-white text-3xl font-bold leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>
                                    US${CAR.price3Day}
                                </p>
                                <p className="text-white/40 text-xs mt-1">Vergiler dahil · Kış ücreti dahil</p>
                            </div>

                            <div className="px-5 py-4 space-y-3">
                                {/* Dates */}
                                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Alış tarihi
                                        </div>
                                        <span className="text-xs font-semibold text-gray-800">12 Mar, 10:00</span>
                                    </div>
                                    <div className="border-t border-gray-200" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            İade tarihi
                                        </div>
                                        <span className="text-xs font-semibold text-gray-800">15 Mar, 10:00</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-2 bg-gray-50 rounded-xl p-3">
                                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-400">Alış / iade yeri</p>
                                        <p className="text-xs font-semibold text-gray-800 mt-0.5">{CAR.location}</p>
                                    </div>
                                </div>

                                {/* Price breakdown */}
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between text-gray-500">
                                        <span>US${CAR.pricePerDay} × 3 gün</span>
                                        <span>US${CAR.pricePerDay * 3}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Kış mevsimi ücreti</span>
                                        <span className="text-emerald-600 font-semibold">Dahil</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Temel sigorta</span>
                                        <span className="text-emerald-600 font-semibold">Dahil</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-800 text-sm">
                                        <span>Toplam</span>
                                        <span>US${CAR.price3Day}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors text-sm">
                                    Şimdi rezervasyon yap
                                </button>

                                <p className="text-center text-xs text-gray-400">Ücretsiz iptal · Şimdi öde sonra öde</p>
                            </div>
                        </div>

                        {/* Provider card */}
                        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                                    <span className="text-sm font-black text-blue-700">{CAR.provider}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded">
                                            {CAR.providerScore}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700">{CAR.providerLabel}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">{CAR.providerReviews} değerlendirme</p>
                                </div>
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
        </div>
    )
}