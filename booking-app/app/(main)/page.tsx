'use client';
import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const userName = params.get('google_user');
            if (userName) {
                console.log(`🥳 UĞURLU GİRİŞ! Xoş gəldiniz, ${userName}! (Google vasitəsilə)`);
                // URL-i təmizləyirik ki səliqəli qalsın
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, []);

    return <div>Stays</div>;
}
