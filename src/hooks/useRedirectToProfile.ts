'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckSession } from './useCheckSession';;

/**
 * @description It redirects the user to their profile page if they are logged in.
 * If the user is not logged in or there is no session data, useCheckSession will
 * handle the redirection to the login page.
 */
const useRedirectToProfile = () => {
    const router = useRouter();
    const session = useCheckSession();
    
    useEffect(() => {
        if (session) {
            router.push(`/profile/${session?.user.uuid}`);
        }
    }, [router, session, session?.user.uuid]);
};

export default useRedirectToProfile;
