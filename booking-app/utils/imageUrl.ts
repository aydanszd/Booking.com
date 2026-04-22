export const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function imgSrc(
    url: string,
    fallback = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
): string {
    if (!url) return fallback
    return url.startsWith('/uploads') ? `${BASE}${url}` : url
}
