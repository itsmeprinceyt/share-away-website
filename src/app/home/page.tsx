"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckSession } from '../../hooks/useCheckSession';
import Navbar from '../(components)/Navbar';

/**
 * @description     - Home page which will show all the posts of every users and we can,
 * go to their profile or give hearts to their posts and see their data and stuff.
 */
export default function Home() {
    const router = useRouter();
    const session = useCheckSession();
    useEffect(() => {
        let sessionData = sessionStorage.getItem('userSession');

        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                sessionStorage.setItem('userSession', sessionData);
            }
        }

        if (!sessionData) {
            router.push('/');
        }

    }, [router]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-2 h-screen">
                <p className="text-lg font-semibold animate-pulse bg-black text-white p-2 px-4 rounded-lg ">
                    Welcome to the Home Page. How are you {session?.user.username}</p>
            </div>
        </div>
    );
}