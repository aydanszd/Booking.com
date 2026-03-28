export function fmtDate(d: string): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function getPropertyName(booking: any): string {
    if (booking.type === 'building') return booking.building?.title || '—'
    if (booking.type === 'car') return `${booking.car?.brand || ''} ${booking.car?.title || ''}`.trim() || '—'
    if (booking.type === 'flight') return `${booking.flight?.airline || ''} ${booking.flight?.flightNumber || ''}`.trim() || '—'
    return '—'
}

export type SortKey = 'date' | 'total' | 'paid' | 'remaining'

export type EnrichedBooking = {
    paid: number
    remaining: number
    payStatus: PaymentStatus
    [key: string]: any
}

export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'cancelled'
