'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronRight, Loader2, Car, Building2, Plane, Lock, Shield, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import bookingApi from '@/api/booking'
import { useTranslations } from 'next-intl'
import PersonalInfoSection from '@/components/checkout/PersonalInfoSection'
import PaymentSection from '@/components/checkout/PaymentSection'
import OrderSummary from '@/components/checkout/OrderSummary'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function CheckoutInner() {
    const t = useTranslations('checkout')
    const router = useRouter()
    const sp = useSearchParams()

    const type = sp.get('type') || 'car'
    const itemId = sp.get('id') || ''
    const title = sp.get('title') || ''
    const image = sp.get('image') || ''
    const pickUp = sp.get('pickUp') || ''
    const dropOff = sp.get('dropOff') || ''
    const checkIn = sp.get('checkIn') || ''
    const checkOut = sp.get('checkOut') || ''
    const totalPrice = Number(sp.get('totalPrice') || '0')
    const pricePerDay = Number(sp.get('pricePerDay') || '0')
    const days = Number(sp.get('days') || '1')
    const deposit = Math.ceil(totalPrice * 0.3)

    const startDate = pickUp || checkIn
    const endDate = dropOff || checkOut
    const startLabel = type === 'car' ? t('pickupDate') : t('checkInDate')
    const endLabel = type === 'car' ? t('returnDate') : t('checkOutDate')

    const [fullName, setFullName] = useState('')
    const [age, setAge] = useState('')
    const [idNumber, setIdNumber] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [loading, setLoading] = useState(false)

    const imgSrc = image
        ? image.startsWith('http') ? image : `${BASE}/uploads/${image}`
        : ''

    const TypeIcon = type === 'car' ? Car : type === 'flight' ? Plane : Building2

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!fullName.trim()) { toast.error(t('fullNameRequired')); return }
        if (!age || Number(age) < 18 || Number(age) > 100) { toast.error(t('ageRequired')); return }
        if (!idNumber.trim()) { toast.error(t('idRequired')); return }
        const rawCard = cardNumber.replace(/\s/g, '')
        if (rawCard.length !== 16) { toast.error(t('cardRequired')); return }
        if (expiry.length < 5) { toast.error(t('expiryRequired')); return }
        if (cvv.length < 3) { toast.error(t('cvvRequired')); return }

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) { toast.error(t('signInRequired')); router.push('/signin'); return }

        try {
            setLoading(true)
            const data: any = { type, totalPrice, guests: { adults: 1, children: 0 } }
            if (type === 'car') { data.car = itemId; data.pickUp = pickUp; data.dropOff = dropOff }
            else if (type === 'building') { data.building = itemId; data.checkIn = checkIn; data.checkOut = checkOut }
            else if (type === 'flight') { data.flight = itemId; data.passengers = 1 }

            await bookingApi.createBooking(data)
            toast.success(t('bookingSuccess'))
            router.push('/my-bookings')
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || t('bookingFailed'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-semibold uppercase tracking-widest">
                    <span className="text-blue-600">{t('selectionStep')}</span>
                    <ChevronRight size={12} />
                    <span className="text-blue-600">{t('detailsStep')}</span>
                    <ChevronRight size={12} />
                    <span className="text-gray-700">{t('paymentStep')}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

                    {/* ── Left: Form ── */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <PersonalInfoSection
                            fullName={fullName} onFullNameChange={setFullName}
                            age={age} onAgeChange={setAge}
                            idNumber={idNumber} onIdNumberChange={setIdNumber}
                        />

                        <PaymentSection
                            cardNumber={cardNumber} onCardNumberChange={setCardNumber}
                            expiry={expiry} onExpiryChange={setExpiry}
                            cvv={cvv} onCvvChange={setCvv}
                            deposit={deposit} totalPrice={totalPrice} type={type}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-4 rounded-2xl text-base transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><Loader2 size={20} className="animate-spin" /> {t('processing')}</>
                                : <><Lock size={16} /> {t('payAndReserve', { amount: deposit })}</>
                            }
                        </button>

                        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Shield size={12} /> {t('sslEncrypted')}</span>
                            <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {t('securePayment')}</span>
                            <span className="flex items-center gap-1"><Lock size={12} /> {t('dataProtected')}</span>
                        </div>
                    </form>

                    {/* ── Right: Summary ── */}
                    <OrderSummary
                        imgSrc={imgSrc}
                        title={title}
                        type={type}
                        TypeIcon={TypeIcon}
                        startLabel={startLabel}
                        endLabel={endLabel}
                        startDate={startDate}
                        endDate={endDate}
                        pricePerDay={pricePerDay}
                        days={days}
                        totalPrice={totalPrice}
                        deposit={deposit}
                    />
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <CheckoutInner />
        </Suspense>
    )
}
