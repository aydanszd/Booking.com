'use client'

import { useState } from 'react'
import { Car } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'

const BASE = 'http://localhost:5000'

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
    const t = useTranslations('cars')
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const [activeThumb, setActiveThumb] = useState(0)
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

    const srcs = images.map(img => img.startsWith('http') ? img : `${BASE}${img}`)
    const slides = srcs.map(src => ({ src }))

    const openAt = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
    }

    if (srcs.length === 0) {
        return (
            <div className="h-65 sm:h-85 md:h-105 rounded-xl sm:rounded-2xl bg-gray-100 flex items-center justify-center">
                <Car className="w-20 h-20 text-gray-200" />
            </div>
        )
    }

    return (
        <div className="relative">
            <div
                className="relative h-65 sm:h-85 md:h-105 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 group cursor-zoom-in"
                onClick={() => openAt(activeThumb)}
            >
                {!imgErrors[activeThumb] ? (
                    <img
                        src={srcs[activeThumb]}
                        alt={title}
                        onError={() => setImgErrors(p => ({ ...p, [activeThumb]: true }))}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-20 h-20 text-gray-200" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                    {activeThumb + 1} / {srcs.length}
                    <span className="hidden sm:inline"> · {t('clickToZoom')}</span>
                </div>
            </div>

            {srcs.length > 1 && (
                <div className="flex gap-1.5 sm:gap-2 mt-2">
                    {srcs.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveThumb(i)}
                            className={`flex-1 h-12 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                                activeThumb === i
                                    ? 'border-blue-600 opacity-100'
                                    : 'border-transparent opacity-55 hover:opacity-90'
                            }`}
                        >
                            {!imgErrors[i] ? (
                                <img
                                    src={img}
                                    alt=""
                                    onError={() => setImgErrors(p => ({ ...p, [i]: true }))}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <Car className="w-5 h-5 text-gray-300" />
                                </div>
                            )}
                        </button>
                    ))}
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
