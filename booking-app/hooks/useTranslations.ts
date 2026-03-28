'use client'

import { useEffect, useState, useRef } from 'react'
import type { AllData, Locale } from '@/types/translation'

export function useTranslations() {
    const [data, setData] = useState<AllData>({ en: {}, tr: {}, ru: {} })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [editingCell, setEditingCell] = useState<{ key: string; locale: Locale } | null>(null)
    const [editValue, setEditValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        fetch('/api/translations')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false) })
    }, [])

    useEffect(() => {
        if (editingCell) inputRef.current?.focus()
    }, [editingCell])

    const startEdit = (key: string, locale: Locale) => {
        setEditingCell({ key, locale })
        setEditValue(data[locale][key] ?? '')
    }

    const commitEdit = () => {
        if (!editingCell) return
        const { key, locale } = editingCell
        setData(prev => ({ ...prev, [locale]: { ...prev[locale], [key]: editValue } }))
        setEditingCell(null)
    }

    const cancelEdit = () => setEditingCell(null)

    const deleteKey = (key: string) => {
        setData(prev => {
            const next = { ...prev }
            for (const locale of ['en', 'tr', 'ru'] as Locale[]) {
                const copy = { ...next[locale] }
                delete copy[key]
                next[locale] = copy
            }
            return next
        })
    }

    const addKey = (key: string, values: Record<Locale, string>) => {
        if (!key.trim()) return
        setData(prev => ({
            en: { ...prev.en, [key]: values.en },
            tr: { ...prev.tr, [key]: values.tr },
            ru: { ...prev.ru, [key]: values.ru },
        }))
    }

    const saveAll = async () => {
        setSaving(true)
        await fetch('/api/translations', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    return {
        data,
        loading,
        saving,
        saved,
        editingCell,
        editValue,
        setEditValue,
        inputRef,
        startEdit,
        commitEdit,
        cancelEdit,
        deleteKey,
        addKey,
        saveAll,
    }
}
