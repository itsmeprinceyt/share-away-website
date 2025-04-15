"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';

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
        <div className="">
            <Navbar />

            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Revoke Ban (Unban User)</h2>

                <input
                    type="email"
                    placeholder="Enter user's email"
                    value={revokeEmail}
                    onChange={(e) => setRevokeEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleUnban}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
    );
}
