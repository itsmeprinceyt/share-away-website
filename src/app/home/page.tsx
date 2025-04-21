"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckSession } from '../../hooks/useCheckSession';
import Navbar from '../(components)/Navbar';
import getBaseUrl from '../../utils/getBaseUrl';
import Loading from '../(components)/Loading';
import NotFound from '../not-found';
import PageWrapperNormalTop from '../(components)/PageWrapperNormalTop';
import PostContentHome from '../../types/PostContentHome';
import PostCardHome from '../(components)/PostCardHome';
import Link from 'next/link';
import Image from 'next/image';

/**
 * @description     - Home page which will show all the posts of every users and we can,
 * go to their profile or give hearts to their posts and see their data and stuff.
 */
export default function Home() {
    const router = useRouter();
    const session = useCheckSession();
    const [posts, setPosts] = useState<PostContentHome[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);

    {/* Togglers */ }
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [settingToggleDialogue, setSettingToggleDialogue] = useState(false);

    {/* Loaders and 404 Pages */ }
    const [loading, setLoading] = useState(true);
    const [is404, setIs404] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const sessionData = sessionStorage.getItem('userSession') || localStorage.getItem('userSession');

                if (!sessionData) {
                    router.push('/');
                    return;
                }

                const parsed = JSON.parse(sessionData);
                const viewer_uuid = parsed?.user?.uuid;

                if (!viewer_uuid) {
                    router.push('/');
                    return;
                }

                if (parsed?.user?.isAdmin === 1) {
                    setIsAdmin(true);
                }

                const res = await fetch(`${getBaseUrl()}/post/get-posts?viewer_uuid=${viewer_uuid}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch posts, status: ${res.status}`);
                }

                const data = await res.json();
                setPosts(data.posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setIs404(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [router]);

    if (loading) return <Loading />;
    if (is404) return <NotFound />;

    const handlePostDelete = async (post_uuid: string, type: 'CONFIRM' | 'ASK') => {
        if (type === 'ASK') {
            setSettingToggleDialogue(true);
            setPostToDelete(post_uuid);
            setConfirmDeletePost(true);
            return;
        }

        if (type === 'CONFIRM') {
            setConfirmDeletePost(false);
            setSettingToggleDialogue(false);
            setPostToDelete(null);
        }

        const session = sessionStorage.getItem('userSession');
        if (!session) return;

        const { user } = JSON.parse(session);
        const res = await fetch(`${getBaseUrl()}/post/delete/${post_uuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: user.uuid,
                isAdmin: user.isAdmin
            }),
        });

        if (res.ok) {
            router.push(`/profile`);
        } else {
            console.error('❌ Failed to delete post');
        }
    };

    const toggleHeart = async (post_uuid: string, currentHasHearted: boolean) => {
        if (!session) {
            router.push('/login');
            return;
        }
        const method = currentHasHearted ? 'DELETE' : 'POST';
        const url =
            method === 'POST'
                ? `${getBaseUrl()}/heart`
                : `${getBaseUrl()}/heart?uuid=${session?.user.uuid}&post_uuid=${post_uuid}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(method === 'POST' && {
                    body: JSON.stringify({ uuid: session.user.uuid, post_uuid }),
                }),
            });

            if (res.ok) {
                setPosts(prev =>
                    prev.map(post =>
                        post.post_uuid === post_uuid
                            ? {
                                ...post,
                                hasHearted: !currentHasHearted,
                                heart_count: currentHasHearted
                                    ? post.heart_count - 1
                                    : post.heart_count + 1
                            }
                            : post
                    )
                );
            } else {
                console.error('❌ Failed to update heart status');
            }
        } catch (error) {
            console.error('❌ Error toggling heart:', error);
        }
    };

    const handleResetPrompts = () => {
        setConfirmDeletePost(false);
        setPostToDelete(null);
        setSettingToggleDialogue(false);
    }

    const handleSettingDialogue = () => {
        setSettingToggleDialogue(!settingToggleDialogue)
    }

    return (
        <PageWrapperNormalTop>
            <Navbar />

            {/* Setting Dialogue Open */}
            {settingToggleDialogue && (
                <div className="z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex justify-center items-center">
                    {/* Setting Dialogue Open Container*/}
                    <div className="bg-white relative rounded-lg shadow-xl shadow-pink-500/30 border
                                border-pink-300 flex flex-col gap-7 p-7 w-[300px]">

                        {/* Setting Dialogue close */}
                        <button onClick={handleSettingDialogue}
                            className="absolute top-2 right-2 w-[12px] hover:scale-110 transition-all duration-300">
                            <Image
                                className="z-2 drop-shadow-[0_4px_6px_rgba(236,72,153,0.5)]"
                                src={'/icons/cross.png'}
                                width={50}
                                height={50}
                                alt="Settings"
                            />
                        </button>

                        {/* Confirm Post Delete */}
                        {confirmDeletePost && postToDelete && (
                            <div className="mt-5 text-center flex flex-col gap-5">
                                <p className="text-red-500 font-extralight text-shadow-md text-shadow-red-500/20">
                                    Are you sure you want to delete this post?</p>
                                <div className="flex gap-5 items-center justify-center">
                                    <button
                                        onClick={() => handlePostDelete(postToDelete, 'CONFIRM')}
                                        className="bg-gradient-to-r from-red-500 to-red-400
                                                        text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                                        py-2 border border-red-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 font-extralight">
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleResetPrompts();
                                            setSettingToggleDialogue(false);
                                        }}
                                        className="bg-gradient-to-r from-gray-500 to-gray-400
                                                        text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                                        py-2 border border-gray-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-500/30 hover:shadow-gray-500/50 font-extralight">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Setting Dialogue Banner */}
                        <div>
                            <Image
                                className="rounded-lg shadow-xl shadow-purple-500/20"
                                src={'/art/banner/banner4.png'}
                                height={500}
                                width={800}
                                alt="Setting dialogue banner"
                            />
                        </div>

                    </div>

                </div>
            )}

            {/* ======================================================== */}
            {/* MAIN PAGE CONTAINER */}
            {/* ======================================================== */}
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 m-10
            mt-24 mb-24 flex flex-col gap-12 text-center">
                {/* Message */}
                <div className="border border-pink-300/20 py-10 shadow-xl shadow-pink-500/10
                rounded-lg -tracking-tighter text-center text-md font-semibold p-2 text-pink-950 ">
                    Welcome back @{session?.user.username}<br />
                    Do you have anything in your mind?&nbsp;
                    <Link
                        href="/post"
                        className="inline-block bg-pink-600/20
                        rounded-md px-2 text-pink-600 border border-pink-300
                        hover:border-pink-400 shadow-xl shadow-pink-500/20
                        hover:scale-105 hover:shadow-pink-500/40 transition-all
                        duration-500 animate-pulse hover:animate-none">
                        Share Away 🩷...
                    </Link>
                </div>
                {/* All posts */}
                <ul className="flex flex-col gap-10 text-start">
                    {posts.map((post) => {
                        const parsedContent = typeof post.content === 'string' ? JSON.parse(post.content) : post.content;
                        return (
                            <li key={post.post_uuid}>
                                <PostCardHome
                                    post_uuid={post.post_uuid}
                                    user_uuid={post.user_uuid}
                                    uuid={post.user_uuid}
                                    username={post.username}
                                    pfp={post.pfp}
                                    content={parsedContent}
                                    heart_count={post.heart_count}
                                    posted_at={post.posted_at}
                                    isAdmin={isAdmin}
                                    isOwner={session?.user.uuid === post.user_uuid}
                                    hasHearted={post.hasHearted}
                                    onToggleHeart={toggleHeart}
                                    onDelete={handlePostDelete}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </PageWrapperNormalTop>
    );
}