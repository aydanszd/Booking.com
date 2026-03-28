'use client'

import { useEffect, useState } from 'react'
import { carApi } from '@/api/carapi'
import type { CarType } from '@/types/car'

export function useCarList(city: string) {
    const [cars, setCars] = useState<CarType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            setLoading(true)
            try {
                const res = await carApi.getAll({ page: 1, limit: 100, city: city || undefined })
                setCars(res.cars)
            } finally {
                setLoading(false)
            }
        })()
    }, [city])

    return { cars, loading }
}
