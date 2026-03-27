'use client'

import { Loader2, Send, Star, LogIn, CornerDownRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { StarRating, StarInput } from './StarRating'
import type { CarDetailType, Review } from './types'

function fmtDate(d?: string) {
    if (!d) return ''
    return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ReviewSection({
    car,
    scoreLabel,
    isLoggedIn,
    reviewScore,
    reviewComment,
    reviewSubmitting,
    reviewSuccess,
    reviewError,
    onScoreChange,
    onCommentChange,
    onSubmit,
    onSignInClick,
}: {
    car: CarDetailType & { reviews?: Review[] }
    scoreLabel: (v: number) => string
    isLoggedIn: boolean
    reviewScore: number
    reviewComment: string
    reviewSubmitting: boolean
    reviewSuccess: boolean
    reviewError: string
    onScoreChange: (v: number) => void
    onCommentChange: (v: string) => void
    onSubmit: (e: React.SyntheticEvent) => void
    onSignInClick: () => void
}) {
    const t = useTranslations('cars')

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-sm sm:text-base font-bold text-gray-900">{t('reviews')}</h2>
                {(car.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-100 text-amber-700 text-sm font-black px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Star size={12} className="fill-amber-600 text-amber-600" /> {(car.rating ?? 0).toFixed(1)}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{scoreLabel(car.rating ?? 0)}</span>
                    </div>
                )}
            </div>

            {(car.reviews?.length ?? 0) > 0 ? (
                <div className="space-y-4 mb-6">
                    {car.reviews!.map(review => (
                        <div key={review._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    {(review.userName || 'G').charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-semibold text-gray-800 truncate">{review.userName || 'Guest'}</span>
                                        <span className="text-xs text-gray-400 shrink-0">{fmtDate(review.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <StarRating score={review.score} />
                                        <span className="text-xs font-bold text-amber-600">{review.score}/10</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{review.comment}</p>
                                    {review.adminReply && (
                                        <div className="mt-3 ml-2 bg-blue-50 border border-blue-100 rounded-xl p-3">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <CornerDownRight size={13} className="text-blue-600" />
                                                <span className="text-xs font-black text-blue-700 uppercase">{t('adminReply')}</span>
                                                {review.adminReplyAt && <span className="text-xs text-blue-400">{fmtDate(review.adminReplyAt)}</span>}
                                            </div>
                                            <p className="text-sm text-blue-800">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 mb-6">{t('noReviews')}</p>
            )}

            <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">{t('shareReview')}</h3>
                {!isLoggedIn ? (
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-sm font-semibold text-blue-700">{t('signInToReview')}</p>
                        <button onClick={onSignInClick}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                            <LogIn size={14} /> {t('signIn')}
                        </button>
                    </div>
                ) : reviewSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                        <p className="text-green-700 font-bold text-sm">{t('reviewSubmitted')}</p>
                    </div>
                ) : (
                    <form onSubmit={onSubmit} className="space-y-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('rating')}</label>
                            <StarInput value={reviewScore} onChange={onScoreChange} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">{t('comment')}</label>
                            <textarea
                                value={reviewComment}
                                onChange={e => onCommentChange(e.target.value)}
                                rows={3}
                                placeholder={t('commentPlaceholder')}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 resize-none"
                            />
                        </div>
                        {reviewError && <p className="text-red-500 text-xs">{reviewError}</p>}
                        <button type="submit" disabled={reviewSubmitting}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                            {reviewSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {t('submit')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
