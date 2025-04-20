'use client';
import Link from 'next/link';
import PostCardProps from '../../types/PostCardProps';
import formatHeartCount from '../../utils/formatHeartCount';
import { useState, useEffect, useRef } from 'react';

const PostCard = ({
    id,
    post_uuid,
    uuid,
    username,
    heading,
    body,
    heart_count,
    hasHearted,
    posted_at,
    isAdmin,
    isOwner,
    onToggleHeart,
    onDelete
}: PostCardProps) => {
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
        <div key={id} className="bg-pink-50 border border-pink-200 p-4 rounded-xl
        flex flex-col justify-center gap-5 relative shadow-xl shadow-pink-500/20" ref={menuRef}>

            {menuOpen && (
                <div className="z-10 absolute top-12 right-6 mt-2 w-[120px]
                bg-white border border-pink-200 rounded-lg shadow-xl">
                    <ul className="flex flex-col text-sm m-2 gap-2">
                        <li className=" hover:bg-blue-600/10 hover:border-l-[20px] 
                        border-l-blue-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-blue-500/20 text-blue-500">
                            <Link href={`/post/${post_uuid}`}>
                                View
                            </Link>
                        </li>
                        {(isAdmin || isOwner) && (
                            <>
                                <li className=" hover:bg-orange-600/10 hover:border-l-[20px]
                                border-l-orange-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20 text-orange-500">
                                    <Link href={`/post/edit/${post_uuid}`}>
                                        Edit
                                    </Link>
                                </li>
                                <li className=" hover:bg-red-600/10 hover:border-l-[20px]
                                border-l-red-600 hover:font-semibold p-1 px-2 rounded transition-all duration-300 hover:shadow-lg shadow-red-500/20 text-red-500">
                                    <button
                                        onClick={() => onDelete(post_uuid, 'ASK')}>
                                        Delete
                                    </button>
                                </li>
                            </>
                        )}
                        {!(isAdmin || isOwner) && (
                            <li className="px-4 py-2 text-gray-400 italic">No options</li>
                        )}
                    </ul>
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className=" font-bold text-xl flex flex-col gap-2">
                    {heading}
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 font-extralight">
                            {new Date(posted_at).toLocaleString()}
                        </p>
                        <Link href={`/profile/${uuid}`}>
                            <p className="text-sm text-pink-500 font-normal hover:underline transition-all duration-300">@{username}</p>
                        </Link>
                    </div>
                </div>
                <button
                    onClick={() => setMenuOpen(prev => !prev)}
                    className="hover:scale-105 transition-all duration-300 p-2 font-bold"
                >
                    ⋮
                </button>
            </div>

            <p className="whitespace-pre-line font-extralight overflow-y-auto max-h-[500px] pink-scrollbar">{body}</p>


            <div className="flex items-start justify-start gap-5">
                <button
                    onClick={() => onToggleHeart(post_uuid, hasHearted)}
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

export default PostCard;
