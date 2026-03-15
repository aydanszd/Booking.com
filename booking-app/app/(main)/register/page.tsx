'use client'

import { useState, useRef } from 'react'
import {
    User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, Check
} from 'lucide-react'

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string): number {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
}

const STRENGTH_COLORS = ['#e24b4a', '#ef9f27', '#003580', '#1d9e75']
const STRENGTH_LABELS = ['Çok zayıf', 'Zayıf', 'İyi', 'Güçlü']

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
    label, icon, error, hint, children,
}: {
    label: string
    icon?: React.ReactNode
    error?: string
    hint?: string
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
            {hint && !error && <p className="text-[11px] text-gray-400">{hint}</p>}
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

// ─── Stepper ───────────────────────────────────────────────────────────────────

const STEPS = [
    { label: 'Kişisel' },
    { label: 'İletişim' },
    { label: 'Güvenlik' },
    { label: 'Onay' },
]

function Stepper({ current }: { current: number }) {
    return (
        <div className="flex items-start mb-7">
            {STEPS.map((step, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                        <div
                            className={[
                                'w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold border-2 transition-all duration-300',
                                i < current
                                    ? 'bg-[#1d9e75] border-[#1d9e75] text-white'
                                    : i === current
                                        ? 'bg-[#003580] border-[#003580] text-white'
                                        : 'bg-white border-gray-200 text-gray-400',
                            ].join(' ')}
                        >
                            {i < current ? <Check className="w-4 h-4" /> : i + 1}
                        </div>
                        <span
                            className={[
                                'text-[10px] mt-1 whitespace-nowrap',
                                i < current
                                    ? 'text-[#1d9e75] font-medium'
                                    : i === current
                                        ? 'text-[#003580] font-semibold'
                                        : 'text-gray-400',
                            ].join(' ')}
                        >
                            {step.label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={[
                                'flex-1 h-0.5 mx-1 mt-[-12px] transition-all duration-300',
                                i < current ? 'bg-[#1d9e75]' : 'bg-gray-200',
                            ].join(' ')}
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── Register Form ─────────────────────────────────────────────────────────────

export default function RegisterForm() {
    const [step, setStep] = useState(0)
    const [showPw, setShowPw] = useState(false)
    const [showCpw, setShowCpw] = useState(false)
    const [pw, setPw] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const refs = {
        fname:  useRef<HTMLInputElement>(null),
        lname:  useRef<HTMLInputElement>(null),
        email:  useRef<HTMLInputElement>(null),
        phone:  useRef<HTMLInputElement>(null),
        idcode: useRef<HTMLInputElement>(null),
        cpw:    useRef<HTMLInputElement>(null),
    }

    const strength = getStrength(pw)
    const iconClass = 'w-[15px] h-[15px]'

    // ── Validation per step ──────────────────────────────────────────────────

    function validateStep(s: number): Record<string, string> {
        const errs: Record<string, string> = {}
        if (s === 0) {
            if (!refs.fname.current?.value.trim())      errs.fname  = 'Ad gerekli.'
            if (!refs.lname.current?.value.trim())      errs.lname  = 'Soyad gerekli.'
            if (!/^\d{11}$/.test(refs.idcode.current?.value || ''))
                errs.idcode = '11 haneli TC numarası girin.'
        }
        if (s === 1) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(refs.email.current?.value || ''))
                errs.email = 'Geçerli bir e-posta girin.'
            if (!refs.phone.current?.value.trim())      errs.phone  = 'Telefon numarası gerekli.'
        }
        if (s === 2) {
            if (pw.length < 8)                          errs.pw     = 'Şifre en az 8 karakter olmalı.'
            if (refs.cpw.current?.value !== pw)         errs.cpw    = 'Şifreler eşleşmiyor.'
        }
        return errs
    }

    function next() {
        const errs = validateStep(step)
        setErrors(errs)
        if (Object.keys(errs).length === 0) setStep(s => s + 1)
    }

    function back() {
        setErrors({})
        setStep(s => s - 1)
    }

    function handleSubmit() {
        setSubmitted(true)
    }

    // ── Summary data ─────────────────────────────────────────────────────────

    const summary = [
        { label: 'Ad Soyad',     value: `${refs.fname.current?.value || ''} ${refs.lname.current?.value || ''}`.trim() },
        { label: 'TC Numarası',  value: refs.idcode.current?.value || '' },
        { label: 'E-posta',      value: refs.email.current?.value || '' },
        { label: 'Telefon',      value: refs.phone.current?.value || '' },
        { label: 'Şifre',        value: '••••••••' },
    ]

    // ── Shared button row ─────────────────────────────────────────────────────

    function NavButtons({ onNext, nextLabel = 'Devam et →', isLast = false }: {
        onNext: () => void
        nextLabel?: string
        isLast?: boolean
    }) {
        return (
            <div className="flex gap-2.5 mt-5">
                {step > 0 && (
                    <button
                        onClick={back}
                        className="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        ← Geri
                    </button>
                )}
                <button
                    onClick={onNext}
                    disabled={isLast && submitted}
                    className={[
                        'h-11 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.99]',
                        step > 0 ? 'flex-[2]' : 'flex-1',
                        isLast && submitted
                            ? 'bg-emerald-500 cursor-default'
                            : 'bg-[#003580] hover:bg-[#00235b]',
                    ].join(' ')}
                >
                    {isLast && submitted ? '✓ Kayıt başarılı!' : nextLabel}
                </button>
            </div>
        )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div
            className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">

                {/* Logo */}
                <div className="mb-6">
                    <img
                        src="https://www.gstc.org/wp-content/uploads/Booking.com_comp.jpg"
                        alt="Booking.com"
                        className="h-8 w-auto object-contain"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                </div>

                <Stepper current={step} />

                {/* ── Step 0: Personal ── */}
                {step === 0 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">Kişisel bilgiler</h2>
                        <p className="text-[13px] text-gray-500 mb-5">Ad, soyad ve kimlik numaranızı girin.</p>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Ad" icon={<User className={iconClass} />} error={errors.fname}>
                                    <Input ref={refs.fname} type="text" placeholder="Ahmet"
                                        autoComplete="given-name" hasError={!!errors.fname} />
                                </Field>
                                <Field label="Soyad" icon={<User className={iconClass} />} error={errors.lname}>
                                    <Input ref={refs.lname} type="text" placeholder="Yılmaz"
                                        autoComplete="family-name" hasError={!!errors.lname} />
                                </Field>
                            </div>
                            <Field
                                label="Kimlik / TC numarası"
                                icon={<CreditCard className={iconClass} />}
                                error={errors.idcode}
                                hint="11 haneli TC kimlik numaranızı girin."
                            >
                                <Input ref={refs.idcode} type="text" placeholder="12345678901"
                                    maxLength={11} inputMode="numeric" hasError={!!errors.idcode} />
                            </Field>
                        </div>

                        <NavButtons onNext={next} />
                    </>
                )}

                {/* ── Step 1: Contact ── */}
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">İletişim bilgileri</h2>
                        <p className="text-[13px] text-gray-500 mb-5">Size ulaşabileceğimiz bilgileri girin.</p>

                        <div className="space-y-3">
                            <Field label="E-posta" icon={<Mail className={iconClass} />} error={errors.email}>
                                <Input ref={refs.email} type="email" placeholder="ahmet@ornek.com"
                                    autoComplete="email" hasError={!!errors.email} />
                            </Field>
                            <Field label="Telefon numarası" icon={<Phone className={iconClass} />} error={errors.phone}>
                                <Input ref={refs.phone} type="tel" placeholder="+90 532 000 00 00"
                                    autoComplete="tel" hasError={!!errors.phone} />
                            </Field>
                        </div>

                        <NavButtons onNext={next} />
                    </>
                )}

                {/* ── Step 2: Security ── */}
                {step === 2 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">Güvenlik</h2>
                        <p className="text-[13px] text-gray-500 mb-5">Hesabınız için güçlü bir şifre belirleyin.</p>

                        <div className="space-y-3">
                            <Field label="Şifre" icon={<Lock className={iconClass} />} error={errors.pw}>
                                <Input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="En az 8 karakter"
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    hasError={!!errors.pw}
                                    rightSlot={
                                        <button type="button" onClick={() => setShowPw(!showPw)}
                                            className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />
                                {pw.length > 0 && (
                                    <div className="w-full mt-1.5 space-y-1">
                                        <div className="flex gap-1">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className="flex-1 h-[3px] rounded-full transition-all duration-200"
                                                    style={{ background: i < strength ? STRENGTH_COLORS[strength - 1] : '#e5e7eb' }} />
                                            ))}
                                        </div>
                                        <p className="text-[11px]" style={{ color: STRENGTH_COLORS[strength - 1] }}>
                                            {STRENGTH_LABELS[strength - 1]}
                                        </p>
                                    </div>
                                )}
                            </Field>

                            <Field label="Şifre tekrar" icon={<Lock className={iconClass} />} error={errors.cpw}>
                                <Input
                                    ref={refs.cpw}
                                    type={showCpw ? 'text' : 'password'}
                                    placeholder="Şifreyi tekrar girin"
                                    hasError={!!errors.cpw}
                                    rightSlot={
                                        <button type="button" onClick={() => setShowCpw(!showCpw)}
                                            className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1">
                                            {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    }
                                />
                            </Field>
                        </div>

                        <NavButtons onNext={next} />
                    </>
                )}

                {/* ── Step 3: Review ── */}
                {step === 3 && (
                    <>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">Bilgilerinizi onaylayın</h2>
                        <p className="text-[13px] text-gray-500 mb-5">Her şey doğru mu? Kaydı tamamlayın.</p>

                        <div className="border border-gray-100 rounded-xl overflow-hidden">
                            {summary.map(({ label, value }, i) => (
                                <div key={i}
                                    className="flex justify-between items-center px-4 py-3 text-sm border-b border-gray-100 last:border-none">
                                    <span className="text-gray-500">{label}</span>
                                    <span className="text-gray-900 font-medium">{value || '—'}</span>
                                </div>
                            ))}
                        </div>

                        <NavButtons onNext={handleSubmit} nextLabel="Kayıt ol" isLast />

                        <p className="text-center text-[11px] text-gray-400 mt-3 leading-relaxed">
                            Kaydolarak{' '}
                            <a href="#" className="underline">Kullanım Şartları</a>'nı ve{' '}
                            <a href="#" className="underline">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
                        </p>
                    </>
                )}

                {step < 3 && (
                    <p className="text-center text-[13px] text-gray-500 mt-3">
                        Zaten hesabınız var mı?{' '}
                        <a href="#" className="text-[#003580] font-medium hover:underline">Giriş yapın</a>
                    </p>
                )}
            </div>
        </div>
    )
}