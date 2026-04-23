import { BASE } from '@/utils/imageUrl'
'use client'

import { useEffect, useState } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import axios from 'axios'
import ReviewStatsBar from '@/components/adminReviews/ReviewStatsBar'
import ReviewFilterTabs from '@/components/adminReviews/ReviewFilterTabs'
import ReviewCard from '@/components/adminReviews/ReviewCard'
import type { ReviewItem, FilterType } from '@/types/review'
import { useAdminNotifications } from '@/context/AdminNotificationsContext'

export default function AdminReviewsPage() {
    const { markSeen } = useAdminNotifications();
    useEffect(() => { markSeen('reviews') }, []);
    const [reviews, setReviews] = useState<ReviewItem[]>([])
    const [loading, setLoading] = useState(true)
    const [replyText, setReplyText] = useState<Record<string, string>>({})
    const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})
    const [replying, setReplying] = useState<Record<string, boolean>>({})
    const [filter, setFilter] = useState<FilterType>('all')

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await axios.get(`${BASE}/api/admin/reviews`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setReviews(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchReviews() }, [])

    const handleReply = async (review: ReviewItem) => {
        const text = replyText[review._id]?.trim()
        if (!text) return
        setReplying(p => ({ ...p, [review._id]: true }))
        try {
            const token = localStorage.getItem('token')
            const endpoint = review.resourceType === 'hotel'
                ? `${BASE}/api/buildings/${review.resourceId}/review/${review._id}/reply`
                : `${BASE}/api/cars/${review.resourceId}/review/${review._id}/reply`
            await axios.post(endpoint, { reply: text }, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setReplyText(p => ({ ...p, [review._id]: '' }))
            setReplyOpen(p => ({ ...p, [review._id]: false }))
            fetchReviews()
        } catch (err) {
            console.error(err)
        } finally {
            setReplying(p => ({ ...p, [review._id]: false }))
        }
    }

    const filtered = reviews.filter(r => {
        if (filter === 'hotel')     return r.resourceType === 'hotel'
        if (filter === 'car')       return r.resourceType === 'car'
        if (filter === 'replied')   return !!r.adminReply
        if (filter === 'unreplied') return !r.adminReply
        return true
    })

    return (
        <div className="space-y-6">
            <ReviewStatsBar reviews={reviews} />

            <ReviewFilterTabs filter={filter} onChange={setFilter} />

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                    <MessageSquare size={40} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold">Rəy tapılmadı</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(review => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            replyText={replyText[review._id] || ''}
                            replyOpen={!!replyOpen[review._id]}
                            replying={!!replying[review._id]}
                            onReplyTextChange={text => setReplyText(p => ({ ...p, [review._id]: text }))}
                            onReplyOpenToggle={open => setReplyOpen(p => ({ ...p, [review._id]: open }))}
                            onReply={() => handleReply(review)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
