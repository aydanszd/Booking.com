'use client'

import { Plane } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { fmt, fmtDate, CABIN_LABELS } from '@/utils/flightCheckoutUtils'

interface Props {
    airline: string
    flightNum: string
    cabin: string
    logoSrc: string
    origin: string
    originCity: string
    dest: string
    destCity: string
    depTime: string
    arrTime: string
    adults: number
    children: number
    price: number
    totalPrice: number
}

export default function FlightSummaryCard({ airline, flightNum, cabin, logoSrc, origin, originCity, dest, destCity, depTime, arrTime, adults, children, price, totalPrice }: Props) {
    const t = useTranslations('checkout')
    const totalPassengers = adults + children

    return (
        <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="bg-blue-600 px-6 py-5 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        {logoSrc ? (
                            <img src={logoSrc} alt={airline} className="w-10 h-10 rounded-xl object-cover bg-white" />
                        ) : (
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                <Plane size={18} className="text-white" />
                            </div>
                        )}
                        <div>
                            <p className="font-black text-lg">{airline}</p>
                            <p className="text-blue-200 text-xs">{flightNum} · {CABIN_LABELS[cabin] || cabin}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <p className="text-3xl font-black">{fmt(depTime)}</p>
                            <p className="text-blue-200 text-xs mt-1">{origin} · {originCity}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-px bg-blue-300" />
                                <Plane size={14} className="text-blue-200" />
                                <div className="w-8 h-px bg-blue-300" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black">{fmt(arrTime)}</p>
                            <p className="text-blue-200 text-xs mt-1">{dest} · {destCity}</p>
                        </div>
                    </div>
                    <p className="text-center text-blue-200 text-xs mt-3">{fmtDate(depTime)}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        {adults > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">{t('adultsPassengers', { count: adults, price })}</span>
                                <span className="font-bold text-gray-800">${price * adults}</span>
                            </div>
                        )}
                        {children > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">{t('childrenPassengers', { count: children, price })}</span>
                                <span className="font-bold text-gray-800">${price * children}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-100 pt-4">
                        <div className="bg-blue-600 rounded-2xl p-4 text-white text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">{t('totalPayment')}</p>
                            <p className="text-3xl font-black">${totalPrice}</p>
                            <p className="text-blue-200 text-xs mt-1">{t('totalPassengersFull', { count: totalPassengers })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
