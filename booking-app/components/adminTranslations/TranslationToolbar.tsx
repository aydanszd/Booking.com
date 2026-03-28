import { Search, Plus, Save, RefreshCw, Check, X } from 'lucide-react'
import { LOCALES } from '@/types/translation'

interface Props {
    search: string
    onSearchChange: (v: string) => void
    allKeysCount: number
    sectionsCount: number
    saving: boolean
    saved: boolean
    onAdd: () => void
    onSave: () => void
}

export default function TranslationToolbar({
    search, onSearchChange,
    allKeysCount, sectionsCount,
    saving, saved,
    onAdd, onSave,
}: Props) {
    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 max-w-80">
                    <Search size={14} className="text-gray-400 shrink-0" />
                    <input
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search keys or values..."
                        className="flex-1 text-sm outline-none text-gray-700 bg-transparent"
                    />
                    {search && (
                        <button onClick={() => onSearchChange('')}>
                            <X size={13} className="text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-400 hidden sm:block">
                        {allKeysCount} keys · {sectionsCount} sections
                    </span>
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:border-[#006ce4] hover:text-[#006ce4] transition-colors"
                    >
                        <Plus size={14} /> Add Key
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                            saved ? 'bg-green-500 text-white' : 'bg-[#006ce4] hover:bg-[#0057b8] text-white'
                        }`}
                    >
                        {saving ? <RefreshCw size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All'}
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 flex-wrap">
                {LOCALES.map(l => (
                    <div key={l.code} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span>{l.flag}</span>
                        <span className="font-medium">{l.label}</span>
                    </div>
                ))}
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                    Click any cell to edit · Changes are saved manually
                </span>
            </div>
        </div>
    )
}
