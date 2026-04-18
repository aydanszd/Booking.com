'use client'
import { Suspense } from 'react'
import { Loader2, ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCarDetails } from '@/hooks/useCarDetails'
import CarHeaderSection from '@/components/carDetail/CarHeaderSection'
import CarFeaturesSection from '@/components/carDetail/CarFeaturesSection'
import CarIncludesSection from '@/components/carDetail/CarIncludesSection'
import CarPoliciesSection from '@/components/carDetail/CarPoliciesSection'
import CarLocationSection from '@/components/carDetail/CarLocationSection'
import ProviderCard from '@/components/carDetail/ProviderCard'
import TrustBadges from '@/components/carDetail/TrustBadges'
import ImageGallery from '@/components/carDetail/ImageGallery'
import BookingCard from '@/components/carDetail/BookingCard'
import MobileStickyBar from '@/components/carDetail/MobileStickyBar'
import MobileBookingSheet from '@/components/carDetail/MobileBookingSheet'
import ReviewSection from '@/components/carDetail/ReviewSection'

function CarDetailInner() {
    const t = useTranslations('cars')

    const scoreLabel = (v: number) => {
        if (v >= 9) return t('scoreSuper')
        if (v >= 8) return t('scoreVeryGood')
        if (v >= 7) return t('scoreGood')
        return t('scoreOkay')
    }

    const {
        car, loading, error,
        sheetOpen, setSheetOpen,
        pickUp, setPickUp,
        dropOff, setDropOff,
        bookingLoading, isLoggedIn,
        bookedRanges, days,
        reviewScore, setReviewScore,
        reviewComment, setReviewComment,
        reviewSubmitting, reviewSuccess, reviewError,
        handleBooking, handleReviewSubmit,
        router,
    } = useCarDetails(t)

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
                    {/* Left column */}
                    <div className="w-full lg:flex-1 lg:min-w-0 space-y-4 sm:space-y-5">
                        <CarHeaderSection car={car} scoreLabel={scoreLabel} />

                        <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
                            <ImageGallery images={car.images ?? []} title={car.title} />
                        </div>

                        <CarFeaturesSection features={car.features} />
                        <CarIncludesSection car={car} />
                        <CarPoliciesSection car={car} />
                        <CarLocationSection car={car} />

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

                    {/* Right column */}
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
                        <ProviderCard car={car} scoreLabel={scoreLabel} />
                        <TrustBadges />
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
