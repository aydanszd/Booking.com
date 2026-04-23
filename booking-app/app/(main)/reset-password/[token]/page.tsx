import { BASE } from '@/utils/imageUrl'
'use client'

import { useState } from 'react'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { useTranslations } from 'next-intl'

export default function ResetPasswordForm() {
    const t = useTranslations('auth')
    const router = useRouter()
    const { token } = useParams()
    const [password, setPassword] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirmPw) return toast.error(t('mismatchError'))
        if (password.length < 8) return toast.error(t('minLengthError'))

        setLoading(true)
        try {
            await axios.post(`${BASE}/api/auth/reset-password/${token}`, { password })
            toast.success(t('resetSuccess'))
            setTimeout(() => {
                router.push('/signin')
            }, 2000)
        } catch (err: any) {
            toast.error(err.response?.data?.message || t('resetError'))
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t('resetTitle')}</h2>
                <p className="text-sm text-gray-500 mb-8">{t('resetSubtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">{t('newPasswordLabel')}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                required
                                placeholder={t('passwordMin')}
                                className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-200 text-sm focus:border-[#003580] outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-500">{t('confirmPassword')}</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder={t('confirmPlaceholder')}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:border-[#003580] outline-none transition-all"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-[#003580] hover:bg-[#00235b] text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('resetBtn')}
                    </button>
                </form>
            </div>
        </div>
    )
}
