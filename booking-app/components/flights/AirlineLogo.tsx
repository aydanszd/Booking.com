'use client'

import { useState } from 'react'
import { getAirlineColor } from '@/utils/flightUtils'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Props {
    src?: string
    name: string
    size?: 'sm' | 'md' | 'lg'
}

export default function AirlineLogo({ src, name, size = 'md' }: Props) {
    const [imgOk, setImgOk] = useState<boolean | null>(src ? null : false)
    const sz = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'
    const fontSize = size === 'lg' ? 'text-base' : size === 'sm' ? 'text-[9px]' : 'text-xs'
    const { bg, text } = getAirlineColor(name)
    const initials = name.split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || name.slice(0, 2).toUpperCase()
    const imageUrl = src?.startsWith('/uploads') ? `${BASE}${src}` : src

    return (
        <div
            className={`${sz} rounded-xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden`}
            style={{ background: imgOk === true ? 'white' : bg, border: '1px solid #e5e7eb' }}
        >
            {imageUrl && imgOk !== false ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-contain p-1"
                    onLoad={() => setImgOk(true)} onError={() => setImgOk(false)}
                    style={{ display: imgOk === true ? 'block' : 'none' }} />
            ) : null}
            {imgOk !== true && (
                <span className={`${fontSize} font-bold leading-none`} style={{ color: text }}>{initials}</span>
            )}
        </div>
    )
}
