import { CreditCard, Users, Fuel, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarDetailType } from './types'

export default function CarPoliciesSection({ car }: { car: CarDetailType }) {
    const t = useTranslations('cars')

    const policies = [
        { icon: <CreditCard className="w-4 h-4" />, label: t('deposit'),         value: `US$${car.deposit ?? 200}` },
        { icon: <Users      className="w-4 h-4" />, label: t('minAge'),          value: t('ageYears', { count: car.minAge ?? 21 }) },
        { icon: <Fuel       className="w-4 h-4" />, label: t('fuelPolicyLabel'), value: car.fuelPolicy ?? t('fuelPolicyDefault') },
        { icon: <Shield     className="w-4 h-4" />, label: t('insurance'),       value: t('basicInsuranceIncluded') },
    ]

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.07)] border border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">{t('rentalTerms')}</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {policies.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                        <div className="text-blue-600 mt-0.5 shrink-0">{icon}</div>
                        <div className="min-w-0">
                            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{label}</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-0.5 leading-tight">{value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
