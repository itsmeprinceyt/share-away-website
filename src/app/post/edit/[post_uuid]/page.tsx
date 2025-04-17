"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../(components)/Navbar';
import { useCheckSession } from '../../../../hooks/useCheckSession';
import getBaseUrl from '../../../../utils/getBaseUrl';
import Loading from '../../../(components)/Loading';
import PostContent from '../../../../types/PostContent';

export default function PostEdit() {
    const router = useRouter();
    const params = useParams();
    const post_uuid = params?.post_uuid as string;

    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');

    const [postData, setPostData] = useState<PostContent | null>(null); // Use the PostContent type here
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const session = useCheckSession();

    useEffect(() => {
        if (!post_uuid || !session) return;

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

        setIsOwner(owner);
        setIsAdmin(admin);

        if (!owner && !admin) {
            router.replace(`/post/${post_uuid}`);
        }
    }, [router, postData, session, post_uuid]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        const content = {
            heading,
            body
        };
        const res = await fetch(`${getBaseUrl()}/post/edit`, {
            method: 'POST',
            headers: {
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
        }
    };

    if (loading) return <Loading />
    return (
        <div>
            <Navbar />
            are you owner: {isOwner ? 'yes' : 'no' }
            are you admin: {isAdmin ? 'yes': 'no'}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
                <h2 className="text-xl font-semibold mb-4 text-center">Edit Post</h2>
    
                {/* Heading input (like a tweet title) */}
                <input
                    type="text"
                    placeholder="What's the heading?"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    required
                    className="w-full mb-4 text-lg bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 p-2 placeholder-gray-500"
                />
    
                {/* Body input (like tweet body / textarea) */}
                <textarea
                    placeholder="What's on your mind?"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={6}
                    className="w-full text-base bg-transparent border border-gray-300 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                />
    
                <div className="text-right mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 py-2 rounded-full font-semibold shadow"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
    
}
