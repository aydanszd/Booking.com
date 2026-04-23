'use client'
import { BASE } from '@/utils/imageUrl'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { carApi } from '@/api/carapi'
import bookingApi from '@/api/booking'
import { toast } from 'sonner'
import axios from 'axios'
import type { CarWithReviews } from '@/types/car'

export function useCarDetail(id: string) {
    const router = useRouter()

    const [car, setCar] = useState<CarWithReviews | null>(null)
    const [loading, setLoading] = useState(true)
    const [bookingLoading, setBookingLoading] = useState(false)
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
        const fetchCar = async () => {
            try {
                setLoading(true)
                const found = await carApi.getById(id)
                setCar(found)
            } catch (err: any) {
                toast.error(err.message)
                router.push('/carresults')
            } finally {
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    const bookedRanges = useMemo(() =>
        (car?.bookedDates || []).map(b => ({
            start: new Date(b.pickUp),
            end: new Date(b.dropOff),
        })),
    [car])

    const handleBooking = async (pickUp: string, dropOff: string, errorMsg: Record<string, string>) => {
        if (!pickUp || !dropOff) { toast.error(errorMsg.selectDates); return }
        const token = localStorage.getItem('token')
        if (!token) { toast.error(errorMsg.signInToBook); router.push('/signin'); return }

        const start = new Date(pickUp)
        const end = new Date(dropOff)
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        if (days <= 0) { toast.error(errorMsg.dropBeforePickup); return }

        try {
            setBookingLoading(true)
            await bookingApi.createBooking({
                type: 'car',
                car: car?._id,
                pickUp,
                dropOff,
                totalPrice: (car?.pricePerDay || 0) * days,
                guests: { adults: 1, children: 0 },
            })
            toast.success(errorMsg.bookingSuccess)
            router.push('/my-bookings')
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || errorMsg.bookingFailed)
        } finally {
            setBookingLoading(false)
        }
    }

    const handleReviewSubmit = async (errorMsg: Record<string, string>) => {
        if (reviewScore === 0) { setReviewError(errorMsg.selectStars); return }
        if (!reviewComment.trim()) { setReviewError(errorMsg.writeReview); return }
        const token = localStorage.getItem('token')
        if (!token) { setReviewError(errorMsg.signInToReview); return }
        setReviewError('')
        try {
            setReviewSubmitting(true)
            const res = await axios.post(
                `${BASE}/api/cars/${id}/review`,
                { score: reviewScore, comment: reviewComment },
                { headers: { Authorization: `Bearer ${token}` } },
            )
            setCar(res.data)
            setReviewSuccess(true)
            setReviewScore(0)
            setReviewComment('')
        } catch (err: any) {
            setReviewError(err.response?.data?.message || errorMsg.errorOccurred)
        } finally {
            setReviewSubmitting(false)
        }
    }

    return {
        car,
        loading,
        bookingLoading,
        isLoggedIn,
        bookedRanges,
        reviewScore, setReviewScore,
        reviewComment, setReviewComment,
        reviewSubmitting,
        reviewSuccess,
        reviewError,
        handleBooking,
        handleReviewSubmit,
    }
}
