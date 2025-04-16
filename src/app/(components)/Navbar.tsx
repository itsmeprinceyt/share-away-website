'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logout from './Logout';
import { useCheckSession } from '@/hooks/useCheckSession';
import { useState, useEffect } from 'react';
import getBaseUrl from '../../utils/getBaseUrl';
import HeartNotification from '../../types/HeartNotification';

export default function Navbar() {
    const session = useCheckSession();
    const [notifications, setNotifications] = useState<HeartNotification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!session?.user?.uuid) return;
            try {
                const response = await fetch(`${getBaseUrl()}/notifications/heart?uuid=${session.user.uuid}`);
                const data = await response.json();
                setNotifications(data.notifications || []);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };
        fetchNotifications();
    }, [session]);

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <div className="text-white text-lg font-bold">ShareAway</div>

            <ul className="flex space-x-4 items-center">
                <li>
                    <Link href="/" className="text-white hover:text-gray-400">Home</Link>
                </li>
                {session && (
                    <li>
                        <Link href="/post" className="text-white hover:text-gray-400">Post</Link>
                    </li>
                )}

                {/* Show admin panel if user is admin */}
                {session?.user?.isAdmin === 1 && (
                    <li>
                        <Link href="/admin" className="text-white hover:text-gray-400">Admin</Link>
                    </li>
                )}

                {/* Show user profile if logged in */}
                {session && (
                    <li>
                        <Link href="/profile" className="text-white hover:text-gray-400 flex items-center space-x-2">
                            {session.user.pfp ? (
                                <Image
                                    src={session.user.pfp}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="rounded-full"
                                />
                            ) : (
                                <span className="text-white">Profile</span>
                            )}
                        </Link>
                    </li>
                )}

                {/* Show notifications */}
                {notifications.length > 0 && (
                    <li>
                        <div className="relative">
                            <button className="text-white hover:text-gray-400">
                                Notifications
                            </button>
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                                {notifications.length}
                            </div>
                            <div className="absolute bg-white text-black shadow-lg w-48 mt-2 rounded-lg p-2">
                                {notifications.map((notif) => (
                                    <div key={notif.post_uuid} className="mb-2 p-2 hover:bg-gray-200 rounded-lg">
                                        <Link href={`/post/${notif.post_uuid}`}>
                                            <span>
                                                <strong>@{notif.liker_username}</strong> liked your post.
                                            </span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </li>
                )}

                {/* If not logged in, show Login/Register */}
                {!session && (
                    <>
                        <li>
                            <Link href="/login" className="text-white hover:text-gray-400">Login</Link>
                        </li>
                        <li>
                            <Link href="/sign-up" className="text-white hover:text-gray-400">Register</Link>
                        </li>
                    </>
                )}

                {/* If logged in, show logout */}
                {session && (
                    <li>
                        <Logout />
                    </li>
                )}
            </ul>
        </nav>
    );
}
