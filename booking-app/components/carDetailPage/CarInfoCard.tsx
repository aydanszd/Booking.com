import { Users, Disc, Fuel, CheckCircle2, Star, Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { CarWithReviews } from '@/types/car'

export default function CarInfoCard({ car }: { car: CarWithReviews }) {
    const t = useTranslations('cars')

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {/* Title row */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 leading-tight">{car.title}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-[#006ce4] text-sm font-bold bg-blue-50 px-2 py-1 rounded">
                            <Star size={12} fill="currentColor" /> {car.rating}
                        </div>
                        <span className="text-sm font-semibold text-gray-400">• {car.brand} {car.model}</span>
                    </div>
                </div>
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-100 hidden sm:block">
                    <Car size={32} />
                </div>
            </div>

            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200 mb-8 border border-gray-100">
                <img
                    src={car.images?.[0] || '/placeholder.jpg'}
                    className="w-full h-96 object-cover"
                    alt={car.title}
                />
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100">
                {[
                    { icon: <Users size={20} />, label: t('seats2'), value: `${car.seats} ${t('adults')}` },
                    { icon: <Disc size={20} />,  label: t('gearbox'), value: car.transmission.toUpperCase() },
                    { icon: <Fuel size={20} />,  label: t('fuel'),    value: `${t('petrol')} / ${t('fuelPolicy')}` },
                    { icon: <CheckCircle2 size={20} />, label: t('ac'), value: t('included') },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-400">{icon}</div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                            <p className="text-sm font-black text-gray-900">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Features */}
            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">{t('features')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(car.features?.length ? car.features : ['Air Conditioning', 'Bluetooth', 'USB Port', 'Cruise Control']).map(f => (
                        <div key={f} className="flex items-center gap-3 text-sm font-semibold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-white transition-all">
                            <CheckCircle2 size={16} className="text-[#008009] shrink-0" />
                            <span>{f}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
