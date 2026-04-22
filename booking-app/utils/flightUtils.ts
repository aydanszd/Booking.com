import type { FlightType } from '@/types/flight'

export function formatTime(iso: string): string {
    if (!iso) return '--:--'
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatDateLabel(iso: string): string {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', weekday: 'short' })
}

export function seatsLeft(flight: FlightType): number {
    return Math.max(0, (flight.totalSeats ?? 0) - (flight.bookedSeats ?? 0))
}

export const AIRLINE_COLORS: Record<string, { bg: string; text: string }> = {
    ajet:        { bg: '#FF6B35', text: '#fff' },
    ajt:         { bg: '#FF6B35', text: '#fff' },
    azerbaijan:  { bg: '#0057A8', text: '#fff' },
    azal:        { bg: '#0057A8', text: '#fff' },
    pegasus:     { bg: '#FFD700', text: '#1a1a1a' },
    turkish:     { bg: '#C8102E', text: '#fff' },
    lufthansa:   { bg: '#05164D', text: '#FFD700' },
    emirates:    { bg: '#D71921', text: '#fff' },
    flydubai:    { bg: '#E31837', text: '#fff' },
    qatar:       { bg: '#5C0632', text: '#fff' },
    'air arabia':{ bg: '#CC0000', text: '#fff' },
    wizz:        { bg: '#C6007E', text: '#fff' },
    ryanair:     { bg: '#073590', text: '#FFD700' },
    easyjet:     { bg: '#FF6600', text: '#fff' },
    flyone:      { bg: '#E4002B', text: '#fff' },
}

export function getAirlineColor(name: string): { bg: string; text: string } {
    const lower = name.toLowerCase()
    for (const [key, val] of Object.entries(AIRLINE_COLORS)) {
        if (lower.includes(key)) return val
    }
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    const hue = ((hash % 360) + 360) % 360
    return { bg: `hsl(${hue}, 60%, 40%)`, text: '#fff' }
}
