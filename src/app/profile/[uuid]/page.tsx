"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import getBaseUrl from '../../../utils/getBaseUrl';
import { updateUserSession } from '../../../utils/updateUserSesssion';
import { useCheckSession } from '../../../hooks/useCheckSession';
import User from '../../../types/User';
import Loading from '../../(components)/Loading';
import Navbar from '../../(components)/Navbar';
import defaultProfilePic from '../../../utils/defaultAvatar';
import Link from 'next/link';

/**
 * @description             - This page is used to display the profile of a user.
 * @param profileDetails  - The detail of the user we are viewing.
 */
export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string;
    const [profileDetails, setProfileDetails] = useState<User | null>(null);

    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [form, setForm] = useState({
        currentPassword: '',
        confirmPassword: '',
        pfp: defaultProfilePic,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [passWordEdit, setPasswordEdit] = useState(false);
    const [pfpChange, setPfpChange] = useState(false);
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const session = useCheckSession();

    useEffect(() => {
        if (!session || !uuid) return;
    
        setIsAdmin(session.user.isAdmin === 1);
        setLoading(true);
    
        fetch(`${getBaseUrl()}/user/${uuid}?viewer_uuid=${session.user.uuid}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || !data.uuid) return;
                setProfileDetails(data);
                if (uuid === session.user.uuid) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            })
            .catch(() => {
                router.push('/404');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router, session, uuid]);

    if (loading) return <Loading />;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const img = new window.Image();
        const reader = new FileReader();

        reader.onload = function (event) {
            if (!event.target?.result) return;

            img.onload = () => {
                if (img.width !== img.height) {
                    setError("Image must be square (1:1 aspect ratio).");
                    return;
                }

                const canvas = document.createElement('canvas');
                const maxSize = 128;
                canvas.width = maxSize;
                canvas.height = maxSize;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return;
                }

                ctx.drawImage(img, 0, 0, maxSize, maxSize);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                const base64Length = compressedBase64.length - 'data:image/jpeg;base64,'.length;
                const estimatedSize = (base64Length * 3) / 4;

                if (estimatedSize > 150 * 1024) {
                    setError("Compressed image still exceeds 150KB. Please choose a smaller image.");
                    return;
                }

                setPreview(compressedBase64);
                setForm(prev => ({ ...prev, pfp: compressedBase64 }));
                setIsNewImageSelected(true);
                setError('');
            };
            img.src = event.target.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleEditPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const session = sessionStorage.getItem('userSession');
        const { user } = JSON.parse(session!);

        try {
            const response = await fetch(`${getBaseUrl()}/edit/edit-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uuid: user.uuid,
                    currentPassword: form.currentPassword, // Current password
                    confirmPassword: form.confirmPassword, // New Password
                }),
            });
            const data = await response.json();

            if (response.ok) setSuccess(data.message);
            else setError(data.message || 'Failed to update password');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
        }
    };

    const handleEditPfp = async (e: React.FormEvent, isRemove = false) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const session = sessionStorage.getItem('userSession');
        const { user } = JSON.parse(session!);

        try {
            const response = await fetch(`${getBaseUrl()}/edit/edit-pfp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uuid: user.uuid,
                    pfp: isRemove ? defaultProfilePic : form.pfp,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message)
                updateUserSession({ pfp: isRemove ? defaultProfilePic : form.pfp });
                router.refresh();
            }
            else setError(data.message || 'Failed to update profile picture');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
        } finally {
            router.push(`/profile`);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const res = await fetch(`${getBaseUrl()}/user/delete/${uuid}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                if (isOwner) {
                    sessionStorage.removeItem('userSession');
                    localStorage.removeItem('userSession');
                }
            } else {
                setError(data.message || 'Failed to delete account');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
        } finally {
            router.push(`/`);
        }
    };

    const handleBan = async () => {
        try {
            const res = await fetch(`${getBaseUrl()}/user/ban/${uuid}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (res.ok) {
                router.push('/profile');
            } else {
                setError(data.message || 'Failed to delete account');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Something went wrong');
            } else {
                setError('Something went wrong');
            }
        }
    };

    const handlePostDelete = async (post_uuid: string, type: 'CONFIRM' | 'ASK') => {
        if (type === 'ASK') {
            setPostToDelete(post_uuid);
            setConfirmDeletePost(true);
            return;
        }

        if (type === 'CONFIRM') {
            setConfirmDeletePost(false);
            setPostToDelete(null); // clear it after confirmation
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

    const toggleHeart = async (post_uuid: string, currentHasHearted: boolean)=> {
        const method = currentHasHearted  ? 'DELETE' : 'POST';
        const url =
            method === 'POST'
                ? `${getBaseUrl()}/heart`
                : `${getBaseUrl()}/heart?uuid=${session?.user.uuid}&post_uuid=${post_uuid}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                ...(method === 'POST' && {
                    body: JSON.stringify({ uuid: session?.user.uuid, post_uuid }),
                }),
            });

            if (res.ok) {
                setProfileDetails(prev => {
                    if (!prev) return prev;
                    const updatedPosts = prev.posts.map(post =>
                        post.post_uuid === post_uuid
                            ? {
                                ...post,
                                hasHearted: !post.hasHearted,
                                heart_count: post.hasHearted ? post.heart_count - 1 : post.heart_count + 1
                            }
                            : post
                    );

                    return {
                        ...prev,
                        posts: updatedPosts,
                        totalPosts: prev.totalPosts,
                        totalHearts: prev.totalHearts
                    };
                });
            } else {
                console.error('Failed to update heart status');
            }
        } catch (error) {
            console.error('Error during heart toggle', error);
        }
    };


    const handlePasswordChange = () => {
        setPasswordEdit(!passWordEdit);
    }

    const handlePfpChange = () => {
        setPfpChange(!pfpChange)
    }

    return (
        <div>
            <Navbar />
            {(passWordEdit) && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                    <h1 className="text-xl font-semibold mb-2">Edit Profile</h1>
                    <form onSubmit={handleEditPassword} className="space-y-4">
                        <input
                            type="password"
                            name="currentPassword"
                            placeholder="Current Password"
                            className="w-full border p-2 rounded"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm New Password"
                            className="w-full border p-2 rounded"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-600">{success}</p>}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            )}

            {(pfpChange) && (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
                    <h1 className="text-xl font-semibold mb-2">Edit Profile</h1>
                    <form onSubmit={(e) => handleEditPfp(e)} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Upload Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {preview && (
                                <Image
                                    src={preview}
                                    alt="preview"
                                    width={96}
                                    height={96}
                                    className="mt-2 rounded-full object-cover"
                                />
                            )}
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        {success && <p className="text-green-600">{success}</p>}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={!isNewImageSelected}
                            >
                                Update PFP
                            </button>

                            <button
                                type="button"
                                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                                onClick={(e) => handleEditPfp(e, true)}
                            >
                                Remove Current PFP
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h1>Welcome to {profileDetails!.username}&apos;s Profile</h1>
            <p>Email: {profileDetails!.email}</p>
            <p>Verified: {profileDetails!.isVerified ? 'Yes' : 'No'}</p>
            <p>Registered on: {new Date(profileDetails!.registeredDate).toLocaleDateString()}</p>
            <p>Profile picture: {profileDetails!.pfp ? <Image src={profileDetails!.pfp} alt="Profile" width={100} height={100} /> : "None"}</p>

            <p>Total Posts: {profileDetails!.totalPosts ?? 0}</p>
            <p>Total Hearts: {profileDetails!.totalHearts ?? 0}</p>

            {profileDetails?.posts?.length ? (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Posts by {profileDetails.username}</h2>
                    <ul className="space-y-2">
                        {profileDetails.posts.map(({ id, post_uuid, username, heart_count, posted_at, content, hasHearted }) => {
                            const { heading = "No heading", body = "No body" } =
                                typeof content === 'string' ? JSON.parse(content) : content || {};

                            return (
                                <li key={id} className="bg-gray-100 p-4 rounded shadow">
                                    <h2 className="font-bold text-lg">{heading}</h2>
                                    <p className="text-gray-700">{body}</p>
                                    <p className="text-black">Has hearted or not: {hasHearted ? `yes ${hasHearted}` : `no ${hasHearted}`}</p>
                                    <button onClick={() => toggleHeart(post_uuid, hasHearted)}>
                                        {hasHearted ? '💔 Remove Heart' : '❤️ Give Heart'} ({heart_count})
                                    </button>
                                    <p className="text-sm text-gray-500">
                                        Posted on {new Date(posted_at).toLocaleString()}
                                    </p>
                                    <Link
                                        href={`/profile/${uuid}`}>
                                        <p className="text-sm text-green-700">
                                            @{username}
                                        </p>
                                    </Link>
                                    <Link href={`/post/${post_uuid}`} className="text-blue-500 hover:underline mt-2 inline-block">
                                        <button>View Post</button>
                                    </Link>
                                    {(isAdmin || isOwner) && (
                                        <Link href={`/post/edit/${post_uuid}`} className="text-orange-500 hover:underline mt-2 inline-block">
                                            <button>Edit Post</button>
                                        </Link>
                                    )}
                                    {(isAdmin || isOwner) && (
                                        <button
                                            className="text-purple-500 hover:underline mt-2 inline-block"
                                            onClick={() => handlePostDelete(post_uuid, 'ASK')}
                                        >
                                            Delete
                                        </button>
                                    )}


                                </li>
                            );
                        })}
                    </ul>
                </div>
            ) : (
                <p className="text-gray-500 mt-4">No posts available.</p>
            )}


            {/* If the user is the owner or an admin, show edit options */}
            {(isOwner || isAdmin) && (
                <div>
                    <button
                        onClick={handlePasswordChange}
                        className="bg-purple-400 p-2 px-4 rounded-lg text-white">Edit Password</button>
                    <button
                        onClick={handlePfpChange}
                        className="bg-purple-400 p-2 px-4 rounded-lg text-white">Edit Profile Pic</button>
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="bg-red-600 p-2 px-4 rounded-lg text-white">Delete Account</button>

                </div>
            )}

            {/* If the user is admin, show edit options */}
            {(isAdmin) && (
                <div>
                    <button onClick={handleBan}
                        className="bg-orange-400 p-2 px-4 rounded-lg text-white">BAN</button>


                </div>
            )}

            {confirmDeletePost && postToDelete && (
                <div className="mt-4 bg-red-100 p-4 rounded-lg shadow">
                    <p className="text-red-700 font-semibold mb-2">Are you sure you want to delete this post?</p>
                    <div className="space-x-2">
                        <button
                            onClick={() => handlePostDelete(postToDelete, 'CONFIRM')}
                            className="bg-red-600 text-white py-1 px-4 rounded"
                        >
                            Yes, Delete
                        </button>
                        <button
                            onClick={() => {
                                setConfirmDeletePost(false);
                                setPostToDelete(null);
                            }}
                            className="bg-gray-400 text-white py-1 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}


            {confirmDelete && (
                <div className="mt-4 bg-red-100 p-4 rounded-lg shadow">
                    <p className="text-red-700 font-semibold mb-2">Are you sure you want to delete this account?</p>
                    <div className="space-x-2">
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-600 text-white py-1 px-4 rounded">Yes, Delete</button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="bg-gray-400 text-white py-1 px-4 rounded">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
