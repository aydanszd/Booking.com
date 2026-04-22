'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, ImagePlus, Loader2, Globe, Search } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { destinationApi } from '@/api/destination'
import { imgSrc } from '@/utils/imageUrl'
import type { Destination } from '@/types/destination'

// ── Image Slot ────────────────────────────────────────────────────────────────
function ImageSlot({ index, value, onChange, onClear }: {
    index: number; value: string
    onChange: (val: string, file: File | null) => void
    onClear: () => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [mode, setMode] = useState<'upload' | 'url'>('upload')
    const [urlInput, setUrlInput] = useState('')

    const handleFile = (file: File) => onChange(URL.createObjectURL(file), file)

    return (
        <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 mb-1">Şəkil {index + 1}</p>
            {value ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 h-28">
                    <img src={imgSrc(value) || value} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={onClear}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <X size={10} />
                    </button>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <div className="flex gap-1 mb-1.5">
                        {(['upload', 'url'] as const).map(m => (
                            <button key={m} type="button" onClick={() => setMode(m)}
                                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-colors ${mode === m ? 'bg-[#006ce4] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {m === 'upload' ? 'Fayl' : 'URL'}
                            </button>
                        ))}
                    </div>
                    {mode === 'upload' ? (
                        <div onClick={() => inputRef.current?.click()}
                            onDragOver={e => e.preventDefault()}
                            onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                            className="h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#006ce4] transition-colors bg-gray-50">
                            <ImagePlus size={18} className="text-gray-300" />
                            <span className="text-[10px] text-gray-400">Yüklə</span>
                            <input ref={inputRef} type="file" accept="image/*" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
                        </div>
                    ) : (
                        <div className="flex gap-1">
                            <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                                placeholder="https://..."
                                className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-[#006ce4]" />
                            <button type="button" onClick={() => { if (urlInput.trim()) { onChange(urlInput.trim(), null); setUrlInput('') } }}
                                className="px-2 py-1.5 bg-[#006ce4] text-white rounded-lg text-xs">OK</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ dest, onClose, onSaved }: { dest: Destination | null; onClose: () => void; onSaved: () => void }) {
    const isEdit = !!dest
    const [name, setName] = useState(dest?.name ?? '')
    const [description, setDescription] = useState(dest?.description ?? '')
    const [country, setCountry] = useState(dest?.country ?? '')
    const [images, setImages] = useState<string[]>(dest?.images?.length ? [...dest.images, '', ''].slice(0, 3) : ['', '', ''])
    const [files, setFiles] = useState<(File | null)[]>([null, null, null])
    const [saving, setSaving] = useState(false)

    const setSlot = (i: number, val: string, file: File | null) => {
        setImages(prev => { const n = [...prev]; n[i] = val; return n })
        setFiles(prev => { const n = [...prev]; n[i] = file; return n })
    }
    const clearSlot = (i: number) => {
        setImages(prev => { const n = [...prev]; n[i] = ''; return n })
        setFiles(prev => { const n = [...prev]; n[i] = null; return n })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) { toast.error('Ad daxil edin'); return }
        const fd = new FormData()
        fd.append('name', name.trim())
        fd.append('description', description.trim())
        fd.append('country', country.trim())
        const kept: string[] = []
        const urlList: string[] = []
        images.forEach((img, i) => {
            if (!img) return
            if (files[i]) fd.append('images', files[i]!)
            else if (img.startsWith('/uploads')) kept.push(img)
            else urlList.push(img)
        })
        fd.append('keepImages', JSON.stringify(kept))
        fd.append('imageUrls', JSON.stringify(urlList))
        try {
            setSaving(true)
            if (isEdit) await destinationApi.update(dest!._id, fd)
            else await destinationApi.create(fd)
            toast.success(isEdit ? 'Yeniləndi' : 'Əlavə edildi')
            onSaved()
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xəta baş verdi')
        } finally { setSaving(false) }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
                    <h2 className="font-bold text-gray-800">{isEdit ? 'Destinasiyani Redaktə Et' : 'Yeni Destinasiya'}</h2>
                    <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"><X size={16} /></button>
                </div>
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Ad *</label>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Paris"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4]" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Ölkə</label>
                        <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Fransa"
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4]" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-medium mb-1 block">Açıqlama</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                            placeholder="Şəhər haqqında qısa məlumat..."
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#006ce4] resize-none" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-medium mb-2 block">Şəkillər (maks 3)</label>
                        <div className="flex gap-3">
                            {[0, 1, 2].map(i => (
                                <ImageSlot key={i} index={i} value={images[i] ?? ''}
                                    onChange={(val, file) => setSlot(i, val, file)}
                                    onClear={() => clearSlot(i)} />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 text-sm text-gray-500 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50">Ləğv et</button>
                        <button type="submit" disabled={saving}
                            className="flex-1 text-sm text-white bg-[#006ce4] py-2.5 rounded-xl hover:bg-[#0057b8] font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                            {saving && <Loader2 size={14} className="animate-spin" />}
                            {saving ? 'Saxlanır...' : isEdit ? 'Yadda Saxla' : 'Əlavə Et'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DestinationsAdminPage() {
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState<'add' | 'edit' | null>(null)
    const [selected, setSelected] = useState<Destination | null>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await destinationApi.getAll()
            setDestinations(res.data.destinations)
        } catch { toast.error('Yüklənmədi') }
        finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const filtered = destinations.filter(d =>
        `${d.name} ${d.country} ${d.description}`.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm('Silinsin?')) return
        setDeleting(id)
        try {
            await destinationApi.delete(id)
            toast.success('Silindi')
            fetchData()
        } catch { toast.error('Silinmədi') }
        finally { setDeleting(null) }
    }

    return (
        <div className="space-y-5 font-sans">
            <Toaster position="top-right" richColors />

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Ümumi Destinasiyalar', val: destinations.length, icon: <Globe size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
                    { label: 'Şəkilli Destinasiyalar', val: destinations.filter(d => d.images.some(Boolean)).length, icon: <ImagePlus size={18} className="text-emerald-500" />, bg: 'bg-emerald-50' },
                ].map(({ label, val, icon, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
                        <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-xl font-bold text-gray-800">{val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
                        <Search size={13} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Axtar..."
                            className="bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400 w-full" />
                    </div>
                    <button onClick={() => { setSelected(null); setModal('add') }}
                        className="flex items-center gap-2 text-xs text-white bg-[#006ce4] rounded-xl px-4 py-2 hover:bg-[#0057b8] transition-colors font-medium">
                        <Plus size={13} /> Destinasiya Əlavə Et
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50">
                                {['Şəkil', 'Ad', 'Ölkə', 'Açıqlama', 'Şəkil sayı', 'Əməliyyat'].map(h => (
                                    <th key={h} className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-left whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={6} className="py-16">
                                    <div className="flex justify-center"><Loader2 size={26} className="animate-spin text-[#006ce4]" /></div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">Nəticə tapılmadı</td></tr>
                            ) : filtered.map(d => (
                                <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                                    {/* Thumb */}
                                    <td className="px-4 py-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                                            {d.images[0]
                                                ? <img src={imgSrc(d.images[0])} alt={d.name} className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center"><Globe size={14} className="text-gray-300" /></div>
                                            }
                                        </div>
                                    </td>
                                    {/* Name */}
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-gray-800 text-sm">{d.name}</p>
                                    </td>
                                    {/* Country */}
                                    <td className="px-4 py-3">
                                        <span className="text-xs text-gray-500">{d.country || '—'}</span>
                                    </td>
                                    {/* Description */}
                                    <td className="px-4 py-3 max-w-xs">
                                        <p className="text-xs text-gray-400 line-clamp-2">{d.description || '—'}</p>
                                    </td>
                                    {/* Image count */}
                                    <td className="px-4 py-3">
                                        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                                            {d.images.filter(Boolean).length} / 3
                                        </span>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => { setSelected(d); setModal('edit') }}
                                                className="w-7 h-7 rounded-lg hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(d._id)} disabled={deleting === d._id}
                                                className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                                {deleting === d._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(modal === 'add' || modal === 'edit') && (
                <Modal dest={modal === 'edit' ? selected : null}
                    onClose={() => setModal(null)}
                    onSaved={() => { setModal(null); fetchData() }} />
            )}
        </div>
    )
}
