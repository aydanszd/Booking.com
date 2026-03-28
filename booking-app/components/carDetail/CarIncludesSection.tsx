import { CheckCircle2, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarDetailType } from './types'

export default function CarIncludesSection({ car }: { car: CarDetailType }) {
    const t = useTranslations('cars')

    const includes = car.includes ?? [
        t('thirdPartyInsurance'),
        t('theftProtection'),
        ...(car.mileage === 0 ? [t('unlimitedMileage')] : []),
        ...(car.winterFee ? [t('winterSeasonFee')] : []),
    ]

    const excludes = car.excludes ?? [
        t('fullyComprehensive'),
        ...(car.minAge && car.minAge > 21 ? [t('youngDriverFee', { age: car.minAge })] : []),
        t('fuel'),
    ]

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('whatsIncluded')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                <div className="space-y-2">
                    {includes.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {item}
                        </div>
                    ))}
                </div>
                <div className="space-y-2 mt-2 sm:mt-0">
                    {excludes.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-gray-500">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> {item}
                        </div>
                    ))}
                </div>
            </div>
            {car.winterFee && (
                <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {t('winterFeeIncludedMsg')}
                </div>
            )}
        </div>
    )
}
