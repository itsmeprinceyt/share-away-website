'use client';
import Link from 'next/link';
import PostCardProps from '../../types/PostCardProps';
import formatHeartCount from '../../utils/formatHeartCount';
import { useState, useEffect, useRef } from 'react';
import LinkifyText from '../../utils/linkifyText';
import copyToClipboard from '../../utils/copyToClipboard';
import { useToast } from '../../hooks/useToast';
import { CopyType } from '../../types/CopyType';

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
    const { showToast, Toast } = useToast();

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

    const handleCopy = async (type: CopyType, uuid: string) => {
        const success = await copyToClipboard({ type, uuid });
        if (success) {
            showToast("Copied to clipboard", 2000);
        } else {
            showToast('Failed to copy URL!', 2000);
        }
    };

    return (
        <div key={id} className="bg-pink-50 border border-pink-200 p-4 rounded-xl
        flex flex-col justify-center gap-5 relative shadow-xl shadow-pink-500/20" ref={menuRef}>
            <Toast />
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
                        <li
                            onClick={() => {
                                handleCopy('post', post_uuid);
                                setMenuOpen(false);
                            }}
                            className="cursor-pointer hover:bg-pink-600/10 hover:border-l-[20px]
                            border-l-pink-600 hover:font-semibold p-1 px-2 rounded transition-all
                            duration-300 hover:shadow-lg shadow-pink-500/20 text-pink-500"
                        >
                            Share
                        </li>
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
                <div className=" font-bold text-xl flex flex-col gap-2 break-all">
                    <LinkifyText text={heading} />
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

            <p className="whitespace-pre-line font-extralight
            overflow-y-auto max-h-[500px] px-2 py-1 border border-r-0 border-pink-100
            rounded-tl-lg rounded-bl-lg rounded-tr-md rounded-br-md"><LinkifyText text={body} /></p>


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
