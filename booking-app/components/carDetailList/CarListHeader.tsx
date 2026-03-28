import { ArrowLeft, MapPin, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { fmtDate } from '@/utils/carDetailUtils'

interface Props {
    city: string
    pickUp: string
    dropOff: string
    days: number
}

export default function CarListHeader({ city, pickUp, dropOff, days }: Props) {
    const t = useTranslations('cars')
    const router = useRouter()

    return (
        <div className="bg-[#003b95] text-white py-6 px-4">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
                >
                    <ArrowLeft size={16} /> {t('back')}
                </button>
                <div className="flex flex-wrap items-center gap-4">
                    {city && (
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-blue-300" />
                            <span className="font-bold text-lg">{city}</span>
                        </div>
                    )}
                    {pickUp && dropOff && (
                        <div className="flex items-center gap-1.5 text-blue-200 text-sm">
                            <Calendar size={14} />
                            <span>{fmtDate(pickUp)} — {fmtDate(dropOff)} · {t('days', { count: days })}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
