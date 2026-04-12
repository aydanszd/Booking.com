import type { CarType } from '@/types/car'

const API = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/cars`

type Params = { page: number; limit: number; category?: string; city?: string }
type Response = { cars: CarType[]; total: number }

export const carFilterApi = {
    getAll: async ({ page, limit, category, city }: Params): Promise<Response> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (category) params.set('category', category)
        if (city) params.set('city', city)
        const res = await fetch(`${API}?${params}`)
        if (!res.ok) throw new Error('Məlumatlar yüklənmədi')
        return res.json()
    },
}
