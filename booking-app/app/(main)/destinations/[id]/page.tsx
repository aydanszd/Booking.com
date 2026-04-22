'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { destinationApi } from '@/api/destination'
import { Loader2, ArrowLeft, MapPin, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'

import { imgSrc } from '@/utils/imageUrl'
import type { Destination } from '@/types/destination'

export default function DestinationDetailPage() {
    const { id } = useParams() as { id: string }
    const router = useRouter()
    const t = useTranslations('destinations')
    const [dest, setDest] = useState<Destination | null>(null)
    const [loading, setLoading] = useState(true)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    useEffect(() => {
        destinationApi.getOne(id)
            .then(res => setDest(res.data))
            .catch(() => setDest(null))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
    )

    if (!dest) return (
        <div className="flex flex-col items-center justify-center h-96 gap-3">
            <p className="text-gray-500 text-sm">{t('notFound')}</p>
            <button onClick={() => router.back()} className="text-[#006ce4] hover:underline text-sm">{t('goBack')}</button>
        </div>
    )

    const images = dest.images.filter(Boolean)
    const srcs = images.map(url => imgSrc(url))
    const slides = srcs.map(src => ({ src }))
    const mainImg = srcs[0]
    const sideImgs = [srcs[1] ?? imgSrc(''), srcs[2] ?? imgSrc('')]

    const openAt = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 mt-20 min-h-screen">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 mt-2">
                <Link href="/" className="hover:text-[#006ce4] transition-colors">{t('home')}</Link>
                <ChevronRight size={12} />
                <Link href="/attractions" className="hover:text-[#006ce4] transition-colors">{t('attractions')}</Link>
                <ChevronRight size={12} />
                <span className="text-gray-600 font-medium truncate">{dest.name}</span>
            </nav>

            {/* Title + Location */}
            <div className="bg-white px-3 sm:px-6 py-4 mb-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 leading-tight">{dest.name}</h1>
                        {dest.country && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 rounded-xl px-3 py-2 w-fit mt-2">
                                <MapPin size={13} className="text-[#006ce4] shrink-0" />
                                <span className="font-medium">{dest.name}</span>
                                <span className="text-gray-400">· {dest.country}</span>
                            </div>
                        )}
                    </div>
                    <button onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#006ce4] transition-colors shrink-0">
                        <ArrowLeft size={15} /> {t('back')}
                    </button>
                </div>
            </div>

            {/* Photo gallery */}
            <div className="bg-white px-3 sm:px-6 py-4 mb-4 rounded-2xl border border-gray-100 shadow-sm">
                {/* Mobile */}
                <div className="sm:hidden rounded-xl overflow-hidden h-56 cursor-zoom-in" onClick={() => openAt(0)}>
                    <img src={mainImg} alt={dest.name} className="w-full h-full object-cover" />
                </div>
                {/* Desktop: 4-col grid */}
                <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-100">
                    <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-zoom-in group" onClick={() => openAt(0)}>
                        <img src={mainImg} alt={dest.name} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                            {srcs.length > 0 && `1 / ${srcs.length}`}
                            <span className="hidden sm:inline"> · {t('clickToZoom')}</span>
                        </div>
                    </div>
                    {sideImgs.map((src, i) => (
                        <div key={i} className="col-span-2 rounded-xl overflow-hidden cursor-zoom-in" onClick={() => openAt(i + 1)}>
                            <img src={src} alt={`${dest.name} ${i + 2}`} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Description */}
            {dest.description && (
                <div className="px-3 sm:px-6 py-5">
                    <h2 className="text-base font-bold text-gray-900 mb-3">{t('about')}</h2>
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{dest.description}</p>
                </div>
            )}

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
                plugins={[Thumbnails, Zoom, Counter]}
                thumbnails={{
                    position: 'bottom',
                    width: 80,
                    height: 56,
                    border: 2,
                    borderRadius: 8,
                    padding: 2,
                    gap: 8,
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    scrollToZoom: true,
                }}
                counter={{ container: { style: { top: 0, bottom: 'unset' } } }}
                styles={{
                    container: { backgroundColor: 'rgba(0,0,0,0.92)' },
                }}
            />
        </div>
    )
}
