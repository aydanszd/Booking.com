'use client'

import { Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
    adults: number
    children: number
    totalPrice: number
    onAdultsChange: (v: number) => void
    onChildrenChange: (v: number) => void
}

export default function PassengerCountSelector({ adults, children, totalPrice, onAdultsChange, onChildrenChange }: Props) {
    const t = useTranslations('checkout')
    const totalPassengers = adults + children

    return (
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <Users size={18} className="text-white" />
                </div>
                <div>
                    <h2 className="text-base font-black text-gray-900">{t('passengerCount')}</h2>
                    <p className="text-xs text-gray-400 font-medium">{t('totalPassengersInfo', { count: totalPassengers, amount: totalPrice })}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { labelKey: 'adultLabel', subKey: 'adultAgeRange', value: adults, min: 1, set: onAdultsChange },
                    { labelKey: 'childLabel', subKey: 'childAgeRange', value: children, min: 0, set: onChildrenChange },
                ].map(({ labelKey, subKey, value, min, set }) => (
                    <div key={labelKey} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <div>
                            <p className="text-sm font-black text-gray-800">{t(labelKey as any)}</p>
                            <p className="text-[10px] text-gray-400">{t(subKey as any)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => set(Math.max(min, value - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-lg transition-colors">−</button>
                            <span className="w-5 text-center text-sm font-black text-gray-900">{value}</span>
                            <button type="button" onClick={() => set(value + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-blue-400 hover:text-blue-600 font-bold text-lg transition-colors">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
