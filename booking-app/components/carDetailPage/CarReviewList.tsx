import { Star, CornerDownRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarReview } from '@/types/car'

function fmtDate(d: string) {
    if (!d) return ''
    return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CarReviewList({ reviews }: { reviews: CarReview[] }) {
    const t = useTranslations('cars')

    if (!reviews?.length) return <p className="text-sm text-gray-400 mb-8">{t('noReviews')}</p>

    return (
        <div className="space-y-4 mb-8">
            {reviews.map(r => (
                <div key={r._id} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                                {(r.userName || 'G').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">{r.userName || 'Guest'}</p>
                                <p className="text-xs text-gray-400">{fmtDate(r.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-xl">
                            <Star size={11} fill="white" /> {r.score}
                        </div>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>

                    {r.adminReply && (
                        <div className="mt-4 ml-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CornerDownRight size={14} className="text-blue-600" />
                                <span className="text-xs font-black text-blue-700 uppercase">{t('adminReply')}</span>
                                {r.adminReplyAt && <span className="text-xs text-blue-400">{fmtDate(r.adminReplyAt)}</span>}
                            </div>
                            <p className="text-sm text-blue-800">{r.adminReply}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
