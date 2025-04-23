"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../(components)/Navbar';
import { useCheckSession } from '../../../../hooks/useCheckSession';
import getBaseUrl from '../../../../utils/getBaseUrl';
import Loading from '../../../(components)/Loading';
import PostContent from '../../../../types/PostContent';
import PageWrapperNormal_Top from '../../../(components)/PageWrapperNormalTop';

export default function PostEdit() {
    const router = useRouter();
    const params = useParams();
    const post_uuid = params?.post_uuid as string;

    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [postData, setPostData] = useState<PostContent | null>(null);
    const [loading, setLoading] = useState(true);
    const session = useCheckSession();


    useEffect(() => {
        if (!post_uuid || !session) return;
        setLoading(true);
        const fetchPost = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/post/${post_uuid}`);
                if (!res.ok) throw new Error('Post not found');

                const data = await res.json();
                if (data?.post) {
                    setPostData(data.post);
                    setHeading(data.post.content.heading);
                    setBody(data.post.content.body);
                }
            } catch (err) {
                console.error('Failed to fetch post:', err);
                router.push('/404');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [router, post_uuid, session]);

    useEffect(() => {
        if (!postData || !session) return;

        const owner = postData.uuid === session.user.uuid;
        const admin = session.user.isAdmin === 1;

        if (!owner && !admin) {
            router.replace(`/post/${post_uuid}`);
        }
    }, [router, postData, session, post_uuid]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [body]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;
        setLoading(true);
        const content = {
            heading,
            body
        };
        const userSessionToken = sessionStorage.getItem('userSession');
        const { token } = JSON.parse(userSessionToken!);
        const res = await fetch(`${getBaseUrl()}/post/edit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: session.user.uuid,
                username: session.user.username,
                user_id: session.user.id,
                post_uuid: post_uuid,
                content,
            }),
        });

        if (res.ok) {
            router.push(`/post/${post_uuid}`);
        } else {
            console.error('Failed to edit post');
            setLoading(false);
        }
    };

    if (loading) return <Loading />
    return (
        <PageWrapperNormal_Top>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 m-10
            mt-24 mb-24 flex flex-col gap-12 text-center">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
                    <div className="text-center max-[550px]:text-3xl
                    max-[350px]:text-xl text-4xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-pink-500">Edit Post</div>

                    {/* Title input */}
                    <div className="relative">
                        <input
                            type="text"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            required
                            className="bg-white border border-white font-semibold
                        focus:border-pink-500 focus:outline-none text-pink-500 p-2
                        rounded-lg mb-4 max-[350px]:mb-2 w-[400px] max-[550px]:w-full"
                        />
                        <p className="absolute bottom-0 left-2 text-[8px] text-gray-500 text-right pointer-events-none">{heading.length} / 100</p>
                    </div>

                    {/* Body input */}
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            placeholder="Write something..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className="bg-white border border-white border-r-0 focus:border-pink-500 focus:outline-none
                        text-pink-500 p-2 rounded-lg mb-4 max-[350px]:mb-2 w-[400px] max-[550px]:w-full
                        font-extralight resize-none overflow-y-auto"
                            style={{
                                minHeight: '50px',
                                maxHeight: '50vh',
                                overflowY: 'auto',
                            }}
                        />
                        <p className="absolute bottom-2 left-2 text-[8px] text-gray-500 text-right pointer-events-none">{body.length} / 5000</p>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg
                        w-[150px] max-[550px]:w-[200px] py-2 border border-pink-500 hover:scale-105
                        transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight">
                        Edit
                    </button>
                </form>
            </div>
        </PageWrapperNormal_Top>
    );

}
