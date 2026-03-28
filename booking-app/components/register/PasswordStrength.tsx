import { useTranslations } from 'next-intl'

const STRENGTH_COLORS = ['#e24b4a', '#ef9f27', '#003580', '#1d9e75']

function getStrength(pw: string): number {
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
}

export default function PasswordStrength({ password }: { password: string }) {
    const t = useTranslations('auth')
    const strength = getStrength(password)
    const LABELS = [t('strengthVeryWeak'), t('strengthWeak'), t('strengthGood'), t('strengthStrong')]

    if (!password.length) return null

    return (
        <div className="w-full mt-1.5 space-y-1">
            <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div
                        key={i}
                        className="flex-1 h-0.75 rounded-full transition-all duration-200"
                        style={{ background: i < strength ? STRENGTH_COLORS[strength - 1] : '#e5e7eb' }}
                    />
                ))}
            </div>
            <p className="text-[11px]" style={{ color: STRENGTH_COLORS[strength - 1] }}>
                {LABELS[strength - 1]}
            </p>
        </div>
    )
}
