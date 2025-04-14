'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckSession } from './useCheckSession';;

/**
 * @description It redirects the user to their home page if they are logged in.
 */
const useRedirectToHome = () => {
    const router = useRouter();
    const session = useCheckSession();
    
    useEffect(() => {
        if (session) {
            router.push(`/home`);
        } else {
            router.push('/');
        }
    }, [router, session, session?.user.uuid]);
};

export default useRedirectToHome;
