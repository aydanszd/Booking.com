export interface ReviewItem {
    _id: string
    resourceId: string
    resourceTitle: string
    resourceType: 'hotel' | 'car'
    userName: string
    score: number
    comment: string
    adminReply: string | null
    adminReplyAt: string | null
    createdAt: string
}

export type FilterType = 'all' | 'hotel' | 'car' | 'replied' | 'unreplied'

export function fmtDate(d: string): string {
    if (!d) return ''
    return new Date(d).toLocaleDateString('az-AZ', { day: 'numeric', month: 'short', year: 'numeric' })
}
