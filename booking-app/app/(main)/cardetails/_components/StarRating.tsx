'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export function StarRating({ score }: { score: number }) {
    const stars = Math.round(score / 2)
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
        </div>
    )
}

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <button key={n} type="button"
                    onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
                    onClick={() => onChange(n)} className="transition-transform hover:scale-110">
                    <Star size={18} className={n <= (hovered || value) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                </button>
            ))}
        </div>
    )
}
