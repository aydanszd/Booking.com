import type { FilterType } from '@/types/review'

const TABS: { value: FilterType; label: string }[] = [
    { value: 'all',       label: 'Hamısı' },
    { value: 'hotel',     label: 'Otellər' },
    { value: 'car',       label: 'Avtomobillər' },
    { value: 'replied',   label: 'Cavablanıb' },
    { value: 'unreplied', label: 'Cavablanmayıb' },
]

export default function ReviewFilterTabs({
    filter,
    onChange,
}: {
    filter: FilterType
    onChange: (f: FilterType) => void
}) {
    return (
        <div className="flex gap-2 flex-wrap">
            {TABS.map(({ value, label }) => (
                <button
                    key={value}
                    onClick={() => onChange(value)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                        filter === value
                            ? 'bg-[#006ce4] text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {label}
                </button>
            ))}
        </div>
    )
}
