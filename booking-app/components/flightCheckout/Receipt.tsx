'use client'

import { useRef } from 'react'
import { CheckCircle2, Download, ArrowRight, Plane, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { fmt, fmtDate, CABIN_LABELS } from '@/utils/flightCheckoutUtils'

interface ReceiptData {
    bookingId: string
    airline: string
    flightNumber: string
    origin: string
    originCity: string
    destination: string
    destinationCity: string
    departureTime: string
    arrivalTime: string
    cabin: string
    totalPrice: number
    passengers: { fullName: string; idNumber: string; type: string }[]
}

interface Props {
    data: ReceiptData
    onClose: () => void
}

export default function Receipt({ data, onClose }: Props) {
    const t = useTranslations('checkout')
    const receiptRef = useRef<HTMLDivElement>(null)

    const handleDownloadPDF = async () => {
        if (typeof window === 'undefined') return
        try {
            const jsPDF = (await import('jspdf')).default
            const QRCode = (await import('qrcode')).default
            const doc = new jsPDF({ unit: 'mm', format: 'a4' })
            const W = 210
            const H = 297
            const P = 16

            const navy = () => doc.setTextColor(11, 35, 82)
            const blue = () => doc.setTextColor(0, 103, 218)
            const gray = () => doc.setTextColor(120, 135, 155)
            const white = () => doc.setTextColor(255, 255, 255)
            const bold = (sz: number) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(sz) }
            const normal = (sz: number) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(sz) }

            doc.setFillColor(244, 247, 252)
            doc.rect(0, 0, W, H, 'F')

            doc.setFillColor(11, 35, 82)
            doc.rect(0, 0, W, 46, 'F')
            doc.setFillColor(0, 103, 218)
            doc.rect(0, 42, W, 4, 'F')

            const cx = P + 11, cy = 22, cr = 11
            doc.setFillColor(255, 255, 255)
            doc.circle(cx, cy, cr, 'F')
            bold(18); blue()
            doc.text('B', cx, cy + 5.5, { align: 'center' })

            bold(18); white()
            doc.text('BOOKING.COM', cx + cr + 5, cy - 1)
            normal(7.5)
            doc.setTextColor(160, 193, 255)
            doc.text('E-TICKET  /  ELECTRONIC BOARDING PASS', cx + cr + 5, cy + 6)

            doc.setTextColor(160, 193, 255)
            normal(7)
            doc.text('BOOKING REFERENCE', W - P, 13, { align: 'right' })
            bold(13); white()
            doc.text(data.bookingId, W - P, 22, { align: 'right' })
            normal(7.5)
            doc.setTextColor(160, 193, 255)
            doc.text(new Date().toLocaleDateString('en-GB'), W - P, 30, { align: 'right' })

            let y = 54
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(P, y, W - P * 2, 72, 5, 5, 'F')
            doc.setDrawColor(215, 228, 248)
            doc.setLineWidth(0.35)
            doc.roundedRect(P, y, W - P * 2, 72, 5, 5, 'S')

            bold(10); navy()
            doc.text(data.airline.toUpperCase(), P + 8, y + 11)
            normal(7.5); gray()
            const infoStr = `${data.flightNumber}   |   ${CABIN_LABELS[data.cabin] || data.cabin}   |   ${fmtDate(data.departureTime)}`
            doc.text(infoStr, P + 8, y + 18)

            doc.setDrawColor(228, 236, 250)
            doc.setLineWidth(0.3)
            doc.line(P + 8, y + 22, W - P - 8, y + 22)

            const midX = W / 2
            const rowY = y + 40

            gray(); normal(7.5)
            doc.text('DEPARTURE', P + 8, rowY - 12)
            bold(30); navy()
            doc.text(data.origin, P + 8, rowY + 3)
            normal(8); gray()
            doc.text(data.originCity, P + 8, rowY + 10)
            bold(12); blue()
            doc.text(fmt(data.departureTime), P + 8, rowY + 20)

            doc.setDrawColor(200, 218, 245)
            doc.setLineWidth(0.6)
            doc.line(P + 50, rowY - 2, midX - 12, rowY - 2)
            doc.line(midX + 12, rowY - 2, W - P - 50, rowY - 2)
            doc.setFillColor(0, 103, 218)
            doc.triangle(midX + 6, rowY - 6, midX + 6, rowY + 2, midX + 13, rowY - 2, 'F')
            doc.setFillColor(200, 218, 245)
            doc.circle(P + 48, rowY - 2, 2, 'F')

            gray(); normal(7.5)
            doc.text('ARRIVAL', W - P - 8, rowY - 12, { align: 'right' })
            bold(30); navy()
            doc.text(data.destination, W - P - 8, rowY + 3, { align: 'right' })
            normal(8); gray()
            doc.text(data.destinationCity, W - P - 8, rowY + 10, { align: 'right' })
            bold(12); blue()
            doc.text(fmt(data.arrivalTime), W - P - 8, rowY + 20, { align: 'right' })

            y += 82
            doc.setFillColor(244, 247, 252)
            doc.circle(P, y + 1, 4, 'F')
            doc.circle(W - P, y + 1, 4, 'F')
            doc.setDrawColor(200, 215, 235)
            doc.setLineWidth(0.5)
            doc.setLineDashPattern([3, 3], 0)
            doc.line(P + 5, y + 1, W - P - 5, y + 1)
            doc.setLineDashPattern([], 0)
            y += 10

            bold(8); navy()
            doc.text('PASSENGERS', P, y + 6)
            doc.setFillColor(234, 242, 255)
            doc.roundedRect(P + 30, y + 1, 18, 7, 2, 2, 'F')
            bold(7); blue()
            doc.text(`${data.passengers.length} pax`, P + 39, y + 6, { align: 'center' })

            y += 12
            doc.setFillColor(11, 35, 82)
            doc.roundedRect(P, y, W - P * 2, 8, 2, 2, 'F')
            bold(7.5); white()
            doc.text('No', P + 5, y + 5.5)
            doc.text('FULL NAME', P + 16, y + 5.5)
            doc.text('CATEGORY', P + 94, y + 5.5)
            doc.text('ID / PASSPORT', W - P - 4, y + 5.5, { align: 'right' })
            y += 8

            data.passengers.forEach((p, i) => {
                doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 255 : 255)
                doc.rect(P, y, W - P * 2, 10, 'F')
                bold(8); navy()
                doc.text(`${i + 1}`, P + 5, y + 7)
                normal(9)
                doc.setTextColor(28, 38, 54)
                doc.text(p.fullName || '-', P + 16, y + 7)
                const isChild = p.type === 'child'
                doc.setFillColor(isChild ? 255 : 234, isChild ? 242 : 242, isChild ? 234 : 255)
                doc.roundedRect(P + 94, y + 2, isChild ? 12 : 14, 6, 2, 2, 'F')
                bold(6.5)
                doc.setTextColor(isChild ? 180 : 0, isChild ? 80 : 85, isChild ? 0 : 200)
                doc.text(isChild ? 'CHILD' : 'ADULT', P + 94 + (isChild ? 6 : 7), y + 6.5, { align: 'center' })
                normal(8); gray()
                doc.text(p.idNumber || '-', W - P - 4, y + 7, { align: 'right' })
                doc.setDrawColor(228, 235, 250)
                doc.setLineWidth(0.2)
                doc.line(P, y + 10, W - P, y + 10)
                y += 10
            })

            y += 8
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(P, y, W - P * 2, 26, 4, 4, 'F')
            doc.setDrawColor(215, 228, 248)
            doc.setLineWidth(0.35)
            doc.roundedRect(P, y, W - P * 2, 26, 4, 4, 'S')

            normal(8); gray()
            doc.text(`${data.passengers.length} passenger  x  $${Math.round(data.totalPrice / data.passengers.length)}`, P + 8, y + 10)
            bold(9); navy()
            doc.text('TOTAL PAYMENT', P + 8, y + 19)

            doc.setFillColor(11, 35, 82)
            doc.roundedRect(W - P - 38, y + 7, 34, 12, 3, 3, 'F')
            bold(13); white()
            doc.text(`$${data.totalPrice}`, W - P - 21, y + 16.5, { align: 'center' })

            y += 34
            try {
                const qrContent = `${data.bookingId}|${data.flightNumber}|${data.origin}-${data.destination}|${fmtDate(data.departureTime)}`
                const qrUrl = await QRCode.toDataURL(qrContent, { width: 256, margin: 1, color: { dark: '#0b2352', light: '#ffffff' } })
                const qrSize = 30
                const qrX = W / 2 - qrSize / 2
                doc.setFillColor(255, 255, 255)
                doc.roundedRect(qrX - 6, y - 3, qrSize + 12, qrSize + 14, 4, 4, 'F')
                doc.setDrawColor(215, 228, 248)
                doc.setLineWidth(0.3)
                doc.roundedRect(qrX - 6, y - 3, qrSize + 12, qrSize + 14, 4, 4, 'S')
                doc.addImage(qrUrl, 'PNG', qrX, y, qrSize, qrSize)
                normal(6.5); gray()
                doc.text('Scan to verify booking', W / 2, y + qrSize + 7, { align: 'center' })
            } catch (_) { /* skip if qr fails */ }

            doc.setFillColor(11, 35, 82)
            doc.rect(0, H - 14, W, 14, 'F')
            normal(7); doc.setTextColor(155, 185, 230)
            doc.text('This ticket is an official booking document. Please carry a valid ID at all times.', W / 2, H - 8, { align: 'center' })
            doc.text('Booking.com  |  Support 7/24  |  www.booking.com', W / 2, H - 3, { align: 'center' })

            doc.save(`ticket-${data.bookingId}.pdf`)
        } catch (err) {
            console.error('PDF error:', err)
            toast.error(t('pdfError'))
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 overflow-y-auto py-8">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
                <div className="bg-blue-600 rounded-t-3xl px-8 py-7 text-white text-center">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={28} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black">{t('confirmationTitle')}</h2>
                    <p className="text-blue-100 text-sm mt-1 font-medium">{t('ticketReady')}</p>
                    <p className="text-blue-200 text-xs mt-1">№ {data.bookingId}</p>
                </div>

                <div className="p-8 space-y-5" ref={receiptRef}>
                    <div className="bg-blue-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane size={16} className="text-blue-600" />
                            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{data.airline} · {data.flightNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900">{fmt(data.departureTime)}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1">{data.origin} · {data.originCity}</p>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1">
                                    <div className="w-10 h-px bg-gray-300" />
                                    <Plane size={14} className="text-blue-500" />
                                    <div className="w-10 h-px bg-gray-300" />
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold">{fmtDate(data.departureTime)}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-black text-gray-900">{fmt(data.arrivalTime)}</p>
                                <p className="text-xs font-bold text-gray-500 mt-1">{data.destination} · {data.destinationCity}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users size={13} /> {t('passengersCount', { count: data.passengers.length })}
                        </h3>
                        <div className="space-y-2">
                            {data.passengers.map((p, i) => (
                                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                                    <div>
                                        <p className="text-sm font-black text-gray-800">{p.fullName}</p>
                                        <p className="text-xs text-gray-400 font-medium">{p.type === 'child' ? t('childType') : t('adultType')}</p>
                                    </div>
                                    <p className="text-xs font-black text-gray-500">{t('idRef', { id: p.idNumber })}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-2xl px-6 py-4 flex items-center justify-between">
                        <span className="text-blue-100 text-sm font-bold">{t('totalPayment')}</span>
                        <span className="text-white text-2xl font-black">${data.totalPrice}</span>
                    </div>
                </div>

                <div className="px-8 pb-8 flex flex-col gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-2xl transition-all"
                    >
                        <Download size={18} /> {t('downloadPDF')}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 font-black py-3.5 rounded-2xl transition-all"
                    >
                        {t('goToBookings')} <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
