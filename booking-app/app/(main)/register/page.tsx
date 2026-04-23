import { BASE } from '@/utils/imageUrl'
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { validateRegisterStep, type RegisterFormData } from '@/validators/registerValidators'
import Stepper from '@/components/register/Stepper'
import StepPersonal from '@/components/register/StepPersonal'
import StepContact from '@/components/register/StepContact'
import StepPassword from '@/components/register/StepPassword'
import StepSummary from '@/components/register/StepSummary'

const EMPTY_FORM: RegisterFormData = {
    fname: '', lname: '', email: '', phone: '', idcode: '', password: '', confirmPassword: '',
}

export default function RegisterForm() {
    const t = useTranslations('auth')
    const router = useRouter()

    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<RegisterFormData>(EMPTY_FORM)

    const STEPS = [t('step1'), t('step2'), t('step3'), t('step4')]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const next = () => {
        const errs = validateRegisterStep(step, formData)
        setErrors(errs)
        if (Object.keys(errs).length === 0) setStep(s => s + 1)
    }

    const back = () => { setErrors({}); setStep(s => s - 1) }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const payload = {
                name: `${formData.fname} ${formData.lname}`,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                idCode: formData.idcode,
            }
            await axios.post(`${BASE}/api/auth/register`, payload)
            toast.success(t('registerSuccess'))
            setTimeout(() => router.push('/signin'), 1500)
        } catch (err: any) {
            const msg = err.response?.data?.message || t('registerError')
            toast.error(msg)
            setLoading(false)
        }
    }

    const stepProps = { formData, errors, onChange: handleChange, onNext: next, onBack: back }

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">
                <div className="mb-6">
                    <img
                        src="https://www.gstc.org/wp-content/uploads/Booking.com_comp.jpg"
                        alt="Booking.com"
                        className="h-8 w-auto object-contain"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                </div>

                <Stepper current={step} steps={STEPS} />

                {step === 0 && <StepPersonal step={step} {...stepProps} />}
                {step === 1 && <StepContact step={step} {...stepProps} />}
                {step === 2 && <StepPassword step={step} {...stepProps} />}
                {step === 3 && (
                    <StepSummary
                        step={step}
                        formData={formData}
                        loading={loading}
                        onSubmit={handleSubmit}
                        onBack={back}
                    />
                )}

                {step < 3 && (
                    <p className="text-center text-[13px] text-gray-500 mt-3">
                        {t('haveAccount')}{' '}
                        <Link href="/signin" className="text-[#003580] font-medium hover:underline">{t('signinLink')}</Link>
                    </p>
                )}
            </div>
        </div>
    )
}
