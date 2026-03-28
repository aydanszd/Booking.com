import { Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Field from './Field'
import RegInput from './RegInput'
import NavButtons from './NavButtons'
import type { RegisterFormData } from '@/validators/registerValidators'

const ICO = 'w-[15px] h-[15px]'

interface Props {
    step: number
    formData: RegisterFormData
    errors: Record<string, string>
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onNext: () => void
    onBack: () => void
}

export default function StepContact({ step, formData, errors, onChange, onNext, onBack }: Props) {
    const t = useTranslations('auth')

    return (
        <>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('step2Title')}</h2>
            <p className="text-[13px] text-gray-500 mb-5">{t('step2Subtitle')}</p>
            <div className="space-y-3">
                <Field label={t('email')} icon={<Mail className={ICO} />} error={errors.email && t(errors.email as any)}>
                    <RegInput name="email" type="email" placeholder={t('emailPlaceholder')} autoComplete="email" value={formData.email} onChange={onChange} hasError={!!errors.email} />
                </Field>
                <Field label={t('phone')} icon={<Phone className={ICO} />} error={errors.phone && t(errors.phone as any)}>
                    <RegInput name="phone" type="tel" placeholder="+90 532 000 00 00" autoComplete="tel" value={formData.phone} onChange={onChange} hasError={!!errors.phone} />
                </Field>
            </div>
            <NavButtons step={step} onNext={onNext} onBack={onBack} />
        </>
    )
}
