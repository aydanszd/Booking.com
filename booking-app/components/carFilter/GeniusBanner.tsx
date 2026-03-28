'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function GeniusBanner() {
    const [visible, setVisible] = useState(true)
    if (!visible) return null
    return (
        <div className="relative bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.07)] p-4 mb-4 flex items-center gap-4 border border-blue-50 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-700 rounded-l-2xl" />
            <div className="flex-1 pl-2">
                <p className="text-sm font-bold text-gray-900">Giriş yapın, tasarruf edin</p>
                <p className="text-xs text-gray-500 mt-0.5">Bu konumdaki seçili arabalarda %10 tasarruf edin</p>
                <div className="flex gap-2 mt-2.5">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors">Giriş yap</button>
                    <button className="border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">Kaydol</button>
                </div>
            </div>
            <div className="w-20 flex-shrink-0">
                <img
                    src="https://t-cf.bstatic.com/design-assets/assets/v3.172.2/illustrations-traveller/GeniusCarsBadge.png"
                    alt=""
                    onError={e => (e.currentTarget.style.display = 'none')}
                />
            </div>
            <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}
