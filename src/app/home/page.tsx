"use client";
import { useCheckSession } from '../../hooks/useCheckSession';
import Logout from '../(components)/Logout';

/**
 * @description     - Home page which will show all the posts of every users and we can,
 * go to their profile or give hearts to their posts and see their data and stuff.
 */
export default function Home(){
    const session = useCheckSession();

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-semibold animate-pulse bg-black text-white">
                Welcome to the Home Page. How are you {session?.user.username}</p>
                <Logout/>
        </div>
    );
}