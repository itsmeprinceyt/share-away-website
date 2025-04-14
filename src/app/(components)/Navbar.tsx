'use client';
import Link from 'next/link';
import Image from 'next/image';
import Logout from './Logout';
import { useCheckSession } from '@/hooks/useCheckSession';

export default function Navbar() {
    const session = useCheckSession();
    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <div className="text-white text-lg font-bold">ShareAway</div>

            <ul className="flex space-x-4 items-center">
                <li>
                    <Link href="/" className="text-white hover:text-gray-400">Home</Link>
                </li>

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
