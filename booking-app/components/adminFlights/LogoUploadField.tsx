'use client'

import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'

export default function LogoUploadField({
    value,
    onChange,
}: {
    value: string
    onChange: (url: string) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState(value || '')
    const [dragging, setDragging] = useState(false)

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Yalnız şəkil faylı seçin')
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            const url = e.target?.result as string
            setPreview(url)
            onChange(url)
        }
        reader.readAsDataURL(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview('')
        onChange('')
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500">Airline Logosu</label>
            <div
                onClick={() => !preview && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed h-24 transition-all cursor-pointer select-none ${
                    dragging
                        ? 'border-[#006ce4] bg-blue-50'
                        : 'border-gray-200 hover:border-[#006ce4] bg-gray-50'
                }`}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="logo preview"
                            className="h-16 w-auto max-w-35 object-contain rounded-lg"
                        />
                        <button
                            onClick={clear}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
                        >
                            <X size={10} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
                            className="absolute bottom-1.5 right-1.5 text-[10px] text-gray-400 hover:text-[#006ce4] transition-colors"
                        >
                            Dəyiş
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                        <ImagePlus size={22} />
                        <span className="text-[11px]">Şəkil yüklə və ya buraya sürükle</span>
                        <span className="text-[10px] text-gray-300">PNG, JPG, SVG, WEBP</span>
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFile(file)
                    }}
                />
            </div>
        </div>
    )
}
