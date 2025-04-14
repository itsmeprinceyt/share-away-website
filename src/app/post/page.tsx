"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../(components)/Navbar';
import { useCheckSession } from '../../hooks/useCheckSession';
import getBaseUrl from '../../utils/getBaseUrl';

export default function PostCreate() {
    const router = useRouter();
    const [heading, setHeading] = useState('');
    const [body, setBody] = useState('');
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

    const handleSubmit = async (e: React.FormEvent) => {
        const generated_post_uuid = crypto.randomUUID().slice(0, 16)
        e.preventDefault();
        if (!session) return;

        const content = {
            heading,
            body
        };
        const res = await fetch(`${getBaseUrl()}/post/create`, {
            method: 'POST',
            headers: {
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
            console.error('Failed to create post');
        }
    };

    return (
        <div>
            <Navbar />
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
                <h2 className="text-lg font-semibold mb-2">Create Post</h2>

                <input
                    type="text"
                    placeholder="Heading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    required
                    className="w-full mb-2 p-2 border rounded"
                />

                <textarea
                    placeholder="Write something..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    className="w-full mb-2 p-2 border rounded"
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Post
                </button>
            </form>
        </div>
    );
}
