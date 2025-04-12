"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import User from '../../../types/User';

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string;

    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (!uuid) return;

        const sessionData = sessionStorage.getItem('userSession');
        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            const { user, expiry } = parsedSession;

            const expiryDate = new Date(expiry);
            if (new Date() > expiryDate) {
                sessionStorage.removeItem('userSession');
                router.push('/login');
                return;
            }
            setMessage(parsedSession.message || '');

            if (uuid === user.uuid) {
                setUserDetails(user);
                setIsOwner(true);
            } else {
                fetch(`${getBaseUrl()}/user/${uuid}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data && data.uuid) {
                            setUserDetails(data);
                            setIsOwner(false);
                        } else {
                            router.push('/404');
                        }
                    })
                    .catch(() => {
                        router.push('/404');
                    });
            }
        } else {
            // Not logged in, still fetch public profile
            fetch(`${getBaseUrl()}/user/${uuid}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.uuid) {
                        setUserDetails(data);
                        setIsOwner(false);
                    } else {
                        router.push('/404');
                    }
                })
                .catch(() => {
                    router.push('/404');
                });
        }
    }, [router, uuid]);

    if (!uuid || !userDetails) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome to {userDetails.username}&apos;s Profile</h1>
            <p>Email: {userDetails.email}</p>
            <p>Verified: {userDetails.isVerified ? 'Yes' : 'No'}</p>
            <p>Registered on: {new Date(userDetails.registeredDate).toLocaleDateString()}</p>
            {message && isOwner && <p>{message}</p>}

            {isOwner && (
                <div>
                    <button>Edit Profile</button>
                    {/* More owner-only actions */}
                </div>
            )}
        </div>
    );
}
