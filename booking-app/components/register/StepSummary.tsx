import { useTranslations } from 'next-intl'
import NavButtons from './NavButtons'
import type { RegisterFormData } from '@/validators/registerValidators'

interface Props {
    step: number
    formData: RegisterFormData
    loading: boolean
    onSubmit: () => void
    onBack: () => void
}

export default function StepSummary({ step, formData, loading, onSubmit, onBack }: Props) {
    const t = useTranslations('auth')

    const items = [
        { label: t('fullNameLabel'), value: `${formData.fname} ${formData.lname}`.trim() },
        { label: t('idLabel'), value: formData.idcode },
        { label: t('emailLabel'), value: formData.email },
        { label: t('phoneLabel'), value: formData.phone },
        { label: t('passwordLabel'), value: '••••••••' },
    ]

    return (
        <>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{t('step4Title')}</h2>
            <p className="text-[13px] text-gray-500 mb-5">{t('step4Subtitle')}</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
                {items.map(({ label, value }, i) => (
                    <div key={i} className="flex justify-between items-center px-4 py-3 text-sm border-b border-gray-100 last:border-none">
                        <span className="text-gray-500">{label}</span>
                        <span className="text-gray-900 font-medium">{value || '—'}</span>
                    </div>
                ))}
            </div>
            <NavButtons step={step} onNext={onSubmit} nextLabel={t('registerBtn')} isLast loading={loading} onBack={onBack} />
            <p className="text-center text-[11px] text-gray-400 mt-3 leading-relaxed">
                {t('agreeText')}{' '}
                <a href="#" className="underline">{t('terms')}</a> {t('and')}{' '}
                <a href="#" className="underline">{t('privacy')}</a>
            </p>
        </>
    )
}
