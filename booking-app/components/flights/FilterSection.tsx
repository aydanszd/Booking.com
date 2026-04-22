'use client'

import { useState } from 'react'

interface Props {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}

export default function FilterSection({ title, children, defaultOpen = true }: Props) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <div className="border-t border-gray-100 pt-4">
            <button onClick={() => setOpen(v => !v)} className="flex items-center justify-between w-full mb-2 group">
                <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
                <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && <div>{children}</div>}
        </div>
    )
}
