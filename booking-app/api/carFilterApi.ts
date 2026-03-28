import type { CarType } from '@/types/car'

const API = 'http://localhost:5000/api/cars'

type Params = { page: number; limit: number; category?: string }
type Response = { cars: CarType[]; total: number }

export const carFilterApi = {
    getAll: async ({ page, limit, category }: Params): Promise<Response> => {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) })
        if (category) params.set('category', category)
        const res = await fetch(`${API}?${params}`)
        if (!res.ok) throw new Error('Məlumatlar yüklənmədi')
        return res.json()
    },
}
