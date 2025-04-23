"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';
import PageWrapperWhiteTop from '../../(components)/PageWrapperWhiteTop';
import Link from 'next/link';

/**
 * @description - Admin panel: reset user password section.
 */
export default function Admin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useCheckSession('ADMIN');

    useEffect(() => {
        let sessionData = sessionStorage.getItem('userSession');
        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                sessionStorage.setItem('userSession', sessionData);
            }
        }
        if (!sessionData) {
            router.push(`/login`);
        }
    }, [router]);

    const handlePasswordReset = async () => {
        if (!username) {
            setResponseMessage("Please enter a username.");
            return;
        }

        setIsLoading(true);
        try {
            const userSessionToken = sessionStorage.getItem('userSession');
            const { token } = JSON.parse(userSessionToken!);

            const res = await fetch(`${getBaseUrl()}/user/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            const data = await res.json();
            setResponseMessage(res.ok ? data.message : data.error || 'Failed to reset password.');
        } catch (err) {
            console.error(err);
            setResponseMessage('Something went wrong while trying to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapperWhiteTop>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">

                <Link href="/admin">
                    <div className="text-red-500 text-shadow-md text-shadow-red-500/20 hover:underline">
                        Panel
                    </div>
                </Link>

                <div className="w-[300px] mx-auto 
                border border-red-300/30 bg-white rounded-lg shadow-xl
                shadow-red-500/30 flex flex-col gap-5 p-5">
                    <input
                        type="text"
                        placeholder="Enter user's username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-white border border-red-300/20 focus:red-pink-500 focus:outline-none text-red-500 p-2 rounded-lg w-full font-extralight"
                    />

                    <button
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-red-500 to-red-400
                    text-white rounded-lg w-full py-2 border border-red-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 font-extralight disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Reset Password'}
                    </button>

                    {responseMessage && (
                        <div className="text-sm text-center text-gray-700 mt-2">
                            {responseMessage}
                        </div>
                    )}
                </div>
            </div>
        </PageWrapperWhiteTop>
    );
}