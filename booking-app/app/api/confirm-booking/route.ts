import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function POST(req: NextRequest) {
    try {
        const { bookingId, paymentIntentId } = await req.json()

        if (!bookingId || !paymentIntentId) {
            return NextResponse.json({ error: 'bookingId və paymentIntentId tələb olunur' }, { status: 400 })
        }

        // Stripe-da ödənişi yoxla
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json({ error: 'Ödəniş tamamlanmayıb' }, { status: 400 })
        }

        // Express server-də booking statusunu yenilə
        const token = req.headers.get('authorization') ?? ''

        const serverRes = await fetch(`${API_URL}/api/bookings/${bookingId}/confirm`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({
                status: 'confirmed',
                paidAmount: paymentIntent.amount,
                paymentIntentId,
            }),
        })

        if (!serverRes.ok) {
            const err = await serverRes.json()
            return NextResponse.json({ error: err.message || 'Booking yenilənmədi' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Confirm booking xətası:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
