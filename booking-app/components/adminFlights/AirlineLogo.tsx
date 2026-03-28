'use client'

import { useState } from 'react'
import { Plane } from 'lucide-react'

export default function AirlineLogo({
    logoUrl,
    airline,
    size = 'md',
}: {
    logoUrl?: string
    airline: string
    size?: 'sm' | 'md'
}) {
    const [err, setErr] = useState(false)
    const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
    const iconSize = size === 'sm' ? 11 : 14

    if (logoUrl && !err) {
        return (
            <div className={`${dim} rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-white flex items-center justify-center`}>
                <img
                    src={logoUrl}
                    alt={airline}
                    className="w-full h-full object-contain p-0.5"
                    onError={() => setErr(true)}
                />
            </div>
        )
    }

    return (
        <div className={`${dim} rounded-lg bg-blue-50 flex items-center justify-center shrink-0`}>
            <Plane size={iconSize} className="text-blue-500" />
        </div>
    )
}
