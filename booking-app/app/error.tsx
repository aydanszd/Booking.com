'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">Xəta baş verdi</h2>
                        <p className="text-sm text-gray-500 max-w-sm">Gözlənilməz xəta yarandı. Zəhmət olmasa səhifəni yenileyin.</p>
                    </div>
                    <button
                        onClick={reset}
                        className="px-5 py-2.5 bg-[#006ce4] text-white text-sm font-semibold rounded-xl hover:bg-[#0057b8] transition-colors"
                    >
                        Yenidən cəhd et
                    </button>
                </div>
            </body>
        </html>
    )
}
