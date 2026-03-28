'use client'

import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'

function fmtDate(s: string) {
    if (!s) return '—'
    return new Date(s).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OrderSummary({
    imgSrc, title, type, TypeIcon,
    startLabel, endLabel, startDate, endDate,
    pricePerDay, days, totalPrice, deposit,
}: {
    imgSrc: string
    title: string
    type: string
    TypeIcon: React.ElementType
    startLabel: string
    endLabel: string
    startDate: string
    endDate: string
    pricePerDay: number
    days: number
    totalPrice: number
    deposit: number
}) {
    const t = useTranslations('checkout')

    return (
        <div className="space-y-4 sticky top-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <div className="h-44 bg-linear-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                    {imgSrc ? (
                        <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <TypeIcon size={48} className="text-blue-200" />
                        </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                        <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-gray-700 shadow">
                            <TypeIcon size={12} />
                            {type === 'car' ? t('typeCar') : type === 'flight' ? t('typeFlight') : t('typeHotel')}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{title}</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">
                                <CalendarDays size={10} /> {startLabel}
                            </div>
                            <p className="text-sm font-black text-gray-800">{fmtDate(startDate)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">
                                <CalendarDays size={10} /> {endLabel}
                            </div>
                            <p className="text-sm font-black text-gray-800">{fmtDate(endDate)}</p>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm pt-2 border-t border-gray-100">
                        {pricePerDay > 0 && (
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>${pricePerDay} × {days} {type === 'building' ? t('nightUnit') : t('dayUnit')}</span>
                                <span>${totalPrice}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-500 font-medium">
                            <span>{t('basicInsurance')}</span>
                            <span className="text-green-600 font-bold">{t('included')}</span>
                        </div>
                    </div>

                    <div className="border-t-2 border-dashed border-gray-100 pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('totalAmount')}</span>
                            <span className="text-2xl font-black text-gray-900">${totalPrice}</span>
                        </div>
                        <div className="bg-blue-600 rounded-2xl p-4 text-white">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">{t('payNowPercent')}</p>
                            <p className="text-3xl font-black leading-none">${deposit}</p>
                            <p className="text-xs text-blue-200 mt-1.5 font-medium">
                                {t('remainingPickup', {
                                    amount: totalPrice - deposit,
                                    when: type === 'car' ? t('pickupWhen') : t('checkInWhen'),
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs font-black text-gray-700 mb-1">{t('needHelp')}</p>
                <p className="text-xs text-gray-400 font-medium">{t('supportReady')}</p>
            </div>
        </div>
    )
}
