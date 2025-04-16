"use client";
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCheckSession } from '../../../hooks/useCheckSession';
import Navbar from '../../(components)/Navbar';
import getBaseUrl from '../../../utils/getBaseUrl';
import Loading from '../../(components)/Loading';
import PostContent from '../../../types/PostContent';

export default function Post() {
    const router = useRouter();
    const params = useParams();
    const post_uuid = params?.post_uuid as string;

    const [postData, setPostData] = useState<PostContent | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const session = useCheckSession();

    useEffect(() => {
        if (!post_uuid) return;

        setIsAdmin(session?.user.isAdmin === 1);
        setLoading(true);

        fetch(`${getBaseUrl()}/post/${post_uuid}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Post not found');
            }
            return res.json();
        })
        .then((data) => {
            if (data && data.post) {
                setPostData(data.post);
                if (postData?.uuid === session?.user.uuid) {
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
    }, [router, post_uuid, postData?.uuid, session]);

    if (loading) return <Loading />;

    return (
        <div>
            <Navbar />
            Post owner: {isOwner ? 'Yes' : 'No'}
            User Admin: {isAdmin ? 'Yes' : 'No'}
            Post id: {post_uuid}
            {postData && (
                <div>
                    <h2 className="font-bold text-lg">{postData.content.heading}</h2>
                    <p className="text-gray-700">{postData.content.body}</p>
                    <p className="text-red-500">Hearts: {postData.heart_count}</p>
                    <p className="text-sm text-green-700">Posted by: {postData.username}</p>
                    <p className="text-sm text-gray-500">Posted at: {new Date(postData.posted_at).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}
