import { useState } from 'react'
import { Loader2, Send, LogIn, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} type="button"
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)}
                    className="transition-transform hover:scale-110"
                >
                    <Star size={20} className={n <= (hovered || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                </button>
            ))}
        </div>
    )
}

interface Props {
    isLoggedIn: boolean
    reviewScore: number
    reviewComment: string
    reviewSubmitting: boolean
    reviewSuccess: boolean
    reviewError: string
    onScoreChange: (v: number) => void
    onCommentChange: (v: string) => void
    onSubmit: (e: React.SyntheticEvent) => void
}

export default function CarReviewForm({
    isLoggedIn,
    reviewScore, reviewComment,
    reviewSubmitting, reviewSuccess, reviewError,
    onScoreChange, onCommentChange, onSubmit,
}: Props) {
    const t = useTranslations('cars')
    const router = useRouter()

    return (
        <div className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">{t('shareReview')}</h3>

            {!isLoggedIn ? (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-blue-700">{t('signInToReview')}</p>
                    <button
                        onClick={() => router.push('/signin')}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                        <LogIn size={15} /> {t('signIn')}
                    </button>
                </div>
            ) : reviewSuccess ? (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
                    <p className="text-green-700 font-bold">{t('reviewSubmitted')}</p>
                </div>
            ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('rating')}</label>
                        <StarInput value={reviewScore} onChange={onScoreChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{t('comment')}</label>
                        <textarea
                            value={reviewComment}
                            onChange={e => onCommentChange(e.target.value)}
                            rows={4}
                            placeholder={t('commentPlaceholder')}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-blue-400 resize-none"
                        />
                    </div>
                    {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                    <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                    >
                        {reviewSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {t('submit')}
                    </button>
                </form>
            )}
        </div>
    )
}
