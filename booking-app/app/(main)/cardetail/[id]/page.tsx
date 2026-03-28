'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCarDetail } from '@/hooks/useCarDetail'
import CarInfoCard from '@/components/carDetailPage/CarInfoCard'
import CarBookingCard from '@/components/carDetailPage/CarBookingCard'
import CarReviewList from '@/components/carDetailPage/CarReviewList'
import CarReviewForm from '@/components/carDetailPage/CarReviewForm'
import { buildCarErrorMsg, calcDays, CarDetailLoading } from '@/utils/carDetailUtils'

export default function CarDetailPage() {
    const t = useTranslations('cars')
    const params = useParams()
    const id = params.id as string
    const searchParams = useSearchParams()

    const [pickUp, setPickUp] = useState(searchParams.get('pickUp') || '')
    const [dropOff, setDropOff] = useState(searchParams.get('dropOff') || '')

    const {
        car, loading, bookingLoading, isLoggedIn, bookedRanges,
        reviewScore, setReviewScore,
        reviewComment, setReviewComment,
        reviewSubmitting, reviewSuccess, reviewError,
        handleBooking, handleReviewSubmit,
    } = useCarDetail(id)

    const days = calcDays(pickUp, dropOff)
    const errorMsg = buildCarErrorMsg(t)

    if (loading || !car) return <CarDetailLoading label={t('loading')} />

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2">
                        <CarInfoCard car={car} />
                    </div>

                    <div className="lg:col-span-1">
                        <CarBookingCard
                            car={car}
                            pickUp={pickUp}
                            dropOff={dropOff}
                            days={days}
                            bookedRanges={bookedRanges}
                            bookingLoading={bookingLoading}
                            onPickUpChange={setPickUp}
                            onDropOffChange={setDropOff}
                            onBook={() => handleBooking(pickUp, dropOff, errorMsg)}
                        />
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-8">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{t('reviews')}</h2>
                        {(car.rating ?? 0) > 0 && (
                            <div className="flex items-center gap-1.5 bg-blue-600 text-white font-black px-3 py-1.5 rounded-xl text-sm">
                                <Star size={14} fill="white" /> {car.rating}
                            </div>
                        )}
                    </div>

                    <CarReviewList reviews={car.reviews || []} />

                    <CarReviewForm
                        isLoggedIn={isLoggedIn}
                        reviewScore={reviewScore}
                        reviewComment={reviewComment}
                        reviewSubmitting={reviewSubmitting}
                        reviewSuccess={reviewSuccess}
                        reviewError={reviewError}
                        onScoreChange={setReviewScore}
                        onCommentChange={setReviewComment}
                        onSubmit={e => handleReviewSubmit(errorMsg)}
                    />
                </div>
            </div>
        </div>
    )
}
