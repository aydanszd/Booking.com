'use client'

import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function PersonalInfoSection({
    fullName, onFullNameChange,
    age, onAgeChange,
    idNumber, onIdNumberChange,
}: {
    fullName: string
    onFullNameChange: (v: string) => void
    age: string
    onAgeChange: (v: string) => void
    idNumber: string
    onIdNumberChange: (v: string) => void
}) {
    const t = useTranslations('checkout')

    return (
        <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <User size={18} className="text-white" />
                </div>
                <div>
                    <h2 className="text-base font-black text-gray-900">{t('personalInfo')}</h2>
                    <p className="text-xs text-gray-400 font-medium">{t('personalInfoSubtitle')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        {t('fullName')}
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={e => onFullNameChange(e.target.value)}
                        placeholder={t('fullNamePlaceholder')}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        {t('age')}
                    </label>
                    <input
                        type="number"
                        value={age}
                        onChange={e => onAgeChange(e.target.value)}
                        placeholder="25"
                        min={18}
                        max={100}
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                        {t('idPassport')}
                    </label>
                    <input
                        type="text"
                        value={idNumber}
                        onChange={e => onIdNumberChange(e.target.value)}
                        placeholder="AZE12345678"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-sm font-semibold text-gray-800 outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>
        </div>
    )
}
