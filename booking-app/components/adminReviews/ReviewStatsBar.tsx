import type { ReviewItem } from '@/types/review'

export default function ReviewStatsBar({ reviews }: { reviews: ReviewItem[] }) {
    const stats = {
        total: reviews.length,
        replied: reviews.filter(r => r.adminReply).length,
        unreplied: reviews.filter(r => !r.adminReply).length,
        avgScore: reviews.length
            ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
            : '–',
    }

    const cards = [
        { label: 'Ümumi rəylər',   value: stats.total,     color: 'text-blue-600' },
        { label: 'Cavablanıb',     value: stats.replied,   color: 'text-green-600' },
        { label: 'Cavablanmayıb', value: stats.unreplied, color: 'text-orange-500' },
        { label: 'Orta qiymət',   value: stats.avgScore,  color: 'text-purple-600' },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">{label}</p>
                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                </div>
            ))}
        </div>
    )
}
