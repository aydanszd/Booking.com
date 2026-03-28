import type { PaymentStatus, EnrichedBooking } from '@/utils/paymentUtils'

/** Returns the amount actually paid — falls back to 30% deposit if not set */
export function getPaidAmount(booking: any): number {
    if (booking.paidAmount != null && booking.paidAmount > 0) return booking.paidAmount
    return Math.ceil((booking.totalPrice || 0) * 0.3)
}

/** Derives payment status from paid amount, total, and booking status */
export function getPaymentStatus(
    paid: number,
    total: number,
    bookingStatus: string,
): PaymentStatus {
    if (bookingStatus === 'cancelled') return 'cancelled'
    if (paid >= total) return 'paid'
    if (paid > 0) return 'partial'
    return 'unpaid'
}

/** Enriches raw booking array with derived payment fields */
export function enrichBookings(bookings: any[]): EnrichedBooking[] {
    return bookings.map(b => {
        const paid = getPaidAmount(b)
        const remaining = Math.max(0, (b.totalPrice || 0) - paid)
        const payStatus = getPaymentStatus(paid, b.totalPrice || 0, b.status)
        return { ...b, paid, remaining, payStatus }
    })
}
