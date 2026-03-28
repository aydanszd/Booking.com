import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { LOCALES } from '@/types/translation'
import type { Locale } from '@/types/translation'

interface Props {
    onAdd: (key: string, values: Record<Locale, string>) => void
    onClose: () => void
}

export default function AddKeyModal({ onAdd, onClose }: Props) {
    const [newKey, setNewKey] = useState('')
    const [values, setValues] = useState<Record<Locale, string>>({ en: '', tr: '', ru: '' })

    const handleAdd = () => {
        if (!newKey.trim()) return
        onAdd(newKey.trim(), values)
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Plus size={14} className="text-[#006ce4]" />
                        </div>
                        <h2 className="text-sm font-bold text-gray-700">Add Translation Key</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Key <span className="text-gray-400 font-normal">(e.g. nav.home or header.title)</span>
                        </label>
                        <input
                            value={newKey}
                            onChange={e => setNewKey(e.target.value)}
                            placeholder="section.keyName"
                            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-mono outline-none focus:border-[#006ce4] transition-colors"
                        />
                    </div>

                    {LOCALES.map(l => (
                        <div key={l.code}>
                            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1.5">
                                <span>{l.flag}</span> {l.label}
                            </label>
                            <input
                                value={values[l.code]}
                                onChange={e => setValues(prev => ({ ...prev, [l.code]: e.target.value }))}
                                placeholder={`Translation in ${l.label}...`}
                                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#006ce4] transition-colors"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2 px-6 pb-5">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        disabled={!newKey.trim()}
                        className="flex items-center gap-1.5 bg-[#006ce4] hover:bg-[#0057b8] disabled:opacity-40 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                    >
                        <Plus size={14} /> Add Key
                    </button>
                </div>
            </div>
        </div>
    )
}
