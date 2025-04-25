"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../(components)/Navbar';
import { useCheckSession } from '../../hooks/useCheckSession';
import getBaseUrl from '../../utils/getBaseUrl';
import Loading from '../(components)/Loading';
import PageWrapperNormal_Top from '../(components)/PageWrapperNormalTop';

export default function PostCreate() {
    const router = useRouter();
    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const session = useCheckSession();

    useEffect(() => {
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
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [body]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setLoading(true);
        const generated_post_uuid = crypto.randomUUID().slice(0, 16);
        const content = {
            heading,
            body
        };
        const userSessionToken = sessionStorage.getItem('userSession');
        const { token } = JSON.parse(userSessionToken!);
        const res = await fetch(`${getBaseUrl()}/post/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uuid: session.user.uuid,
                username: session.user.username,
                user_id: session.user.id,
                post_uuid: generated_post_uuid,
                content,
            }),
        });

        if (res.ok) {
            router.push(`/post/${generated_post_uuid}`);
        } else {
            setLoading(false);
            const errorData = await res.json();
            setError(errorData.message || 'Something went wrong!');
        }
    };

    if (loading) return <Loading />;

    return (
        <PageWrapperNormal_Top>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 m-10
            mt-24 mb-24 flex flex-col gap-12 text-center">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
                    <div className="text-center max-[550px]:text-3xl
                    max-[450px]:text-xl text-4xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-pink-500">Create Post</div>
                    {/* Title input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Title"
                            value={heading}
                            maxLength={100}
                            onChange={(e) => setHeading(e.target.value)}
                            required
                            className="bg-white border border-white font-semibold
                        focus:border-pink-500 focus:outline-none text-pink-500 p-2
                        rounded-lg mb-4  w-[400px] max-[410px]:w-[320px]"
                        />
                        <p className="absolute bottom-0 left-2 text-[8px] text-gray-500 text-right pointer-events-none">{heading.length} / 100</p>
                    </div>

                    {/* Body input */}
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            placeholder="Write something..."
                            value={body}
                            maxLength={5000}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className="bg-white border border-white border-r-0 focus:border-pink-500 focus:outline-none
                        text-pink-500 p-2 rounded-lg mb-4 w-[400px] max-[410px]:w-[320px]
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
                        transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight disabled:opacity-50">
                        Post
                    </button>
                </form>
                {error && <p className="text-red-500 font-extralight text-xs text-center">Oops! {error}</p>}
            </div>
        </PageWrapperNormal_Top>
    );
}
