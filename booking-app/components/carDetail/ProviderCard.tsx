import { Phone, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarDetailType } from './types'

interface Props {
    car: CarDetailType
    scoreLabel: (v: number) => string
}

export default function ProviderCard({ car, scoreLabel }: Props) {
    const t = useTranslations('cars')
    if (!car.provider) return null

    return (
        <div className="bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5">
                    <span className="text-sm font-black text-blue-700">{car.provider}</span>
                </div>
                {car.rating !== undefined && (
                    <div>
                        <div className="flex items-center gap-1.5">
                            <div className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-0.5 rounded">
                                {car.rating.toFixed(1)}
                            </div>
                            <span className="text-xs font-semibold text-gray-700">{scoreLabel(car.rating)}</span>
                        </div>
                        {car.providerReviews && (
                            <p className="text-xs text-gray-400 mt-0.5">{t('providerReviews', { count: car.providerReviews })}</p>
                        )}
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {t('callProvider')}
                </button>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 text-xs font-semibold py-2.5 rounded-xl transition-colors">
                    <Mail className="w-3.5 h-3.5" /> {t('emailQuote')}
                </button>
            </div>
        </div>
    )
}
