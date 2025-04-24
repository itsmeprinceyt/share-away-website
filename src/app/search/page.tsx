"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../(components)/Navbar';
import { useCheckSession } from '../../hooks/useCheckSession';
import getBaseUrl from '../../utils/getBaseUrl';
import PageWrapperNormal_Top from '../(components)/PageWrapperNormalTop';
import { SearchUser } from '../../types/SearchUser';
import { SearchPost } from '../../types/PostSearch';
import Link from 'next/link';
import Image from 'next/image';
import defaultProfilePic from '../../utils/defaultAvatar';
import LinkifyText from '../../utils/linkifyText';
import copyToClipboard from '../../utils/copyToClipboard';
import { useToast } from '../../hooks/useToast';
import { CopyType } from '../../types/CopyType';

export default function PostCreate() {
    const router = useRouter();

    const [searchContent, setSearchContent] = useState('');
    const [searchMethod, setSearchMethod] = useState<'username' | 'email' | 'posts'>('username');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [postResults, setPostResults] = useState<SearchPost[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const [activePost, setActivePost] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const { showToast, Toast } = useToast();

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActivePost(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (postUuid: string) => {
        setActivePost(prev => (prev === postUuid ? null : postUuid));
    };

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
            console.log(data);
            if (searchMethod === 'posts') {
                setPostResults(data);
            } else {
                setResults(data);
            }
            setHasSearched(true);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (type: CopyType, uuid: string) => {
        const success = await copyToClipboard({ type, uuid });
        if (success) {
            showToast("Copied to clipboard", 2000);
        } else {
            showToast('Failed to copy URL!', 2000);
        }
        setActivePost(null);
    };

    const handleSearchmethodChange = (searchMethod: string) => {
        switch (searchMethod) {
            case 'email':
                setResults([]);
                setPostResults([]);
                setSearchMethod('email');
                setHasSearched(false);
                break;
            case 'username':
                setResults([]);
                setPostResults([]);
                setSearchMethod('username');
                setHasSearched(false);
                break;
            case 'posts':
                setResults([]);
                setPostResults([]);
                setSearchMethod('posts');
                setHasSearched(false);
                break;
        }
    };

    return (
        <PageWrapperNormal_Top>
            <Navbar />
            <Toast />
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
                                value="posts"
                                checked={searchMethod === 'posts'}
                                onChange={() => handleSearchmethodChange('posts')}
                                className="w-4 h-4 accent-pink-500 
                            rounded transition"
                            />
                            Post Title
                        </label>
                        <label className="text-pink-500 font-medium flex justify-center items-center gap-1">
                            <input
                                type="radio"
                                value="username"
                                checked={searchMethod === 'username'}
                                onChange={() => handleSearchmethodChange('username')}
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
                                onChange={() => handleSearchmethodChange('email')}
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
                    {!hasSearched ? null : searchMethod === 'posts' ? (
                        postResults.length === 0 ? (
                            <p className="text-sm text-pink-400 italic">No results found.</p>
                        ) : (
                            postResults.map((post, index) => {
                                const { heading, body } = JSON.parse(post.content);
                                return (
                                    <div
                                        key={index}
                                        ref={menuRef}
                                        className="bg-white w-full border border-purple-200 rounded-xl p-3 text-left shadow-md hover:scale-105 transition-all duration-300 flex flex-col
                                        gap-2 relative"
                                    >

                                        {activePost === post.post_uuid && (
                                            <div className="z-10 absolute top-12 right-6 mt-2 w-[120px] 
                                            bg-white border border-pink-200 rounded-lg shadow-xl">
                                                <ul className="flex flex-col text-sm m-2 gap-2">
                                                    <Link href={`/post/${post.post_uuid}`}>
                                                        <li className=" hover:bg-blue-600/10 hover:border-l-[20px] border-l-blue-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-blue-500/20 text-blue-500">
                                                            View
                                                        </li>
                                                    </Link>
                                                    <li
                                                        onClick={() => {
                                                            handleCopy('post', post.post_uuid);
                                                        }}
                                                        className="cursor-pointer hover:bg-pink-600/10 hover:border-l-[20px] border-l-pink-600 hover:font-semibold
                                                        p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-pink-500/20 text-pink-500"
                                                    >
                                                        Share
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                        <div className=" font-bold flex flex-col gap-2">
                                            <div className="flex justify-between relative">
                                                <div className="font-bold
                                                flex justify-center items-start gap-2 text-xl">
                                                    <Image
                                                        className="rounded-full m-2"
                                                        src={post.pfp || defaultProfilePic}
                                                        width={35}
                                                        height={35}
                                                        alt="Post owner pfp"
                                                    />
                                                    <div>
                                                        <LinkifyText text={heading} />
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs text-gray-500 font-extralight">
                                                                {new Date(post.posted_at).toLocaleString()}
                                                            </p>
                                                            <Link href={`/profile/${post.uuid}`}>
                                                                <p className="text-sm text-pink-500 font-normal hover:underline transition-all duration-300">@{post.username}</p>
                                                            </Link>
                                                        </div>

                                                    </div>

                                                </div>

                                                <button
                                                    onClick={() => toggleMenu(post.post_uuid)}
                                                    className="hover:scale-105 transition-all duration-300 p-2 font-bold"
                                                >
                                                    ⋮
                                                </button>
                                            </div>


                                        </div>
                                        <p className=" whitespace-pre-line font-extralight w-full overflow-y-auto
                                            max-h-[500px] px-2 py-1  border border-r-0 border-pink-100
                                            rounded-tl-lg rounded-bl-lg rounded-tr-md rounded-br-md">
                                            <LinkifyText text={body} />
                                        </p>
                                        <div className="text-xs text-red-500 text-shadow-red-500 text-shadow-md/20">
                                            ❤️ {post.heart_count ?? 0}
                                        </div>

                                    </div>
                                );
                            }))

                    ) : (
                        results.length === 0 ? (
                            <p className="text-sm text-pink-400 italic">No results found.</p>
                        ) : (
                            results.map((user, index) => (
                                <Link
                                    key={index}
                                    href={`/profile/${user.uuid}`}
                                    className="w-full block border border-pink-200 rounded-md p-3 text-left shadow-md bg-white hover:scale-105 transition-all duration-300"
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
                        )
                    )}
                </div>


            </div>
        </PageWrapperNormal_Top>
    );
}
