'use client'

import { useRef, useEffect } from 'react'

export default function GoogleMap({
    lat,
    lng,
    city,
    country,
    apiKey,
}: {
    lat?: number
    lng?: number
    city?: string
    country?: string
    apiKey?: string
}) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<any>(null)

    const resolvedKey = apiKey ?? (typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''
        : '')

    useEffect(() => {
        if (!mapRef.current) return

        const loadAndInit = (resolvedLat: number, resolvedLng: number) => {
            if (mapInstanceRef.current) return

            const existing = document.querySelector('#google-maps-script')
            const init = () => {
                const google = (window as any).google
                if (!google || !mapRef.current) return

                const map = new google.maps.Map(mapRef.current, {
                    center: { lat: resolvedLat, lng: resolvedLng },
                    zoom: 14,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] },
                    ],
                })

                new google.maps.Marker({
                    position: { lat: resolvedLat, lng: resolvedLng },
                    map,
                    icon: {
                        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
                        fillColor: '#2563eb',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        scale: 1.8,
                        anchor: new google.maps.Point(12, 22),
                    },
                })

                mapInstanceRef.current = map
            }

            if (existing) {
                if ((window as any).google?.maps) init()
                else existing.addEventListener('load', init)
                return
            }

            const script = document.createElement('script')
            script.id = 'google-maps-script'
            script.src = `https://maps.googleapis.com/maps/api/js?key=${resolvedKey}`
            script.async = true
            script.defer = true
            script.onload = init
            document.head.appendChild(script)
        }

        if (lat !== undefined && lng !== undefined) {
            loadAndInit(lat, lng)
        } else if (city) {
            const query = encodeURIComponent(`${city}${country ? ', ' + country : ''}`)
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${resolvedKey}`)
                .then(r => r.json())
                .then(data => {
                    const loc = data?.results?.[0]?.geometry?.location
                    if (loc) loadAndInit(loc.lat, loc.lng)
                })
                .catch(() => loadAndInit(48.8566, 2.3522))
        }

        return () => {
            mapInstanceRef.current = null
        }
    }, [lat, lng, city, country, resolvedKey])

    if (!resolvedKey) {
        const query = lat && lng
            ? `${lat},${lng}`
            : encodeURIComponent(`${city ?? ''}${country ? ', ' + country : ''}`)
        return (
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${query}&output=embed&z=14`}
            />
        )
    }

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
}
