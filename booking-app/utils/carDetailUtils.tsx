import { Loader2 } from 'lucide-react'

const BASE = 'http://localhost:5000'

export function imgSrc(path: string | undefined): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${BASE}${path}`
}

export function fmtDate(d: string): string {
    if (!d) return ''
    return new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function buildCarErrorMsg(t: (key: string) => string) {
    return {
        selectDates:      t('selectDates'),
        signInToBook:     t('signInToBook'),
        dropBeforePickup: t('dropBeforePickup'),
        bookingSuccess:   t('bookingSuccess'),
        bookingFailed:    t('bookingFailed'),
        selectStars:      t('selectStars'),
        writeReview:      t('writeReview'),
        signInToReview:   t('signInToReview'),
        errorOccurred:    t('errorOccurred'),
    }
}

export function calcDays(pickUp: string, dropOff: string): number {
    if (!pickUp || !dropOff) return 1
    return Math.max(1, Math.ceil((new Date(dropOff).getTime() - new Date(pickUp).getTime()) / 86400000))
}

export function CarDetailLoading({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-500 font-medium">{label}</p>
        </div>
    )
}
