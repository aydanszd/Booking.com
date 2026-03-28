export type CarDetailType = {
    _id: string
    title: string
    brand: string
    model: string
    category: string
    transmission: 'automatic' | 'manual'
    seats: number
    doors?: number
    largeBags?: number
    smallBags?: number
    mileage: number
    pricePerDay: number
    isAvailable: boolean
    location: { city: string; country: string; address?: string; lat?: number; lng?: number }
    features: string[]
    images: string[]
    rating?: number
    provider?: string
    providerLabel?: string
    providerReviews?: number
    fuelPolicy?: string
    minAge?: number
    deposit?: number
    winterFee?: boolean
    includes?: string[]
    excludes?: string[]
}

export type Review = {
    _id: string
    userName: string
    score: number
    comment: string
    adminReply?: string | null
    adminReplyAt?: string | null
    createdAt?: string
}
