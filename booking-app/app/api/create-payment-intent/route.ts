import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia',
})

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = 'try', bookingId } = await req.json()

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Məbləğ düzgün deyil' }, { status: 400 })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount), // qəpik cinsindən (100 = 1 AZN)
            currency,
            metadata: { bookingId: bookingId ?? '' },
        })

        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (err: any) {
        console.error('PaymentIntent xətası:', err.message)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
