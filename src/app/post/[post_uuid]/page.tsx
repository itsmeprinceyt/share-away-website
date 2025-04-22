"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';
import getBaseUrl from '../../../utils/getBaseUrl';
import Loading from '../../(components)/Loading';
import NotFound from '../../not-found';
import PageWrapperNormalTop from '../../(components)/PageWrapperNormalTop';
import Image from 'next/image';
import PostCardHomeSinglePost from '../../(components)/PostCardHomeSinglePost';
import PostContentHome from '../../../types/PostContentHome';

export default function Post() {
    const router = useRouter();
    const params = useParams();
    const post_uuid = params?.post_uuid as string;

    const [postData, setPostData] = useState<PostContentHome | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    {/* Togglers */ }
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [settingToggleDialogue, setSettingToggleDialogue] = useState(false);

    const [loading, setLoading] = useState(true);
    const [is404, setIs404] = useState(false);

    const session = useCheckSession();

    useEffect(() => {
        if (!post_uuid) return;

        setIsAdmin(session?.user.isAdmin === 1);
        setLoading(true);

        fetch(`${getBaseUrl()}/post/${post_uuid}?uuid=${session?.user.uuid}`)
            .then((res) => {
                if (!res.ok) {
                    setIs404(true);
                }
                return res.json();
            })
            .then((data) => {
                if (data && data.post) {
                    setPostData(data.post);
                    if (postData?.user_uuid === session?.user.uuid) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false);
                    }
                }
            })
            .catch((error) => {
                console.error('Failed to fetch post:', error);
                router.push('/404');
            }).finally(() => {
                setLoading(false);
            });
    }, [router, postData?.user_uuid, session , post_uuid]);

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

        const { token, user } = JSON.parse(session);
        const res = await fetch(`${getBaseUrl()}/post/delete/${post_uuid}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: user.uuid,
                isAdmin: user.isAdmin
            }),
        });

        if (res.ok) {
            router.push(`/home`);
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
        const userSessionToken = sessionStorage.getItem('userSession');
        const { token } = JSON.parse(userSessionToken!);
        const url =
            method === 'POST'
                ? `${getBaseUrl()}/heart`
                : `${getBaseUrl()}/heart?uuid=${session?.user.uuid}&post_uuid=${post_uuid}`;

        try {
            
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                ...(method === 'POST' && {
                    body: JSON.stringify({ uuid: session.user.uuid, post_uuid }),
                }),
            });

            if (res.ok) {
                setPostData(prev => {
                    if (!prev) return prev;
                
                    if (prev.post_uuid === post_uuid) {
                        return {
                            ...prev,
                            hasHearted: !currentHasHearted,
                            heart_count: currentHasHearted
                                ? prev.heart_count - 1
                                : prev.heart_count + 1
                        };
                    }
                
                    return prev;
                });
                
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
                {/* All posts */}
                {postData && (
                    <ul className="flex flex-col gap-10 text-start">
                        <li key={postData.post_uuid}>
                            <PostCardHomeSinglePost
                                post_uuid={postData.post_uuid}
                                user_uuid={postData.uuid}
                                uuid={postData.uuid}
                                username={postData.username}
                                pfp={postData.pfp}
                                content={postData.content}
                                heart_count={postData.heart_count}
                                posted_at={postData.posted_at}
                                isAdmin={isAdmin}
                                isOwner={isOwner}
                                hasHearted={postData.hasHearted}
                                onToggleHeart={toggleHeart}
                                onDelete={handlePostDelete}
                            />
                        </li>
                    </ul>)}
            </div>

        </PageWrapperNormalTop>
    );
}
