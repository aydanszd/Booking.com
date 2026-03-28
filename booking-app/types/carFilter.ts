export type ActiveFilters = {
    categories: string[]
    transmissions: string[]
    seats: string[]
    priceRanges: string[]
    ratings: string[]
    availability: string[]
}

export const EMPTY_FILTERS: ActiveFilters = {
    categories: [], transmissions: [], seats: [],
    priceRanges: [], ratings: [], availability: [],
}
