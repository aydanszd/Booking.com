'use client'

import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function CheckoutBreadcrumb() {
    const t = useTranslations('checkout')
    return (
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8 font-semibold uppercase tracking-widest">
            <span className="text-blue-600">{t('typeFlight')}</span>
            <ChevronRight size={12} />
            <span className="text-blue-600">{t('selectionStep')}</span>
            <ChevronRight size={12} />
            <span className="text-gray-700">{t('paymentStep')}</span>
        </nav>
    )
}
