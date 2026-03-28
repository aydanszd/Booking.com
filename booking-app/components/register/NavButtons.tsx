import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
    step: number
    loading?: boolean
    nextLabel?: string
    isLast?: boolean
    onNext: () => void
    onBack: () => void
}

export default function NavButtons({ step, loading = false, nextLabel, isLast = false, onNext, onBack }: Props) {
    const t = useTranslations('auth')

    return (
        <div className="flex gap-2.5 mt-5">
            {step > 0 && (
                <button
                    onClick={onBack}
                    className="flex-1 h-11 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    {t('back')}
                </button>
            )}
            <button
                onClick={onNext}
                disabled={loading}
                className={[
                    'h-11 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.99] flex items-center justify-center gap-2',
                    step > 0 ? 'flex-2' : 'flex-1',
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#003580] hover:bg-[#00235b]',
                ].join(' ')}
            >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLast && loading ? t('creating') : (nextLabel ?? t('continue'))}
            </button>
        </div>
    )
}
