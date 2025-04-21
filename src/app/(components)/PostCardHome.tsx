'use client';
import Image from 'next/image';
import Link from 'next/link';
import PostContentHome from '../../types/PostContentHome';
import formatHeartCount from '../../utils/formatHeartCount';
import { useState, useEffect, useRef } from 'react';

const PostCardHome = ({
    post_uuid,
    user_uuid,
    username,
    pfp,
    content,
    heart_count,
    hasHearted,
    posted_at,
    isAdmin,
    isOwner,
    onToggleHeart,
    onDelete
}: PostContentHome) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl
        flex flex-col justify-center gap-5 relative shadow-xl shadow-pink-500/20" ref={menuRef}>

            {menuOpen && (
                <div className="z-10 absolute top-12 right-6 mt-2 w-[120px]
                bg-white border border-pink-200 rounded-lg shadow-xl">
                    <ul className="flex flex-col text-sm m-2 gap-2">
                        <Link href={`/post/${post_uuid}`}>
                            <li className=" hover:bg-blue-600/10 hover:border-l-[20px] 
                        border-l-blue-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-blue-500/20 text-blue-500">
                                View
                            </li>
                        </Link>
                        {(isAdmin || isOwner) && (
                            <>
                                <Link href={`/post/edit/${post_uuid}`}>
                                    <li className=" hover:bg-orange-600/10 hover:border-l-[20px]
                                border-l-orange-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20 text-orange-500">
                                        Edit
                                    </li>
                                </Link>
                                <div onClick={() => onDelete(post_uuid, 'ASK')}>
                                    <li className=" hover:bg-red-600/10 hover:border-l-[20px]
                                border-l-red-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-red-500/20 text-red-500">
                                        Delete
                                    </li>
                                </div>
                            </>
                        )}
                    </ul>
                </div>
            )}

            <div className="flex justify-between items-start">

                <div className="font-bold flex justify-center items-start gap-2 text-xl">

                    <Image
                        className="rounded-full m-2"
                        src={pfp}
                        width={35}
                        height={35}
                        alt="Post owner pfp"
                    />
                    <div>
                        <div>{content.heading}</div>

                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-500 font-extralight">
                                {new Date(posted_at).toLocaleString()}
                            </p>
                            <Link href={`/profile/${user_uuid}`}>
                                <p className="text-sm text-pink-500 font-normal hover:underline transition-all duration-300">@{username}</p>
                            </Link>
                        </div>

                    </div>

                </div>

                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="hover:scale-105 transition-all duration-300 p-2 font-bold"
                >
                    ⋮
                </button>
            </div>

            <p className="whitespace-pre-line font-extralight
            overflow-y-auto max-h-[500px] px-2 py-1  border border-r-0 border-pink-100
            rounded-tl-lg rounded-bl-lg rounded-tr-md rounded-br-md">{content.body}</p>


            <div className="flex items-start justify-start gap-5">
                <button onClick={() => onToggleHeart(post_uuid, hasHearted)}
                >
                    <span className="bg-gradient-to-r
                        from-red-200 to-red-300 flex items-center
                        justify-center gap-2 rounded-md border border-red-400/50 w-[120px] h-[40px]
                        shadow-xl shadow-red-500/10 hover:scale-105 transition-all
                        duration-300">{hasHearted ? '❤️ ' : '🤍 '}<span className="text-red-500 text-shadow-md/30
                        text-shadow-red-500">
                            {formatHeartCount(heart_count)}
                        </span>
                    </span>

                </button>

            </div>

        </div>

    );
};

export default PostCardHome;
