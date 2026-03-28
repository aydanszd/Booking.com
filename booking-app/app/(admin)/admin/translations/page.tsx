'use client'

import { useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'
import TranslationToolbar from '@/components/adminTranslations/TranslationToolbar'
import TranslationSectionTable from '@/components/adminTranslations/TranslationSectionTable'
import AddKeyModal from '@/components/adminTranslations/AddKeyModal'
import type { Locale } from '@/types/translation'

export default function TranslationsPage() {
    const {
        data, loading, saving, saved,
        editingCell, editValue, setEditValue, inputRef,
        startEdit, commitEdit, cancelEdit,
        deleteKey, addKey, saveAll,
    } = useTranslations()

    const [search, setSearch] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const allKeys = Array.from(
        new Set([...Object.keys(data.en), ...Object.keys(data.tr), ...Object.keys(data.ru)])
    ).sort()

    const filteredKeys = allKeys.filter(k =>
        k.toLowerCase().includes(search.toLowerCase()) ||
        (['en', 'tr', 'ru'] as Locale[]).some(l =>
            (data[l][k] ?? '').toLowerCase().includes(search.toLowerCase())
        )
    )

    const sections = filteredKeys.reduce<Record<string, string[]>>((acc, key) => {
        const section = key.includes('.') ? key.split('.')[0] : 'other'
        if (!acc[section]) acc[section] = []
        acc[section].push(key)
        return acc
    }, {})

    if (loading) return (
        <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
            <RefreshCw size={18} className="animate-spin" />
            <span className="text-sm">Loading translations...</span>
        </div>
    )

    return (
        <div className="space-y-4">
            <TranslationToolbar
                search={search}
                onSearchChange={setSearch}
                allKeysCount={allKeys.length}
                sectionsCount={Object.keys(sections).length}
                saving={saving}
                saved={saved}
                onAdd={() => setShowAddModal(true)}
                onSave={saveAll}
            />

            {Object.entries(sections).map(([section, keys]) => (
                <TranslationSectionTable
                    key={section}
                    section={section}
                    keys={keys}
                    data={data}
                    editingCell={editingCell}
                    editValue={editValue}
                    deleteConfirm={deleteConfirm}
                    inputRef={inputRef}
                    onEditValue={setEditValue}
                    onStartEdit={startEdit}
                    onCommitEdit={commitEdit}
                    onCancelEdit={cancelEdit}
                    onDeleteConfirm={setDeleteConfirm}
                    onDeleteKey={deleteKey}
                />
            ))}

            {filteredKeys.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                    <Search size={28} strokeWidth={1.5} />
                    <p className="text-sm">No translation keys found</p>
                </div>
            )}

            {showAddModal && (
                <AddKeyModal
                    onAdd={addKey}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </div>
    )
}
