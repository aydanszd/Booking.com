import { Shield, ThumbsUp, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TrustBadges() {
    const t = useTranslations('cars')

    const badges = [
        { icon: <Shield  className="w-4 h-4 text-emerald-500" />, key: 'securePayment' },
        { icon: <ThumbsUp className="w-4 h-4 text-blue-500" />,  key: 'freeCancellation' },
        { icon: <Info    className="w-4 h-4 text-amber-500" />,  key: 'support247' },
    ]

    return (
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100 space-y-2.5">
            {badges.map(({ icon, key }) => (
                <div key={key} className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                    {icon}
                    {t(key as any)}
                </div>
            ))}
        </div>
    )
}
