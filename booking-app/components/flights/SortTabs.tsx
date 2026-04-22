'use client'

import { useTranslations } from 'next-intl'
import type { SortKey } from '@/types/flight'

export default function SortTabs({ active, onChange }: { active: SortKey; onChange: (k: SortKey) => void }) {
    const t = useTranslations('flights')
    const tabs: { key: SortKey; labelKey: string }[] = [
        { key: 'price_asc',  labelKey: 'sortCheapest' },
        { key: 'quality',    labelKey: 'sortBest' },
        { key: 'duration',   labelKey: 'sortShortest' },
        { key: 'price_desc', labelKey: 'sortExpensive' },
    ]

    return (
        <div className="flex border-b border-gray-200 bg-white rounded-t-2xl overflow-hidden">
            {tabs.map(tab => (
                <button key={tab.key} onClick={() => onChange(tab.key)}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative ${active === tab.key ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
                    {t(tab.labelKey as any)}
                    {active === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-t" />}
                </button>
            ))}
        </div>
    )
}
