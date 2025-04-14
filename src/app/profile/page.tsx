"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../(components)/Loading';

/**
 * @description - Redirects user to their profile page based on session. 
 */
export default function ProfilePage() {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);

    useEffect(() => {
        let sessionData = sessionStorage.getItem('userSession');

        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                sessionStorage.setItem('userSession', sessionData);
            }
        }

        if (sessionData) {
            const parsed = JSON.parse(sessionData);
            router.push(`/profile/${parsed.user.uuid}`);
        } else {
            router.push('/login');
        }

        setIsRedirecting(false);
    }, [router]);

    return isRedirecting ? <Loading /> : null;
}
