'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import type { CarDetailType } from '@/components/carDetail/types'
import { BASE } from '@/utils/imageUrl'

const API = `${BASE}/api/cars`

export function useCarDetails(t: (key: string, opts?: any) => string) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')

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
        const params = new URLSearchParams({
            type: 'car',
            id: car?._id || '',
            title: car?.title || '',
            image: car?.images?.[0] || '',
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
                { headers: { Authorization: `Bearer ${token}` } },
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

    return {
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
    }
}
