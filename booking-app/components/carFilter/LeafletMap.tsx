'use client'

import { useEffect, useRef } from 'react'

export default function LeafletMap() {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    useEffect(() => {
        if (mapInstanceRef.current || !mapRef.current) return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
            const L = (window as any).L
            if (!L || !mapRef.current) return
            const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: false, dragging: false, attributionControl: false })
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 15 }).addTo(map)
            map.setView([53.6304, 10.0058], 12)
            const icon = L.divIcon({
                html: `<div style="width:22px;height:22px;background:#2563eb;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
                className: '', iconSize: [22, 22], iconAnchor: [11, 22],
            })
            L.marker([53.6304, 10.0058], { icon }).addTo(map)
            mapRef.current?.addEventListener('click', () => { map.scrollWheelZoom.enable(); map.dragging.enable() })
            mapInstanceRef.current = map
        }
        document.head.appendChild(script)
        return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
    }, [])

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
