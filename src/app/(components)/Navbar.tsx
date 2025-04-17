'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCheckSession } from '../../hooks/useCheckSession';
import { useState, useEffect, useCallback, useRef } from 'react';
import getBaseUrl from '../../utils/getBaseUrl';
import HeartNotification from '../../types/HeartNotification';

export default function Navbar() {
    const router = useRouter();
    const session = useCheckSession();
    const [notifications, setNotifications] = useState<HeartNotification[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 5;
    const [showBell, setShowBell] = useState(false);
    const [showHamburger, setShowHamburger] = useState(false);

    const fetchNotifications = useCallback(async (currentOffset: number) => {
        if (!session?.user?.uuid) return;
        try {
            const response = await fetch(
                `${getBaseUrl()}/notifications/heart?uuid=${session.user.uuid}&offset=${currentOffset}&limit=${limit}`
            );
            const data = await response.json();
            setNotifications(prev => [...prev, ...(data.notifications || [])]);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [session, limit]);

    const hasFetched = useRef(false);

    useEffect(() => {
        if (session?.user?.uuid && !hasFetched.current) {
            fetchNotifications(0);
            hasFetched.current = true;
        }
    }, [fetchNotifications, session?.user?.uuid]);

    const handleLoadMore = () => {
        const newOffset = offset + limit;
        setOffset(newOffset);
        fetchNotifications(newOffset);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('userSession');
            localStorage.removeItem('userSession');
        }
        router.push('/');
    };

    const handleHamburger = () => {
        if (showBell) setShowBell(!showBell);
        setShowHamburger(!showHamburger);
    }

    const handleBell = () => {
        if (showHamburger) setShowHamburger(!showHamburger);
        setShowBell(!showBell);
    }



    return (
        <div className="absolute top-0 min-w-screen p-5 px-6 flex justify-between items-center gap-5">
            {/* Home Button */}
            <Link href="/home">
                <Image
                    className="w-[50px] h-[50px] hover:scale-110 transition-all duration-300"
                    src={'/logo/ShareAway5-png.png'}
                    alt="Home"
                    width={500}
                    height={500}
                />
            </Link>

            {/* Right Corner Div */}
            <div className="flex justify-between items-center gap-5">

                {/* Notification Window */}
                {(showBell) && (
                    <div className="absolute top-20 max-[350px]:right-12 right-32 bg-white text-pink-600 shadow-xl shadow-pink-500/20 w-48 overflow-y-auto h-[200px] rounded-lg flex flex-col items-center
                    pink-scrollbar">
                        {/* Notification Image */}
                        <Image
                            className="rounded-tl shadow-md shadow-pink-500/20"
                            src={'/art/banner/banner3.png'}
                            width={500}
                            height={500}
                            alt="Notification Image"
                        />
                        {/* Notification Mapping */}
                        {notifications.map((notif, index) => (
                            <div key={`${notif.post_uuid}-${notif.liker_username}-${index}`} className="hover:bg-pink-600/10 mr-2 ml-2 mt-2 hover:border-l-[20px]  border-l-pink-600
                            p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                <Link href={`/post/${notif.post_uuid}`}>
                                    <span>
                                        <strong>@{notif.liker_username}</strong> liked your post.
                                    </span>
                                </Link>
                            </div>
                        ))}
                        {/* Notification - Load more Button */}
                        <button
                            onClick={handleLoadMore}
                            className="mb-2 mt-2 px-4 py-2 text-xs shadow-xl shadow-pink-500/20 hover:scale-105 transition-all duration-300 bg-pink-500 text-white rounded-lg"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {/* If logged in: */}
                {session && (
                    <>
                        {/* Post Button */}
                        <button className="hover:text-gray-400">
                            <Link href="/post">
                                <Image
                                    className="w-[25px] h-[25px] hover:scale-110 transition-all duration-300"
                                    src={'/icons/post-icon-new.png'}
                                    alt="Post"
                                    width={500}
                                    height={500}
                                />
                            </Link>
                        </button>

                        {/* Bell Div: if notifications are present */}
                        {(session && notifications.length > 0) && (

                            <div className="relative mt-2 hover:scale-110
                            transition-all duration-300">
                                <button onClick={handleBell}>

                                    <div className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-[20px] h-[20px] flex justify-center items-center hover:scale-125 transition-all duration-300">
                                        {notifications.length > 9 ? `9+` : `${notifications.length}`}
                                    </div>

                                    <Image
                                        className="w-[22px] h-[22px]"
                                        src={'/icons/bell-pink.png'}
                                        alt="Bell"
                                        width={500}
                                        height={500}
                                    />

                                </button>

                            </div>
                        )}
                        {/* Profile: User pfp & default pfp */}
                        <div>
                            <Link href="/profile">
                                {session.user.pfp ? (
                                    <Image
                                        src={session.user.pfp}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className="border-white border-2 rounded-full
                                        hover:scale-110 transition-all duration-300"
                                    />
                                ) : (
                                    <Image
                                        src={'/avatar/DefaultAvatar.png'}
                                        alt="Default Profile"
                                        width={32}
                                        height={32}
                                        className="border-white border-2 rounded-full
                                        hover:scale-110 transition-all duration-300"
                                    />
                                )}
                            </Link>
                        </div>
                    </>

                )}
                {/* Hamburger */}
                <button
                    onClick={handleHamburger}
                >
                    <Image
                        className={`w-[35px] h-[35px] transform transition-transform duration-300
                            ${showHamburger ? '-rotate-90' : 'rotate-0'} hover:scale-110 transition-all duration-300`}
                        src={'/icons/Hamburger-big.png'}
                        width={500}
                        height={500}
                        alt="Hamburger"
                    />
                </button>
                {/* Hamburger open */}
                {(showHamburger) && (
                    
                    <div className="absolute w-[120px] right-6 flex flex-col justify-start text-pink-600 top-20 bg-white rounded-lg shadow-xl shadow-pink-500/20">
                        {/* Image */}
                        <Image
                            className="rounded-tr rounded-tl shadow-md shadow-pink-500/20"
                            src={'/art/banner/banner2.png'}
                            width={500}
                            height={500}
                            alt="Navbar Image"
                        />
                        {/* Button lists */}
                        <ul className="flex flex-col m-2 gap-2">
                            {/* Home */}
                            <li className=" hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                <Link href="/">Home</Link>
                            </li>
                            {/* Admin */}
                            {session?.user?.isAdmin === 1 && (
                                <li className="hover:bg-orange-600/10 hover:border-l-[20px] border-l-orange-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20">
                                    <Link href="/admin">Admin</Link>
                                </li>
                            )}
                            {/* Login & Sign up if no session */}
                            {!session && (
                                <>
                                    <li className="hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                        <Link href="/login" >Login</Link>
                                    </li>
                                    <li className="hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                        <Link href="/sign-up" >Sign up</Link>
                                    </li>
                                </>
                            )}
                            {/* Logout button if session exists */}
                            {session && (
                                <li className="hover:bg-red-600/10 hover:border-l-[20px] border-l-red-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-red-500/20">
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            )}

                        </ul>

                    </div>

                )}

            </div>
        </div>
    );
}
