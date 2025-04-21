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
    const menuRef = useRef<HTMLDivElement>(null);
    const menuRef2 = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowHamburger(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef2.current && !menuRef2.current.contains(event.target as Node)) {
                setShowBell(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
        <div className="z-50 absolute top-0 min-w-full" ref={menuRef}>
            {/* Home Button */}
            <Link
                className="absolute top-5 left-5"
                href="/home" >
                <Image
                    className="w-[50px] h-[50px] hover:scale-110 transition-all duration-300"
                    src={'/logo/ShareAway5-png.png'}
                    alt="Home"
                    width={500}
                    height={500}
                />
            </Link>

            {/* Right Corner Div */}
            <div className="absolute top-5 right-5 flex justify-between items-center gap-5">

                {/* Notification Window */}
                {(showBell) && (
                    <div className="absolute top-20 max-[350px]:right-12 right-32 bg-white text-pink-600 shadow-xl shadow-pink-500/20 w-48 overflow-y-auto h-[200px] rounded-lg flex flex-col items-center" ref={menuRef2}>
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
                            <div key={index}>
                                <Link href={`/post/${notif.post_uuid}`}>
                                    <div key={`${notif.post_uuid}-${notif.liker_username}-${index}`} className="hover:bg-pink-600/10 mr-2 ml-2 mt-2 hover:border-l-[20px]  border-l-pink-600 p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                        <span>
                                            <strong>@{notif.liker_username}</strong> liked your post.
                                        </span>
                                    </div></Link>
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
                        <Link href="/post">
                            <button className="hover:text-gray-400">
                                <Image
                                    className="w-[25px] h-[25px] hover:scale-110 transition-all duration-300"
                                    src={'/icons/post-icon-new.png'}
                                    alt="Post"
                                    width={500}
                                    height={500}
                                />
                            </button>
                        </Link>

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
                            <Link href="/">
                                <li className=" hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                    Home
                                </li>
                            </Link>
                            {/* Admin */}
                            {session?.user?.isAdmin === 1 && (
                                <Link href="/admin">
                                    <li className="hover:bg-orange-600/10 hover:border-l-[20px] text-orange-600 border-l-orange-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20">
                                        Admin
                                    </li>
                                </Link>
                            )}
                            {/* Login & Sign up if no session */}
                            {!session && (
                                <>
                                    <Link href="/login">
                                        <li className="hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                            Login
                                        </li>
                                    </Link>
                                    <Link href="/sign-up">
                                        <li className="hover:bg-purple-600/10 hover:border-l-[20px] text-purple-600 border-l-purple-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-purple-500/20">
                                            Sign up
                                        </li>
                                    </Link>
                                </>
                            )}
                            {/* Logout button if session exists */}
                            {session && (
                                <li
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:bg-red-600/10 hover:border-l-[20px] text-red-600 border-l-red-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-red-500/20"
                                >
                                    Logout
                                </li>
                            )}

                        </ul>

                    </div>

                )}

            </div>
        </div>
    );
}
