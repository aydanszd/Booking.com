'use client'

import React, { useState } from 'react'

interface Props {
    value: string
    options: string[]
    onChange: (v: string) => void
}

export default function HeaderDropdown({ value, options, onChange }: Props) {
    const [open, setOpen] = useState(false)
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative shrink-0">
            <button onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1.5 bg-yellow-300 hover:bg-yellow-200 transition-colors rounded-lg px-3 py-2 text-sm font-medium text-gray-800 cursor-pointer focus:outline-none">
                {value}
                <svg className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div className="absolute left-0 top-full mt-1.5 z-50 min-w-40 overflow-hidden"
                style={{ transition: 'opacity 180ms ease, transform 180ms ease', opacity: open ? 1 : 0, transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-6px) scaleY(0.95)', transformOrigin: 'top', pointerEvents: open ? 'auto' : 'none' }}>
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
                    {options.map(opt => (
                        <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${opt === value ? 'bg-yellow-50 text-yellow-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <span className={`w-4 text-center text-xs ${opt === value ? 'opacity-100' : 'opacity-0'}`}>✓</span>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
