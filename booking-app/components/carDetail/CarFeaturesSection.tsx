import { CheckCircle2, Snowflake, Navigation, Wifi, Fuel } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarDetailType } from './types'

const FEATURE_ICONS: Record<string, any> = {
    'Klima': Snowflake,
    'GPS': Navigation,
    'WiFi': Wifi,
    'Bluetooth': Wifi,
    'Yakıt': Fuel,
}

export default function CarFeaturesSection({ features }: { features: CarDetailType['features'] }) {
    const t = useTranslations('cars')
    if (!features?.length) return null

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('extraFeatures')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {features.map((f, i) => {
                    const Icon = Object.entries(FEATURE_ICONS).find(([k]) => f.includes(k))?.[1] ?? CheckCircle2
                    return (
                        <div key={i} className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                            <Icon className="w-4 h-4 text-blue-500 shrink-0" />
                            <span className="text-sm text-gray-700 font-medium">{f}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
