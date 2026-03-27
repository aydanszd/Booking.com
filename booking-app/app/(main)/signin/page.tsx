'use client'

import { useState, useEffect } from 'react'
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { useTranslations } from 'next-intl'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function Field({ label, icon, error, children }: {
    label: string; icon?: React.ReactNode; error?: string; children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 tracking-wide">{label}</label>
            <div className="relative flex items-center flex-col">
                {icon && <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none z-10">{icon}</span>}
                {children}
            </div>
            {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
    )
}

function Input({ hasIcon = true, hasError = false, rightSlot, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {
    hasIcon?: boolean; hasError?: boolean; rightSlot?: React.ReactNode
}) {
    return (
        <div className="relative w-full flex items-center">
            <input
                {...props}
                className={[
                    'w-full h-10 rounded-lg border text-sm bg-white text-gray-900 outline-none transition-all',
                    'placeholder:text-gray-300 placeholder:text-[13px]',
                    hasIcon ? 'pl-8.5' : 'pl-3',
                    rightSlot ? 'pr-9' : 'pr-3',
                    hasError ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/10',
                ].join(' ')}
            />
            {rightSlot}
        </div>
    )
}

export default function SignInForm() {
    const t = useTranslations('auth')
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [googleError, setGoogleError] = useState('')
    const iconClass = 'w-[15px] h-[15px]'

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('error') === 'google_failed') {
            setGoogleError(t('googleError'))
            window.history.replaceState({}, '', window.location.pathname)
        }
    }, [])

    function validate(): Record<string, string> {
        const errs: Record<string, string> = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t('emailError')
        if (password.length < 8) errs.password = t('passwordError')
        return errs
    }

    async function handleSubmit() {
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length > 0) return
        setLoading(true)
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, { email, password })
            toast.success(t('signinSuccess'))
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setTimeout(() => router.push('/'), 1000)
        } catch (err: any) {
            const msg = err.response?.data?.message || t('signinError')
            toast.error(msg)
            setLoading(false)
        }
    }

    function handleGoogleLogin() {
        setGoogleLoading(true)
        window.location.href = `${API_URL}/auth/google`
    }

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">
                <div className="mb-7">
                    <img src="https://www.gstc.org/wp-content/uploads/Booking.com_comp.jpg" alt="Booking.com" className="h-8 w-auto object-contain" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('signinTitle')}</h2>
                <p className="text-[13px] text-gray-500 mb-6">{t('signinSubtitle')}</p>

                {googleError && (
                    <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                        <span className="text-red-400 text-base">⚠</span>
                        <p className="text-[12px] text-red-600">{googleError}</p>
                    </div>
                )}

                <div className="space-y-3">
                    <Field label={t('email')} icon={<Mail className={iconClass} />} error={errors.email}>
                        <Input type="email" placeholder={t('emailPlaceholder')} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} hasError={!!errors.email} />
                    </Field>
                    <Field label={t('password')} icon={<Lock className={iconClass} />} error={errors.password}>
                        <Input type={showPw ? 'text' : 'password'} placeholder={t('passwordPlaceholder')} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} hasError={!!errors.password}
                            rightSlot={
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            }
                        />
                    </Field>
                </div>

                <div className="flex justify-end mt-2">
                    <Link href="/forgot-password" className="text-[12px] text-[#003580] hover:underline font-medium">{t('forgotPassword')}</Link>
                </div>

                <div className="mt-5">
                    <button onClick={handleSubmit} disabled={loading}
                        className={['w-full h-11 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.99] flex items-center justify-center gap-2', loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003580] hover:bg-[#00235b]'].join(' ')}>
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? t('signingIn') : t('signinBtn')}
                    </button>
                </div>

                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[11px] text-gray-400">{t('or')}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                <button onClick={handleGoogleLogin} disabled={googleLoading}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed">
                    {googleLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin text-gray-400" /><span>{t('redirecting')}</span></>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span>{t('googleSignin')}</span>
                        </>
                    )}
                </button>

                <p className="text-center text-[13px] text-gray-500 mt-5">
                    {t('noAccount')}{' '}
                    <Link href="/register" className="text-[#003580] font-medium hover:underline">{t('registerLink')}</Link>
                </p>
            </div>
        </div>
    )
}
