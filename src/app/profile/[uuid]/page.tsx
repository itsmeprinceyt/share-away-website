"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import getBaseUrl from '../../../utils/getBaseUrl';
import User from '../../../types/User';

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string;

    // State for the logged-in user's session data
    const [loggedInUserDetails, setLoggedInUserDetails] = useState<User | null>(null);
    
    // State for the profile details of the user we're viewing
    const [profileDetails, setProfileDetails] = useState<User | null>(null);
    
    // State for the logged-in user's message and admin status
    const [message, setMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (!uuid) return;

        const sessionData = sessionStorage.getItem('userSession');

        // If no user session, redirect to login
        if (!sessionData) {
            router.push('/login');
            return;
        }

        const parsedSession = JSON.parse(sessionData);
        const { user, expiry } = parsedSession;
        const expiryDate = new Date(expiry);

        // Check if session is expired and redirect to login
        if (new Date() > expiryDate) {
            sessionStorage.removeItem('userSession');
            router.push('/login');
            return;
        }

        setMessage(parsedSession.message || '');
        setIsAdmin(user.isAdmin === 1); // Check if the logged-in user is an admin

        // Set logged-in user details
        setLoggedInUserDetails(user);

        // If viewing your own profile, use logged-in user details
        if (uuid === user.uuid) {
            setProfileDetails(user);
            setIsOwner(true);
        } else {
            // If viewing someone else's profile, fetch from backend
            fetch(`${getBaseUrl()}/user/${uuid}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.uuid) {
                        setProfileDetails(data);
                        setIsOwner(false); // Not the owner
                    } else {
                        router.push('/404'); // If no user found
                    }
                })
                .catch(() => {
                    router.push('/404'); // Handle error
                });
        }
    }, [router, uuid]);

    // If data is still loading or no profile details found, show loading message
    if (!uuid || (!profileDetails && !loggedInUserDetails)) return <p>Loading...</p>;

    // Use logged-in user details for their own profile, else use fetched profile details
    const userDetails = profileDetails || loggedInUserDetails;

    return (
        <div>
            <h1>Welcome to {userDetails!.username}&apos;s Profile</h1>
            <p>Email: {userDetails!.email}</p>
            <p>Verified: {userDetails!.isVerified ? 'Yes' : 'No'}</p>
            <p>Registered on: {new Date(userDetails!.registeredDate).toLocaleDateString()}</p>
            {message && isOwner && <p>{message}</p>}

            {/* If the user is the owner or an admin, show edit options */}
            {(isOwner || isAdmin) && (
                <div>
                    <button>Edit Profile</button>
                    {/* More owner/admin-only actions */}
                </div>
            )}
        </div>
    );
}
