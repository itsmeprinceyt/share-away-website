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
        if (showBell) setShowBell(!showBell);
        setShowHamburger(!showHamburger);
    }

    const handleBell = () => {
        if (showHamburger) setShowHamburger(!showHamburger);
        setShowBell(!showBell);
    }



    return (
        <div className="absolute top-0 min-w-screen p-5 px-6 flex justify-between items-center gap-5">

            <Link href="/home">
                <Image
                    className="w-[50px] h-[50px] hover:scale-110 transition-all duration-300"
                    src={'/logo/ShareAway5-png.png'}
                    alt="Home"
                    width={500}
                    height={500}
                />
            </Link>

            <div className="flex justify-between items-center gap-5">

                {(showBell) && (
                    <div className="absolute top-20 right-32 bg-white text-pink-600 shadow-xl
                    shadow-pink-500/20 w-48 rounded-lg">
                        {notifications.map((notif) => (
                            <div key={notif.post_uuid} className="hover:bg-pink-600/10 m-2 hover:border-l-[20px]  border-l-pink-600 p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
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
                    <>

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

                        {(session && notifications.length > 0) && (
                            <div className="relative mt-2 hover:scale-110
                            transition-all duration-300">
                                <button onClick={handleBell}>

                                    <div className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-[20px] h-[20px] flex justify-center items-center hover:scale-125
                            transition-all duration-300">
                                        {notifications.length > 9 ? `${notifications.length}+` : `${notifications.length}`}
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

                {(showHamburger) && (

                    <div className="absolute w-[120px] right-6 flex flex-col justify-start gap-2 text-pink-600 top-20 bg-white rounded-lg shadow-xl shadow-pink-500/20 p-2">
                        <Image
                        className="w-[200px] h-[25px] rounded shadow-md shadow-pink-500/20"
                        src={'/art/banner/banner2.png'}
                        width={500}
                        height={500}
                        alt="Navbar Image"
                    />

                        <ul className="flex flex-col gap-2">
                            <li className="hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20">
                                <Link href="/">Home</Link>
                            </li>

                            {session?.user?.isAdmin === 1 && (
                                <li className="hover:bg-orange-600/10 hover:border-l-[20px] border-l-orange-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20">
                                    <Link href="/admin">Admin</Link>
                                </li>
                            )}

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
