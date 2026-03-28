'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCarList } from '@/hooks/useCarList'
import { calcDays } from '@/utils/carDetailUtils'
import CarListHeader from '@/components/carDetailList/CarListHeader'
import CarListCard from '@/components/carDetailList/CarListCard'
import CarListEmpty from '@/components/carDetailList/CarListEmpty'

function CarDetailListInner() {
    const t = useTranslations('cars')
    const sp = useSearchParams()

    const city   = sp.get('city')   || ''
    const pickUp = sp.get('pickUp') || ''
    const dropOff = sp.get('dropOff') || ''
    const days = calcDays(pickUp, dropOff)

    const { cars, loading } = useCarList(city)

    const detailParams = new URLSearchParams()
    if (pickUp)  detailParams.set('pickUp', pickUp)
    if (dropOff) detailParams.set('dropOff', dropOff)

    return (
        <div className="min-h-screen bg-gray-50">
            <CarListHeader city={city} pickUp={pickUp} dropOff={dropOff} days={days} />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 size={36} className="animate-spin text-[#006ce4]" />
                        <p className="text-gray-500 text-sm font-medium">{t('searching')}</p>
                    </div>
                ) : cars.length === 0 ? (
                    <CarListEmpty city={city} />
                ) : (
                    <>
                        <p className="text-sm text-gray-500 mb-5">
                            <span className="font-bold text-gray-900">{t('carsFound', { count: cars.length })}</span>
                        </p>
                        <div className="space-y-4">
                            {cars.map(car => (
                                <CarListCard
                                    key={car._id}
                                    car={car}
                                    days={days}
                                    pickUp={pickUp}
                                    dropOff={dropOff}
                                    detailParams={detailParams.toString()}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default function CarDetailListPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 size={36} className="animate-spin text-[#006ce4]" />
            </div>
        }>
            <CarDetailListInner />
        </Suspense>
    )
}
