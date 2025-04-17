'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCheckSession } from '../../hooks/useCheckSession';
import { useState, useEffect } from 'react';
import getBaseUrl from '../../utils/getBaseUrl';
import HeartNotification from '../../types/HeartNotification';

export default function Navbar() {
    const router = useRouter();
    const session = useCheckSession();
    const [notifications, setNotifications] = useState<HeartNotification[]>([]);
    const [showBell, setShowBell] = useState(false);
    const [showHamburger, setShowHamburger] = useState(false);

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

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('userSession');
            localStorage.removeItem('userSession');
        }
        router.push('/');
    };

    const handleHamburger = () => {
        if(showBell) setShowBell(!showBell);
        setShowHamburger(!showHamburger);
    }

    const handleBell = () => {
        if(showHamburger) setShowHamburger(!showHamburger);
        setShowBell(!showBell);
    }



    return (
        <div className="absolute right-5 top-5 bg-gray-800 p-4 flex justify-between items-center">
            {(session && notifications.length > 0) && (
                <div className="relative">
                    <button onClick={handleBell}>
                        <div className="absolute top-3 right-2 bg-red-600 text-white text-xs rounded-full w-[20px] h-[20px] flex justify-center items-center">
                            {notifications.length}
                        </div>
                        <div className="">🔔</div>
                    </button>
                </div>
            )}

            {(showBell) && (
                    <div className="absolute top-24 right-10 bg-white text-black shadow-lg w-48 mt-2 rounded-lg p-2">
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
            )}

            {session && (
                <div>
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
                            <Image
                                src={'/avatar/DefaultAvatar.png'}
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        )}
                    </Link>
                </div>
            )}
            <button
                onClick={handleHamburger}
            >
                <Image
                    src={'/icons/Hamburger.png'}
                    width={30}
                    height={30}
                    alt=""
                />
            </button>
            {(showHamburger) && (
                <div className="absolute flex flex-col justify-start items-start gap-5 text-black top-20 bg-slate-200 rounded-xl p-5">
                    <ul>
                        <li className=" hover:text-gray-400">
                            <Link href="/">Home</Link>
                        </li>
                        {session && (
                            <li className="hover:text-gray-400">
                                <Link href="/post">Post</Link>
                            </li>
                        )}
                        {session?.user?.isAdmin === 1 && (
                            <li className="hover:text-gray-400">
                                <Link href="/admin">Admin</Link>
                            </li>
                        )}
                        {!session && (
                            <>
                                <li className="hover:text-gray-400">
                                    <Link href="/login" >Login</Link>
                                </li>
                                <li className="hover:text-gray-400">
                                    <Link href="/sign-up" >Register</Link>
                                </li>
                            </>
                        )}

                        {session && (
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
