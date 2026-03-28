import type { FlightType } from '@/types/flight'

export const LIMIT = 10

export const CABINS = ['', 'economy', 'premium_economy', 'business', 'first'] as const

export const cabinColor: Record<string, string> = {
    economy:         'bg-gray-100 text-gray-600',
    premium_economy: 'bg-sky-50 text-sky-600',
    business:        'bg-violet-50 text-violet-600',
    first:           'bg-amber-50 text-amber-600',
}

export const cabinLabel: Record<string, string> = {
    economy:         'Economy',
    premium_economy: 'Prem. Economy',
    business:        'Business',
    first:           'First',
}

export function statusColor(f: FlightType): string {
    const avail = f.totalSeats - f.bookedSeats
    if (avail === 0) return 'bg-red-50 text-red-500'
    if (avail <= 10) return 'bg-orange-50 text-orange-500'
    return 'bg-emerald-50 text-emerald-600'
}

export function statusLabel(f: FlightType): string {
    const avail = f.totalSeats - f.bookedSeats
    if (avail === 0) return 'Dolu'
    if (avail <= 10) return 'Az yer'
    return 'Mövcud'
}

export function fmt(iso: string): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
}

export function fmtDate(iso: string): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })
}
