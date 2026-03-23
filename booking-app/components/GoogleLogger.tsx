'use client';
import { useEffect } from 'react';

export default function GoogleLogger() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const userName = params.get('google_user');
            if (userName) {
                console.log(`UĞURLU GİRİŞ! Xoş gəldiniz, ${userName}! (Google vasitəsilə)`);
                const newQuery = new URLSearchParams(window.location.search);
                newQuery.delete('google_user');
                const newUrl = window.location.pathname + (newQuery.toString() ? '?' + newQuery.toString() : '');
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, []);
    return null;
}
