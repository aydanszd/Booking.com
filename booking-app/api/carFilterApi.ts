import type { CarType } from '@/types/car'
import { BASE } from '@/utils/imageUrl'

const API = `${BASE}/api/cars`

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
