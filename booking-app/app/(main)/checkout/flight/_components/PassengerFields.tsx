'use client'

import { useTranslations } from 'next-intl'

export default function PassengerFields({
    index, type, data, onChange,
}: {
    index: number
    type: 'adult' | 'child'
    data: { fullName: string; idNumber: string }
    onChange: (field: 'fullName' | 'idNumber', val: string) => void
}) {
    const t = useTranslations('checkout')

    return (
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-black">{index + 1}</span>
                </div>
                <span className="text-sm font-black text-gray-700">
                    {type === 'adult' ? t('adultPassenger', { num: index + 1 }) : t('childPassenger', { num: index + 1 })}
                </span>
                <span className="text-[10px] text-gray-400 font-medium ml-1">
                    {type === 'adult' ? `(${t('adultAgeRange')})` : `(${t('childAgeRange')})`}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('fullName')}</label>
                    <input
                        type="text"
                        value={data.fullName}
                        onChange={e => onChange('fullName', e.target.value)}
                        placeholder={t('fullNamePlaceholder')}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors bg-white"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('idPassport')}</label>
                    <input
                        type="text"
                        value={data.idNumber}
                        onChange={e => onChange('idNumber', e.target.value)}
                        placeholder="ID12345678"
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors bg-white"
                    />
                </div>
            </div>
        </div>
    )
}
