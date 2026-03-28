import { Car } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function CarListEmpty({ city }: { city: string }) {
    const t = useTranslations('cars')
    const router = useRouter()

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car size={28} className="text-blue-300" />
            </div>
            <h3 className="text-lg font-black text-gray-800 mb-2">{t('notFound')}</h3>
            <p className="text-sm text-gray-400 mb-6">
                {city ? t('notFoundInCity', { city }) : t('notFoundDesc')}
            </p>
            <button
                onClick={() => router.push('/carrender')}
                className="bg-[#006ce4] hover:bg-[#0057b8] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
            >
                {t('searchAgain')}
            </button>
        </div>
    )
}
