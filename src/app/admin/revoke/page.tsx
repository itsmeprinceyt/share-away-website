"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';
import PageWrapperWhiteTop from '../../(components)/PageWrapperWhiteTop';
import Link from 'next/link';

/**
 * @description - Admin panel: revoke ban section.
 */
export default function Admin() {
    const router = useRouter();
    const [revokeEmail, setRevokeEmail] = useState('');
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

    const handleUnban = async () => {
        if (!revokeEmail) {
            setResponseMessage("Please enter an email address.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${getBaseUrl()}/user/revoke/${revokeEmail}`, {
                method: 'POST',
            });

            const data = await res.json();
            setResponseMessage(res.ok ? data.message : data.error || 'Failed to unban user');
        } catch (err) {
            console.log(err);
            setResponseMessage('Something went wrong while trying to unban.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageWrapperWhiteTop>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">

                <Link href="/admin">
                    <div className="text-green-500 text-shadow-md text-shadow-green-500/20 hover:underline">
                        Panel
                    </div>
                </Link>

                <div className="w-[300px] mx-auto 
                border border-green-300/30 bg-white rounded-lg shadow-xl
                shadow-green-500/30 flex flex-col gap-5 p-5">

                    <input
                        type="email"
                        placeholder="Enter user's email"
                        value={revokeEmail}
                        onChange={(e) => setRevokeEmail(e.target.value)}
                        className="bg-white border border-green-300/20 focus:orange-green-500 focus:outline-none text-green-500 p-2 rounded-lg w-full font-extralight"
                    />

                    <button
                        onClick={handleUnban}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-green-500 to-green-400
                    text-white rounded-lg w-full py-2 border border-green-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 font-extralight disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Unban User'}
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
