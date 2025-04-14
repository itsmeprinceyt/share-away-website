"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import UserSession from '../types/UserSession';
import getBaseUrl from '../utils/getBaseUrl';

type Role = 'USER' | 'ADMIN';

/**
 * @description Check sessions and if it isn't present then try to fetch from
 * local storage. Including that it optionally checks for ADMIN role.
 * If the session is missing, expired, or deleted on server, redirects to /login.
 * If user isn't admin (when required), redirects to /home.
 */
export const useCheckSession = (requiredRole: Role = 'USER'): UserSession | null => {
    const router = useRouter();
    const [session, setSession] = useState<UserSession | null>(null);
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const validateSession = async () => {
            let sessionData = sessionStorage.getItem('userSession');

            if (!sessionData) {
                sessionData = localStorage.getItem('userSession');
                if (sessionData) {
                    sessionStorage.setItem('userSession', sessionData);
                }
            }

            if (!sessionData) {
                if (!hasRedirected.current) {
                    hasRedirected.current = true;
                }
                return;
            }

            const parsed: UserSession = JSON.parse(sessionData);
            const { user, expiry } = parsed;
            const isExpired = new Date() > new Date(expiry);
            const isAdminCheck = requiredRole === 'ADMIN' && user.isAdmin !== 1;

            if (isExpired) {
                sessionStorage.removeItem('userSession');
                localStorage.removeItem('userSession');
                if (!hasRedirected.current) {
                    hasRedirected.current = true;
                    router.push('/login');
                }
                return;
            }

            try {
                const res = await fetch(`${getBaseUrl()}/user/check/${user.uuid}`);
                if (!res.ok) {
                    sessionStorage.removeItem('userSession');
                    localStorage.removeItem('userSession');
                    if (!hasRedirected.current) {
                        hasRedirected.current = true;
                        router.push('/');
                    }
                    return;
                }
            } catch (err) {
                console.error('Error checking account existence:', err);
            }

            if (isAdminCheck) {
                if (!hasRedirected.current) {
                    hasRedirected.current = true;
                    router.push('/home');
                }
                return;
            }
            setSession(parsed);
        };

        validateSession();
    }, [requiredRole, router]);

    return session;
};