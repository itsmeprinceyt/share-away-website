'use client';
import Link from 'next/link';
import PostCardProps from '../../types/PostCardProps';
import formatHeartCount from '../../utils/formatHeartCount';

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
    return (
        <li key={id} className="bg-pink-50 border border-pink-200 p-4 rounded-xl
        flex flex-col justify-center gap-5">
            <div className=" font-bold text-xl flex flex-col gap-2">
                {heading}
                <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 font-extralight">
                        {new Date(posted_at).toLocaleString()}
                    </p>
                    <Link href={`/profile/${uuid}`}>
                        <p className="text-sm text-pink-500">@{username}</p>
                    </Link>
                </div>
            </div>
            <p className="whitespace-pre-line font-extralight overflow-y-auto max-h-[500px] pink-scrollbar">{body}</p>

            <div className="flex items-start justify-start gap-5">
                <button
                    onClick={() => onToggleHeart(post_uuid, hasHearted)}
                >
                    <span className="bg-gradient-to-r
                        from-red-200 to-red-300 flex items-center
                        justify-center gap-2 rounded-md border border-red-400/50 w-[120px] h-[40px]
                        shadow-xl shadow-red-500/30 hover:scale-105 transition-all
                        duration-300">{hasHearted ? '❤️ ' : '🤍 '}<span className="text-red-500 text-shadow-md/30 text-shadow-red-500">
                        {formatHeartCount(heart_count)}
                    </span>
                    </span>
                    
                </button>

                <Link href={`/post/${post_uuid}`} className="text-blue-500">
                    <button
                        className="bg-gradient-to-r from-blue-200 to-blue-300
                        flex items-center justify-center rounded-md border border-blue-400/50 w-[120px]
                        h-[40px] shadow-xl shadow-blue-500/30 hover:scale-105
                        transition-all duration-300 text-xs">
                        View
                    </button>
                </Link>

                {(isAdmin || isOwner) && (
                    <>
                        <Link href={`/post/edit/${post_uuid}`} className="text-orange-500">
                            <button
                                className="bg-gradient-to-r from-orange-200 to-orange-300
                                flex items-center justify-center rounded-md border 
                                border-orange-400/50 w-[120px]
                                h-[40px] shadow-xl shadow-orange-500/30 hover:scale-105
                                transition-all duration-300 text-xs">
                                Edit
                            </button>
                        </Link>
                        <button
                            className="bg-gradient-to-r from-purple-200 to-purple-300
                            flex items-center justify-center rounded-md border
                            border-purple-400/50 w-[120px]
                            h-[40px] shadow-xl shadow-purple-500/30 hover:scale-105
                            transition-all duration-300 text-xs text-purple-500"
                            onClick={() => onDelete(post_uuid, 'ASK')}
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </li>
    );
};

export default PostCard;
