"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';

/**
 * @description - Admin panel: ban user section.
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

    const handleBan = async () => {
        if (!revokeEmail) {
            setResponseMessage("Please enter an email address.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${getBaseUrl()}/user/ban-email/${revokeEmail}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            setResponseMessage(res.ok ? data.message : data.error || 'Failed to ban user');
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
                <h2 className="text-xl font-semibold text-gray-800">Ban User</h2>

                <input
                    type="email"
                    placeholder="Enter user's email"
                    value={revokeEmail}
                    onChange={(e) => setRevokeEmail(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleBan}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isLoading ? 'Processing...' : 'Ban User'}
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
