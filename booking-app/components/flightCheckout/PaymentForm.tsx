'use client'

import { CreditCard, Lock, Shield, CheckCircle2, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { fmtCard, fmtExpiry } from '@/utils/flightCheckoutUtils'

interface Props {
    cardNumber: string
    expiry: string
    cvv: string
    totalPrice: number
    loading: boolean
    onCardNumberChange: (v: string) => void
    onExpiryChange: (v: string) => void
    onCvvChange: (v: string) => void
}

export default function PaymentForm({ cardNumber, expiry, cvv, totalPrice, loading, onCardNumberChange, onExpiryChange, onCvvChange }: Props) {
    const t = useTranslations('checkout')

    return (
        <>
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <CreditCard size={18} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-gray-900">{t('paymentInfo')}</h2>
                        <p className="text-xs text-gray-400 font-medium">{t('fullAmount', { amount: totalPrice })}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('cardNumber')}</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={cardNumber}
                                onChange={e => onCardNumberChange(fmtCard(e.target.value))}
                                placeholder="0000 0000 0000 0000"
                                inputMode="numeric"
                                className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                            />
                            <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('expiryDate')}</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={e => onExpiryChange(fmtExpiry(e.target.value))}
                                placeholder="MM/YY"
                                inputMode="numeric"
                                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors tracking-widest"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">{t('cvv')}</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={cvv}
                                    onChange={e => onCvvChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="•••"
                                    inputMode="numeric"
                                    className="w-full px-4 py-3 pr-10 rounded-2xl border-2 border-gray-200 text-sm font-bold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                />
                                <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-base transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
            >
                {loading
                    ? <><Loader2 size={20} className="animate-spin" /> {t('processing')}</>
                    : <><Lock size={16} /> {t('payAndGetTicket', { amount: totalPrice })}</>
                }
            </button>

            <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Shield size={12} /> {t('sslLabel')}</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t('secureLabel')}</span>
                <span className="flex items-center gap-1"><Lock size={12} /> {t('protectedLabel')}</span>
            </div>
        </>
    )
}
