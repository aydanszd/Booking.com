'use client'

import { useState } from 'react'
import { Mail, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ForgotPasswordForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return toast.error('E-posta daxil edin')

        setLoading(true)
        try {
            await axios.post(`${API_URL}/api/auth/forgot-password`, { email })
            toast.success('Sıfırlama linki göndərildi!')
            setSent(true)
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Xəta baş verdi')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.08)] p-7">
                <Link href="/signin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#003580] mb-6 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Giriş səhifəsinə qayıt
                </Link>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Şifrənizi unutmusunuz?</h2>
                <p className="text-sm text-gray-500 mb-8">
                    E-posta ünvanınızı daxil edin, biz sizə şifrənizi yeniləmək üçün link göndərəcəyik.
                </p>

                {sent ? (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-emerald-900 mb-1">E-poçt göndərildi!</h3>
                        <p className="text-sm text-emerald-700">
                            {email} ünvanına təlimatlar göndərildi. Zəhmət olmasa spam qovluğunu da yoxlayın.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-500">E-posta</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    placeholder="nümunə@mail.com"
                                    className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:border-[#003580] outline-none transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#003580] hover:bg-[#00235b] text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Link göndər
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
