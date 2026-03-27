'use client'

import { CreditCard, Lock, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

function fmtCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function fmtExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
}

export default function PaymentSection({
    cardNumber, onCardNumberChange,
    expiry, onExpiryChange,
    cvv, onCvvChange,
    deposit, totalPrice, type,
}: {
    cardNumber: string
    onCardNumberChange: (v: string) => void
    expiry: string
    onExpiryChange: (v: string) => void
    cvv: string
    onCvvChange: (v: string) => void
    deposit: number
    totalPrice: number
    type: string
}) {
    const t = useTranslations('checkout')

    return (
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <CreditCard size={18} className="text-white" />
                </div>
                <div>
                    <h2 className="text-base font-black text-gray-900">{t('paymentInfo')}</h2>
                    <p className="text-xs text-gray-400 font-medium">{t('paymentInfoSubtitle')}</p>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-xs font-black text-amber-800">{t('payNow30')}</p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">
                        {t('payLaterDesc', {
                            amount: totalPrice - deposit,
                            percent: Math.round((1 - deposit / totalPrice) * 100),
                            when: type === 'car' ? t('pickupWhen') : t('checkInWhen'),
                        })}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        {t('cardNumber')}
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={e => onCardNumberChange(fmtCard(e.target.value))}
                            placeholder="0000 0000 0000 0000"
                            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                            inputMode="numeric"
                        />
                        <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                            {t('expiryDate')}
                        </label>
                        <input
                            type="text"
                            value={expiry}
                            onChange={e => onExpiryChange(fmtExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                            inputMode="numeric"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                            {t('cvv')}
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={cvv}
                                onChange={e => onCvvChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="•••"
                                className="w-full px-4 py-3 pr-10 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                inputMode="numeric"
                            />
                            <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
