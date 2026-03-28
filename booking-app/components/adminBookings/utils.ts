export function getPropertyName(booking: any): string {
    if (booking.type === 'building') return booking.building?.title || '—'
    if (booking.type === 'car') return `${booking.car?.brand || ''} ${booking.car?.title || ''}`.trim() || '—'
    if (booking.type === 'flight') return `${booking.flight?.airline || ''} ${booking.flight?.flightNumber || ''}`.trim() || '—'
    return '—'
}

export function fmtDate(d: string): string {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function getPeriod(booking: any): string {
    if (booking.type === 'building') return `${fmtDate(booking.checkIn)} — ${fmtDate(booking.checkOut)}`
    if (booking.type === 'car')      return `${fmtDate(booking.pickUp)} — ${fmtDate(booking.dropOff)}`
    if (booking.type === 'flight')   return fmtDate(booking.createdAt)
    return '—'
}
