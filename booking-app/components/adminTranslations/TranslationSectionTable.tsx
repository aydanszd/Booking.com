import { RefObject } from 'react'
import { Globe, Pencil, Check, X, Trash2 } from 'lucide-react'
import { LOCALES, SECTION_COLORS } from '@/types/translation'
import type { AllData, Locale } from '@/types/translation'

interface Props {
    section: string
    keys: string[]
    data: AllData
    editingCell: { key: string; locale: Locale } | null
    editValue: string
    deleteConfirm: string | null
    inputRef: RefObject<HTMLInputElement | null>
    onEditValue: (v: string) => void
    onStartEdit: (key: string, locale: Locale) => void
    onCommitEdit: () => void
    onCancelEdit: () => void
    onDeleteConfirm: (key: string | null) => void
    onDeleteKey: (key: string) => void
}

export default function TranslationSectionTable({
    section, keys, data,
    editingCell, editValue, deleteConfirm,
    inputRef, onEditValue,
    onStartEdit, onCommitEdit, onCancelEdit,
    onDeleteConfirm, onDeleteKey,
}: Props) {
    const sectionCls = SECTION_COLORS[section] ?? SECTION_COLORS.other

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <Globe size={13} className="text-gray-400" />
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${sectionCls}`}>
                    {section}
                </span>
                <span className="text-xs text-gray-400">{keys.length} keys</span>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_36px] border-b border-gray-100">
                <div className="px-4 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Key</div>
                {LOCALES.map(l => (
                    <div key={l.code} className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <span>{l.flag}</span> {l.code.toUpperCase()}
                    </div>
                ))}
                <div />
            </div>

            {/* Rows */}
            {keys.map((key, idx) => {
                const shortKey = key.includes('.') ? key.split('.').slice(1).join('.') : key
                return (
                    <div
                        key={key}
                        className={`grid grid-cols-[2fr_1fr_1fr_1fr_36px] group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'} hover:bg-blue-50/30 transition-colors border-b border-gray-50 last:border-0`}
                    >
                        {/* Key */}
                        <div className="px-4 py-2.5 flex items-center">
                            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                                {shortKey}
                            </code>
                        </div>

                        {/* Value cells */}
                        {LOCALES.map(l => {
                            const isEditing = editingCell?.key === key && editingCell?.locale === l.code
                            const val = data[l.code][key] ?? ''
                            return (
                                <div
                                    key={l.code}
                                    className="px-3 py-2 flex items-center"
                                    onClick={() => !isEditing && onStartEdit(key, l.code)}
                                >
                                    {isEditing ? (
                                        <div className="flex items-center gap-1 w-full">
                                            <input
                                                ref={inputRef}
                                                value={editValue}
                                                onChange={e => onEditValue(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') onCommitEdit()
                                                    if (e.key === 'Escape') onCancelEdit()
                                                }}
                                                className="flex-1 text-xs border border-[#006ce4] rounded-lg px-2 py-1.5 outline-none bg-white w-full"
                                            />
                                            <button onClick={onCommitEdit} className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                                                <Check size={12} />
                                            </button>
                                            <button onClick={onCancelEdit} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 w-full cursor-pointer">
                                            <span className={`text-xs flex-1 truncate ${val ? 'text-gray-700' : 'text-gray-300 italic'}`}>
                                                {val || '—'}
                                            </span>
                                            <Pencil size={10} className="text-gray-300 group-hover:text-[#006ce4] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}

                        {/* Delete */}
                        <div className="flex items-center justify-center">
                            {deleteConfirm === key ? (
                                <button
                                    onClick={() => { onDeleteKey(key); onDeleteConfirm(null) }}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Check size={13} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => onDeleteConfirm(key)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
