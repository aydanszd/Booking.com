'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
    label, icon, error, children,
}: {
    label: string
    icon?: React.ReactNode
    error?: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 tracking-wide">{label}</label>
            <div className="relative flex items-center flex-col">
                {icon && (
                    <span className="absolute left-3 top-[10px] text-gray-400 pointer-events-none z-10">
                        {icon}
                    </span>
                )}
                {children}
            </div>
            {error && <p className="text-[11px] text-red-500">{error}</p>}
        </div>
    )
}

// ─── Input ─────────────────────────────────────────────────────────────────────

function Input({
    hasIcon = true,
    hasError = false,
    rightSlot,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
    hasIcon?: boolean
    hasError?: boolean
    rightSlot?: React.ReactNode
}) {
    return (
        <div className="relative w-full flex items-center">
            <input
                {...props}
                className={[
                    'w-full h-10 rounded-lg border text-sm bg-white text-gray-900 outline-none transition-all',
                    'placeholder:text-gray-300 placeholder:text-[13px]',
                    hasIcon ? 'pl-[34px]' : 'pl-3',
                    rightSlot ? 'pr-9' : 'pr-3',
                    hasError
                        ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-[#003580] focus:ring-2 focus:ring-[#003580]/10',
                ].join(' ')}
            />
            {rightSlot}
        </div>
    )
}

// ─── Sign In Form ──────────────────────────────────────────────────────────────

export default function SignInForm() {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw]     = useState(false)
    const [errors, setErrors]     = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    const iconClass = 'w-[15px] h-[15px]'

    function validate(): Record<string, string> {
        const errs: Record<string, string> = {}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errs.email = 'Geçerli bir e-posta girin.'
        if (password.length < 8)
            errs.password = 'Şifre en az 8 karakter olmalı.'
        return errs
    }

    function handleSubmit() {
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length === 0) setSubmitted(true)
    }

    return (
        <div
            className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">

                {/* Logo */}
                <div className="mb-7">
                    <img
                        src="https://www.gstc.org/wp-content/uploads/Booking.com_comp.jpg"
                        alt="Booking.com"
                        className="h-8 w-auto object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                </div>

                {/* Heading */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Giriş yapın</h2>
                <p className="text-[13px] text-gray-500 mb-6">
                    Hesabınıza erişmek için bilgilerinizi girin.
                </p>

                {/* Fields */}
                <div className="space-y-3">
                    <Field label="E-posta" icon={<Mail className={iconClass} />} error={errors.email}>
                        <Input
                            type="email"
                            placeholder="ahmet@ornek.com"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            hasError={!!errors.email}
                        />
                    </Field>

                    <Field label="Şifre" icon={<Lock className={iconClass} />} error={errors.password}>
                        <Input
                            type={showPw ? 'text' : 'password'}
                            placeholder="Şifrenizi girin"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            hasError={!!errors.password}
                            rightSlot={
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1"
                                >
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            }
                        />
                    </Field>
                </div>

                {/* Forgot password */}
                <div className="flex justify-end mt-2">
                    <a href="#" className="text-[12px] text-[#003580] hover:underline font-medium">
                        Şifremi unuttum
                    </a>
                </div>

                {/* Submit */}
                <div className="mt-5">
                    <button
                        onClick={handleSubmit}
                        disabled={submitted}
                        className={[
                            'w-full h-11 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.99]',
                            submitted
                                ? 'bg-emerald-500 cursor-default'
                                : 'bg-[#003580] hover:bg-[#00235b]',
                        ].join(' ')}
                    >
                        {submitted ? '✓ Giriş başarılı!' : 'Giriş yap'}
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[11px] text-gray-400">veya</span>
                    <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Google SSO */}
                <button className="w-full h-11 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google ile giriş yap
                </button>

                {/* Register link */}
                <p className="text-center text-[13px] text-gray-500 mt-5">
                    Hesabınız yok mu?{' '}
                    <a href="#" className="text-[#003580] font-medium hover:underline">Kayıt olun</a>
                </p>
            </div>
        </div>
    )
}