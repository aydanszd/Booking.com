import { User, CreditCard } from 'lucide-react'
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

export default function StepPersonal({ step, formData, errors, onChange, onNext, onBack }: Props) {
    const t = useTranslations('auth')

    return (
        <>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('step1Title')}</h2>
            <p className="text-[13px] text-gray-500 mb-5">{t('step1Subtitle')}</p>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <Field label={t('firstName')} icon={<User className={ICO} />} error={errors.fname && t(errors.fname as any)}>
                        <RegInput name="fname" type="text" placeholder="Ahmet" autoComplete="given-name" value={formData.fname} onChange={onChange} hasError={!!errors.fname} />
                    </Field>
                    <Field label={t('lastName')} icon={<User className={ICO} />} error={errors.lname && t(errors.lname as any)}>
                        <RegInput name="lname" type="text" placeholder="Yılmaz" autoComplete="family-name" value={formData.lname} onChange={onChange} hasError={!!errors.lname} />
                    </Field>
                </div>
                <Field label={t('idNumber')} icon={<CreditCard className={ICO} />} error={errors.idcode && t(errors.idcode as any)} hint={t('idHint')}>
                    <RegInput name="idcode" type="text" placeholder="12345678901" maxLength={11} inputMode="numeric" value={formData.idcode} onChange={onChange} hasError={!!errors.idcode} />
                </Field>
            </div>
            <NavButtons step={step} onNext={onNext} onBack={onBack} />
        </>
    )
}
