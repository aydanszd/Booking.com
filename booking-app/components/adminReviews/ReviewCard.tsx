import { Star, CornerDownRight, Send, Loader2, Hotel, Car } from 'lucide-react'
import { fmtDate } from '@/types/review'
import type { ReviewItem } from '@/types/review'

interface Props {
    review: ReviewItem
    replyText: string
    replyOpen: boolean
    replying: boolean
    onReplyTextChange: (text: string) => void
    onReplyOpenToggle: (open: boolean) => void
    onReply: () => void
}

export default function ReviewCard({
    review,
    replyText,
    replyOpen,
    replying,
    onReplyTextChange,
    onReplyOpenToggle,
    onReply,
}: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#006ce4] flex items-center justify-center text-white text-sm font-black shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 text-sm">{review.userName}</p>
                        <p className="text-xs text-gray-400">{fmtDate(review.createdAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                        review.resourceType === 'hotel'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                    }`}>
                        {review.resourceType === 'hotel' ? <Hotel size={12} /> : <Car size={12} />}
                        {review.resourceTitle}
                    </div>
                    <div className="flex items-center gap-1 bg-[#006ce4] text-white text-xs font-black px-2.5 py-1 rounded-xl">
                        <Star size={11} fill="white" /> {review.score}
                    </div>
                </div>
            </div>

            {/* Comment */}
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.comment}</p>

            {/* Existing admin reply */}
            {review.adminReply && (
                <div className="ml-4 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CornerDownRight size={14} className="text-[#006ce4]" />
                        <span className="text-xs font-black text-[#006ce4] uppercase">Admin cavabı</span>
                        {review.adminReplyAt && (
                            <span className="text-xs text-blue-400">{fmtDate(review.adminReplyAt)}</span>
                        )}
                    </div>
                    <p className="text-sm text-blue-800">{review.adminReply}</p>
                </div>
            )}

            {/* Reply area */}
            <div className="flex items-center gap-3">
                {!replyOpen ? (
                    <button
                        onClick={() => onReplyOpenToggle(true)}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#006ce4] hover:underline"
                    >
                        <CornerDownRight size={13} />
                        {review.adminReply ? 'Cavabı redaktə et' : 'Cavab ver'}
                    </button>
                ) : (
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={replyText || review.adminReply || ''}
                            onChange={e => onReplyTextChange(e.target.value)}
                            rows={3}
                            placeholder="Admin cavabınızı yazın..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#006ce4] resize-none"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={onReply}
                                disabled={replying}
                                className="flex items-center gap-1.5 bg-[#006ce4] hover:bg-[#0057b8] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                                {replying ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                Göndər
                            </button>
                            <button
                                onClick={() => onReplyOpenToggle(false)}
                                className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-2"
                            >
                                Ləğv et
                            </button>
                        </div>
                    </div>
                )}
                {!review.adminReply && (
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                        Cavablanmayıb
                    </span>
                )}
            </div>
        </div>
    )
}
