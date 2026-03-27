'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Users, Settings2, Gauge, MapPin, CheckCircle2,
    ChevronRight, Shield, Fuel, Wind,
    Phone, Mail, Info, CreditCard, AlertCircle, ThumbsUp, Car,
    Loader2, Snowflake, Navigation, Wifi,
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import type { CarDetailType } from './_components/types'
import GoogleMap from './_components/GoogleMap'
import ImageGallery from './_components/ImageGallery'
import SpecBadge from './_components/SpecBadge'
import BookingCard from './_components/BookingCard'
import MobileStickyBar from './_components/MobileStickyBar'
import MobileBookingSheet from './_components/MobileBookingSheet'
import ReviewSection from './_components/ReviewSection'

const BASE = 'http://localhost:5000'
const API = `${BASE}/api/cars`

function CarDetailInner() {
    const t = useTranslations('cars')
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

    const scoreLabel = (v: number) => {
        if (v >= 9) return t('scoreSuper')
        if (v >= 8) return t('scoreVeryGood')
        if (v >= 7) return t('scoreGood')
        return t('scoreOkay')
    }

    const [car, setCar] = useState<CarDetailType | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)
    const [pickUp, setPickUp] = useState(searchParams.get('pickUp') || '')
    const [dropOff, setDropOff] = useState(searchParams.get('dropOff') || '')
    const [bookingLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const [reviewScore, setReviewScore] = useState(0)
    const [reviewComment, setReviewComment] = useState('')
    const [reviewSubmitting, setReviewSubmitting] = useState(false)
    const [reviewSuccess, setReviewSuccess] = useState(false)
    const [reviewError, setReviewError] = useState('')

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'))
    }, [])

    useEffect(() => {
        if (!id) { setError(t('carIdNotFound')); setLoading(false); return }
        setLoading(true)
        fetch(`${API}/${id}`)
            .then(res => { if (!res.ok) throw new Error(t('carNotFound')); return res.json() })
            .then(data => { setCar(data); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [id])

    const bookedRanges = useMemo(() =>
        ((car as any)?.bookedDates || []).map((b: any) => ({
            start: new Date(b.pickUp),
            end: new Date(b.dropOff),
        })),
    [car])

    const days = (pickUp && dropOff)
        ? Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
        : 0

    const handleBooking = () => {
        if (!pickUp || !dropOff) { toast.error(t('selectDates')); return }
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) { toast.error(t('signInToBook')); router.push('/signin'); return }
        if (days <= 0) { toast.error(t('dropBeforePickup')); return }
        const totalPrice = (car?.pricePerDay || 0) * days
        const image = car?.images?.[0] || ''
        const params = new URLSearchParams({
            type: 'car',
            id: car?._id || '',
            title: car?.title || '',
            image,
            pickUp,
            dropOff,
            pricePerDay: String(car?.pricePerDay || 0),
            totalPrice: String(totalPrice),
            days: String(days),
        })
        router.push(`/checkout?${params.toString()}`)
    }

    const handleReviewSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (reviewScore === 0) { setReviewError(t('selectStars')); return }
        if (!reviewComment.trim()) { setReviewError(t('writeReview')); return }
        setReviewError('')
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) { setReviewError(t('signInToReview')); return }
        try {
            setReviewSubmitting(true)
            const res = await axios.post(
                `${API}/${id}/review`,
                { score: reviewScore, comment: reviewComment },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setCar(res.data)
            setReviewSuccess(true)
            setReviewScore(0)
            setReviewComment('')
        } catch (err: any) {
            setReviewError(err.response?.data?.message || t('errorOccurred'))
        } finally {
            setReviewSubmitting(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-500 text-sm">{t('loading')}</span>
        </div>
    )

    if (error || !car) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <p className="text-red-500 font-semibold">{error ?? t('carNotFound')}</p>
            <button onClick={() => router.push('/carfilter')} className="text-blue-600 hover:underline text-sm">
                {t('backToCars')}
            </button>
        </div>
    )

    const featureIcons: Record<string, any> = {
        'Klima': Snowflake, 'GPS': Navigation, 'WiFi': Wifi, 'Bluetooth': Wifi, 'Yakıt': Fuel,
    }

    const displayIncludes = car.includes ?? [
        t('thirdPartyInsurance'),
        t('theftProtection'),
        ...(car.mileage === 0 ? [t('unlimitedMileage')] : []),
        ...(car.winterFee ? [t('winterSeasonFee')] : []),
    ]

    const displayExcludes = car.excludes ?? [
        t('fullyComprehensive'),
        ...(car.minAge && car.minAge > 21 ? [t('youngDriverFee', { age: car.minAge })] : []),
        t('fuel'),
    ]

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 mt-4 sm:mt-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-400 pb-2">
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/')}>{t('home')}</span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/carfilter')}>
                        {car.location.city}
                    </span>
                    <ChevronRight className="w-3 h-3 shrink-0" />
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
                                            {car.isAvailable ? t('available') : t('notAvailableNow')}
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
                                <div className="text-right shrink-0">
                                    <p className="text-xs text-gray-400">{t('dailyPrice')}</p>
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
                                <SpecBadge icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('seats', { count: car.seats })} />
                                <SpecBadge
                                    icon={<Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    label={car.transmission === 'automatic' ? t('automatic') : t('manual')}
                                />
                                <SpecBadge
                                    icon={<Gauge className="w-4 h-4 sm:w-5 sm:h-5" />}
                                    label={car.mileage > 0 ? `${car.mileage.toLocaleString()} km` : t('unlimitedKm')}
                                />
                                <SpecBadge icon={<Wind className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('withAC')} />
                                {car.doors && (
                                    <SpecBadge icon={<Car className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('doorsCount', { count: car.doors })} />
                                )}
                                <SpecBadge icon={<Fuel className="w-4 h-4 sm:w-5 sm:h-5" />} label={t('petrol')} />
                            </div>
                        </div>

                        {/* Gallery */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <ImageGallery images={car.images ?? []} title={car.title} />
                        </div>

                        {/* Extra Features */}
                        {car.features?.length > 0 && (
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                                <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('extraFeatures')}</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {car.features.map((f, i) => {
                                        const Icon = Object.entries(featureIcons).find(([k]) => f.includes(k))?.[1] ?? CheckCircle2
                                        return (
                                            <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                                                <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                                                <span className="text-sm text-gray-700 font-medium">{f}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Includes / Excludes */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('whatsIncluded')}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                <div className="space-y-2">
                                    {displayIncludes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2 mt-2 sm:mt-0">
                                    {displayExcludes.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {car.winterFee && (
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    {t('winterFeeIncludedMsg')}
                                </div>
                            )}
                        </div>

                        {/* Policies */}
                        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('rentalTerms')}</h2>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                {[
                                    { icon: <CreditCard className="w-4 h-4" />, label: t('deposit'), value: `US$${car.deposit ?? 200}` },
                                    { icon: <Users className="w-4 h-4" />, label: t('minAge'), value: t('ageYears', { count: car.minAge ?? 21 }) },
                                    { icon: <Fuel className="w-4 h-4" />, label: t('fuelPolicyLabel'), value: car.fuelPolicy ?? t('fuelPolicyDefault') },
                                    { icon: <Shield className="w-4 h-4" />, label: t('insurance'), value: t('basicInsuranceIncluded') },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                                        <div className="text-blue-600 mt-0.5 shrink-0">{icon}</div>
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
                            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1">{t('pickupLocationLabel')}</h2>
                            <div className="flex items-center gap-1.5 mb-1.5 sm:mb-3">
                                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="text-sm font-semibold text-blue-600">
                                    {car.location.city}, {car.location.country}
                                </span>
                            </div>
                            {car.location.address && (
                                <p className="text-xs text-gray-400 mb-3">{car.location.address}</p>
                            )}
                            <div className="h-50 sm:h-60 rounded-xl overflow-hidden border border-gray-200">
                                <GoogleMap
                                    lat={car.location.lat}
                                    lng={car.location.lng}
                                    city={car.location.city}
                                    country={car.location.country}
                                />
                            </div>
                        </div>

                        {/* Reviews */}
                        <ReviewSection
                            car={car as any}
                            scoreLabel={scoreLabel}
                            isLoggedIn={isLoggedIn}
                            reviewScore={reviewScore}
                            reviewComment={reviewComment}
                            reviewSubmitting={reviewSubmitting}
                            reviewSuccess={reviewSuccess}
                            reviewError={reviewError}
                            onScoreChange={setReviewScore}
                            onCommentChange={setReviewComment}
                            onSubmit={handleReviewSubmit}
                            onSignInClick={() => router.push('/signin')}
                        />
                    </div>

                    {/* ── Right Column (desktop) ── */}
                    <div className="hidden lg:block w-75 shrink-0 sticky top-4 space-y-3">
                        <BookingCard
                            car={car}
                            pickUp={pickUp}
                            dropOff={dropOff}
                            onPickUpChange={setPickUp}
                            onDropOffChange={setDropOff}
                            bookedRanges={bookedRanges}
                            onBook={handleBooking}
                            bookingLoading={bookingLoading}
                        />

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
                                                <p className="text-xs text-gray-400 mt-0.5">{t('providerReviews', { count: car.providerReviews })}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                                        <Phone className="w-3.5 h-3.5" /> {t('callProvider')}
                                    </button>
                                    <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                                        <Mail className="w-3.5 h-3.5" /> {t('emailQuote')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Trust badges */}
                        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100 space-y-2.5">
                            {[
                                { icon: <Shield className="w-4 h-4 text-emerald-500" />, key: 'securePayment' },
                                { icon: <ThumbsUp className="w-4 h-4 text-blue-500" />, key: 'freeCancellation' },
                                { icon: <Info className="w-4 h-4 text-amber-500" />, key: 'support247' },
                            ].map(({ icon, key }) => (
                                <div key={key} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                                    {icon}
                                    {t(key as any)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <MobileStickyBar price={car.pricePerDay} days={days} onBook={() => setSheetOpen(true)} />

            <MobileBookingSheet
                open={sheetOpen}
                onClose={() => setSheetOpen(false)}
                car={car}
                pickUp={pickUp}
                dropOff={dropOff}
                onPickUpChange={setPickUp}
                onDropOffChange={setDropOff}
                bookedRanges={bookedRanges}
                onBook={handleBooking}
                bookingLoading={bookingLoading}
            />
        </>
    )
}

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
