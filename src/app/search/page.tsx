"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../(components)/Navbar';
import { useCheckSession } from '../../hooks/useCheckSession';
import getBaseUrl from '../../utils/getBaseUrl';
import PageWrapperNormal_Top from '../(components)/PageWrapperNormalTop';
import { SearchUser } from '../../types/SearchUser';
import Link from 'next/link';
import Image from 'next/image';
import defaultProfilePic from '../../utils/defaultAvatar';

export default function PostCreate() {
    const router = useRouter();

    const [searchContent, setSearchContent] = useState('');
    const [searchMethod, setSearchMethod] = useState<'username' | 'email'>('username');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const [loading, setLoading] = useState(false);
    useCheckSession();

    useEffect(() => {
        const savedSearchContent = localStorage.getItem('searchContent');
        if (savedSearchContent) {
            setSearchContent(savedSearchContent);
        }

        let sessionData = sessionStorage.getItem('userSession');
        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) sessionStorage.setItem('userSession', sessionData);
        }

        if (!sessionData) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (searchContent) {
            localStorage.setItem('searchContent', searchContent);
        }
    }, [searchContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userSessionToken = sessionStorage.getItem('userSession');
            const { token } = JSON.parse(userSessionToken!);
            const res = await fetch(`${getBaseUrl()}/user/search-users?method=${searchMethod}&query=${searchContent}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await res.json();
            setResults(data);
            setHasSearched(true);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapperNormal_Top>
            <Navbar />
            {/* Main Container */}
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 m-10
            mt-24 mb-24 flex flex-col gap-12 text-center">
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
                    <div className="text-center max-[550px]:text-3xl
                    max-[350px]:text-xl text-4xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-pink-500">Search</div>
                    {/* Input field */}
                    <input
                        type="text"
                        placeholder="Title"
                        value={searchContent}
                        onChange={(e) => setSearchContent(e.target.value)}
                        required
                        className="bg-white border border-white font-extralight
                        focus:border-pink-500 focus:outline-none text-pink-500 p-2
                        rounded-lg mb-4 max-[350px]:mb-2 w-[400px] max-[550px]:w-full"
                    />
                    {/* Radio Buttons */}
                    <div className="flex gap-5 justify-center items-center">
                        <label className="text-pink-500 font-medium flex justify-center items-center gap-1">
                            <input
                                type="radio"
                                value="username"
                                checked={searchMethod === 'username'}
                                onChange={() => setSearchMethod('username')}
                                className="w-4 h-4 accent-pink-500 
                            rounded transition"
                            />
                            Username
                        </label>
                        <label className="text-pink-500 font-medium flex justify-center items-center gap-1">
                            <input
                                type="radio"
                                value="email"
                                checked={searchMethod === 'email'}
                                onChange={() => setSearchMethod('email')}
                                className="w-4 h-4 accent-pink-500 
                            rounded transition"
                            />
                            Email
                        </label>
                    </div>
                    {/* Search button */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg
                        w-[150px] max-[550px]:w-[200px] py-2 border border-pink-500 hover:scale-105
                        transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight disabled:opacity-50">
                        Search
                    </button>
                </form>
                {/* Result container */}
                <div className="w-full flex flex-col items-center gap-3">
                    {!hasSearched ? null : results.length === 0 ? (
                        <p className="text-sm text-pink-400 italic">No results found.</p>
                    ) : (
                        results.map((user, index) => (
                            <Link
                                key={index}
                                href={`/profile/${user.uuid}`}
                                className="w-full block border border-pink-200 rounded-md p-3 text-left shadow-md bg-white hover:scale-105 transition"
                            >
                                <div className="flex justify-between p-2">
                                    <div className="flex items-start gap-5">
                                        {/* Profile Picture */}
                                        <Image
                                            className="border-2 border-white rounded-full shadow-xl shadow-pink-500/30"
                                            src={user.pfp || defaultProfilePic}
                                            alt="Profile"
                                            width={60}
                                            height={60}
                                        />

                                        {/* Profile Meta Data */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-shadow-black/20 text-shadow-md text-xl font-semibold">
                                                @{user.username}
                                            </div>

                                            <div className="text-[10px] text-gray-500 text-shadow-gray-500 text-shadow-md/20">
                                                Registered on: {new Date(user.registeredDate).toLocaleDateString()}
                                            </div>

                                            <div className="text-xs text-purple-500 text-shadow-purple-500 text-shadow-md/20">
                                                Total Posts: {user.totalPosts ?? 0}
                                            </div>

                                            <div className="text-xs text-red-500 text-shadow-red-500 text-shadow-md/20">
                                                ❤️ {user.totalHearts ?? 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>


            </div>
        </PageWrapperNormal_Top>
    );
}
