import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Field from './Field'
import RegInput from './RegInput'
import NavButtons from './NavButtons'
import PasswordStrength from './PasswordStrength'
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

export default function StepPassword({ step, formData, errors, onChange, onNext, onBack }: Props) {
    const t = useTranslations('auth')
    const [showPw, setShowPw] = useState(false)
    const [showCpw, setShowCpw] = useState(false)

    return (
        <>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('step3Title')}</h2>
            <p className="text-[13px] text-gray-500 mb-5">{t('step3Subtitle')}</p>
            <div className="space-y-3">
                <Field label={t('newPassword')} icon={<Lock className={ICO} />} error={errors.pw && t(errors.pw as any)}>
                    <RegInput
                        name="password"
                        type={showPw ? 'text' : 'password'}
                        placeholder={t('passwordMin')}
                        value={formData.password}
                        onChange={onChange}
                        hasError={!!errors.pw}
                        rightSlot={
                            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />
                    <PasswordStrength password={formData.password} />
                </Field>
                <Field label={t('confirmPassword')} icon={<Lock className={ICO} />} error={errors.cpw && t(errors.cpw as any)}>
                    <RegInput
                        name="confirmPassword"
                        type={showCpw ? 'text' : 'password'}
                        placeholder={t('confirmPlaceholder')}
                        value={formData.confirmPassword}
                        onChange={onChange}
                        hasError={!!errors.cpw}
                        rightSlot={
                            <button type="button" onClick={() => setShowCpw(v => !v)} className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-1">
                                {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />
                </Field>
            </div>
            <NavButtons step={step} onNext={onNext} onBack={onBack} />
        </>
    )
}
