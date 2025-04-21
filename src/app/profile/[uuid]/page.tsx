"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import getBaseUrl from '../../../utils/getBaseUrl';
import { updateUserSession } from '../../../utils/updateUserSesssion';
import { useCheckSession } from '../../../hooks/useCheckSession';
import User from '../../../types/User';
import Loading from '../../(components)/Loading';
import NotFound from '../../not-found';
import Navbar from '../../(components)/Navbar';
import defaultProfilePic from '../../../utils/defaultAvatar';
import PostCard from '../../(components)/PostCard';
import PageWrapperNormalTop from '../../(components)/PageWrapperNormalTop';

/**
 * @description             - This page is used to display the profile of a user.
 * @param profileDetails  - The detail of the user we are viewing.
 */
export default function ProfilePage() {
    {/* Routing and params related */ }
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string;

    {/* Storing user data & all posts */ }
    const [profileDetails, setProfileDetails] = useState<User | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    {/* Form data related */ }
    const [form, setForm] = useState({
        currentPassword: '',
        confirmPassword: '',
        pfp: defaultProfilePic,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(defaultProfilePic);

    {/* Logging */ }
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    {/* Togglers */ }
    const [passWordEdit, setPasswordEdit] = useState(false);
    const [pfpChange, setPfpChange] = useState(false);
    const [isNewImageSelected, setIsNewImageSelected] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmBan, setConfirmBan] = useState(false);
    const [confirmDeletePost, setConfirmDeletePost] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [settingToggle, setSettingToggle] = useState(false);
    const [settingToggleDialogue, setSettingToggleDialogue] = useState(false);

    {/* Loaders and 404 Pages */ }
    const [loading, setLoading] = useState(true);
    const [is404, setIs404] = useState(false);

    const session = useCheckSession();

    useEffect(() => {
        if (!uuid) return;
        setIsAdmin(session?.user.isAdmin === 1);
        setLoading(true);

        fetch(`${getBaseUrl()}/user/${uuid}?viewer_uuid=${session?.user.uuid}`)
            .then((res) => res.json())
            .then((data) => {
                if (!data || !data.uuid) {
                    setIs404(true);
                    return;
                }
                setProfileDetails(data);
                if (uuid === session?.user.uuid) {
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
    if (is404) return <NotFound />;

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
        if (form.currentPassword != form.confirmPassword) {
            setError('Password do not match');
            return;
        }

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSettings = () => {
        setSettingToggle(!settingToggle);
    }

    const handleSettingDialogue = () => {
        setSettingToggleDialogue(!settingToggleDialogue);
    }

    const handlePasswordChange = () => {
        setPasswordEdit(!passWordEdit);
        setSettingToggleDialogue(!settingToggleDialogue);
        setSettingToggle(!settingToggle);
    }

    const handlePfpChange = () => {
        setPfpChange(!pfpChange);
        setSettingToggleDialogue(!settingToggleDialogue);
        setSettingToggle(!settingToggle);
    }

    const handleResetPrompts = () => {
        setPasswordEdit(false);
        setPfpChange(false);
        setConfirmDelete(false);
        setConfirmBan(false);
        setSettingToggleDialogue(false);
        setSettingToggle(true);
    }

    const handleBanCancel = () => {
        setConfirmBan(false);
        setSettingToggleDialogue(!settingToggleDialogue);
        setSettingToggle(true);
    }

    const handleDeleteAccountCancel = () => {
        setConfirmDelete(false)
        setSettingToggleDialogue(!settingToggleDialogue);
        setSettingToggle(true);
    }

    return (
        <PageWrapperNormalTop>
            <Navbar />
            {/* Setting Dialogue Open */}
            {settingToggleDialogue && (
                <div className="z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex justify-center items-center">

                    <div className="bg-white relative rounded-lg shadow-xl shadow-pink-500/30 border
                    border-pink-300 flex flex-col gap-7 p-7 w-[300px]">

                        <button onClick={handleResetPrompts}
                            className="absolute top-2 left-2 w-[15px] hover:scale-110 transition-all duration-300">
                            <Image
                                className="z-2 drop-shadow-[0_4px_6px_rgba(236,72,153,0.5)]"
                                src={'/icons/return.png'}
                                width={50}
                                height={50}
                                alt="Settings"
                            />
                        </button>

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

                        {(passWordEdit) && (
                            <div className="text-center text-purple-500 font-extralight text-shadow-md text-shadow-pink-500/20 flex flex-col gap-4">
                                <h1 className="text-xl ">Edit Profile</h1>
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
                                    {error && <p className="text-red-500 text-xs text-shadow-md
                                    text-shadow-red-500/20">{error}</p>}
                                    {success && <p className="text-green-500 text-xs text-shadow-md
                                    text-shadow-green-500/20">{success}</p>}
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-purple-500 to-purple-400
                                        text-white rounded-lg w-full py-2 border border-purple-500
                                        hover:scale-105 transition-all duration-300 shadow-xl
                                        shadow-purple-500/30 hover:shadow-purple-500/50 font-extralight">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {pfpChange && (
                            <div className="flex flex-col gap-5 text-center">
                                <div className="text-center text-purple-500 font-extralight text-shadow-md text-shadow-purple-500/20">Edit Profile Picture</div>

                                <form onSubmit={(e) => handleEditPfp(e)} className="flex flex-col items-center gap-5">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="focus:outline-none"
                                        >
                                            <Image
                                                src={preview}
                                                alt="Preview"
                                                width={100}
                                                height={100}
                                                className="rounded-full border-2 border-purple-500 shadow-xl shadow-purple-500/30"
                                            />
                                        </button>
                                    )}

                                    {/* error/success messages */}
                                    {error && <p className="text-red-500 text-xs text-shadow-md
                                    text-shadow-red-500/20">{error}</p>}
                                    {success && <p className="text-green-500 text-xs text-shadow-md
                                    text-shadow-green-500/20">{success}</p>}

                                    {/* Action buttons */}
                                    <div className="flex gap-5 w-full">
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg w-[150px] max-[550px]:w-[100px] py-2 border border-blue-500
                                            hover:scale-105 transition-all duration-300 shadow-xl
                                            shadow-blue-500/30 hover:shadow-blue-500/50 font-extralight disabled:opacity-50"
                                            disabled={!isNewImageSelected}
                                        >
                                            Update
                                        </button>


                                        <button
                                            type="button"
                                            className="bg-gradient-to-r from-red-500 to-red-400
                                            text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                            py-2 border border-red-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 font-extralight"
                                            onClick={(e) => handleEditPfp(e, true)}>
                                            Remove PFP
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {confirmDelete && (
                            <div className="text-center flex flex-col gap-5">
                                <p className="text-red-500 font-extralight text-shadow-md text-shadow-red-500/20">
                                    Are you sure you want to delete your account?<br /><br />All your posts and likes will be permanently removed !
                                </p>
                                <div className="flex gap-5 items-center justify-center">
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="bg-gradient-to-r from-red-500 to-red-400
                                            text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                            py-2 border border-red-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-red-500/50 font-extralight">
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={handleDeleteAccountCancel}
                                        className="bg-gradient-to-r from-gray-500 to-gray-400
                                            text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                            py-2 border border-gray-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-500/30 hover:shadow-gray-500/50 font-extralight">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}


                        {confirmBan && (
                            <div className="text-center flex flex-col gap-5">
                                <p className="text-orange-500 font-extralight text-shadow-md text-shadow-orange-500/20">
                                    Are you sure you want to ban this user?
                                </p>
                                <div className="flex gap-5 items-center justify-center">
                                    <button
                                        onClick={handleBan}
                                        className="bg-gradient-to-r from-orange-500 to-orange-400
                                            text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                            py-2 border border-orange-500 hover:scale-105 transition-all
                                            duration-300 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 font-extralight">
                                        Confirm Ban
                                    </button>
                                    <button
                                        onClick={handleBanCancel}
                                        className="bg-gradient-to-r from-gray-500 to-gray-400
                                            text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                                            py-2 border border-gray-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-500/30 hover:shadow-gray-500/50 font-extralight">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
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

            {/* Profile Settings */}
            {settingToggle && (
                <div className="z-50 fixed top-0 left-0 right-0 bottom-0 bg-black/80 flex justify-center items-center">
                    <div className="bg-white relative rounded-lg shadow-xl shadow-pink-500/30 border
                    border-pink-300 flex items-center justify-center">

                        <button onClick={handleSettings}
                            className="absolute top-2 right-2 w-[12px]
                            hover:scale-110 transition-all duration-300">
                            <Image
                                className="z-2 drop-shadow-[0_4px_6px_rgba(236,72,153,0.5)]"
                                src={'/icons/cross.png'}
                                width={50}
                                height={50}
                                alt="Settings"
                            />
                        </button>

                        <div className="p-2 max-[510px]:w-[200px] max-[480px]:w-[150px] w-[180px]">
                            <Image
                                className="rounded-lg"
                                src={'/art/art3.jpg'}
                                width={500}
                                height={500}
                                alt="Setting Image"
                            />
                        </div>

                        <div className="flex flex-col items-start justify-between max-[480px]:gap-2
                        max-[480px]:p-2 gap-7 p-7 max-[510px]:w-[200px]
                        max-[480px]:w-[160px] w-[240px] ">
                            {(isOwner || isAdmin) && (
                                <>
                                    <button
                                        onClick={handlePasswordChange}
                                        className="hover:bg-purple-600/10 hover:border-l-[20px] border-l-purple-600 hover:font-semibold py-2 px-3 rounded transition-all duration-300 hover:shadow-lg shadow-purple-500/20 hover:text-purple-500 text-start">
                                        Edit Password
                                    </button>
                                    <button
                                        onClick={handlePfpChange}
                                        className="hover:bg-purple-600/10 hover:border-l-[20px] border-l-purple-600 hover:font-semibold py-2 px-3 rounded transition-all duration-300 hover:shadow-lg shadow-purple-500/20 hover:text-purple-500 text-start">
                                        Edit Profile Picture
                                    </button>
                                    <button
                                        onClick={() => {
                                            setConfirmDelete(true);
                                            setSettingToggleDialogue(!settingToggleDialogue);
                                            setSettingToggle(!settingToggle);
                                        }}
                                        className="hover:bg-red-600/10 hover:border-l-[20px] border-l-red-600 hover:font-semibold py-2 px-3 rounded transition-all duration-300 hover:shadow-lg shadow-red-500/20 hover:text-red-500 text-start">
                                        Delete Account
                                    </button>

                                </>
                            )}

                            {(isAdmin) && (
                                <>
                                    <button
                                        onClick={() => {
                                            setConfirmBan(true);
                                            setSettingToggleDialogue(!settingToggleDialogue);
                                            setSettingToggle(!settingToggle);
                                        }}
                                        className="hover:bg-orange-600/10 hover:border-l-[20px] border-l-orange-600 hover:font-semibold py-2 px-3 rounded transition-all duration-300 hover:shadow-lg shadow-orange-500/20 hover:text-orange-500 text-start">
                                        Ban User
                                    </button>
                                </>
                            )}

                        </div>

                    </div>

                </div>
            )}

            <div className="z-20 max-[680px]:w-[400px] max-[480px]:w-[300px] w-[600px] m-10 mt-24 mb-24 flex flex-col gap-6">

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

                {/* Profile container */}
                <div className=" flex justify-between p-2">

                    <div className="flex justify-center items-start gap-5">

                        <Image
                            className="border-2 border-white rounded-full shadow-xl shadow-pink-500/30"
                            src={profileDetails!.pfp || defaultProfilePic}
                            alt="Profile"
                            width={100}
                            height={100}
                        />

                        <div className="flex flex-col gap-1">

                            <div className="flex justify-center items-center gap-2 text-shadow-black/20 text-shadow-md text-2xl font-semibold">
                                <Link href={`/profile/${uuid}`}>
                                    @{profileDetails!.username}
                                </Link>
                                <div className="flex justify-center items-center bg-white
                                rounded-full h-[20px] w-[20px] text-xs shadow-black/20
                                shadow-xl hover:scale-150 transition-all duration-300">
                                    {profileDetails!.isVerified ?
                                        <span className="pb-1 pointer-events-none text-shadow-purple-500 text-shadow-md/30">
                                            ✔️
                                        </span>
                                        :
                                        <span className="pointer-events-none text-shadow-red-500 text-shadow-md/30 text-[10px]">
                                            ❌
                                        </span>
                                    }
                                </div>
                            </div>

                            <div className="text-[10px] text-gray-500 text-shadow-gray-500 text-shadow-md/20">
                                Registered on: {new Date(profileDetails!.registeredDate).toLocaleDateString()}
                            </div>

                            <div className="text-xs text-purple-500 text-shadow-purple-500 text-shadow-md/20">Total Posts: {profileDetails!.totalPosts ?? 0}</div>

                            <div className="text-xs text-red-500 text-shadow-red-500 text-shadow-md/20">❤️ {profileDetails!.totalHearts ?? 0}</div>
                        </div>

                    </div>

                    {/* Setting Menu */}
                    {(isOwner || isAdmin) && (
                        <div className="w-[18px] relative group max-[480px]:hidden">
                            <div className="z-5 absolute top-5 right-0 bg-white px-2 py-1
                            rounded-md shadow-xl text-xs text-nowrap shadow-pink-500/20
                            border border-pink-300
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Edit Profile
                            </div>
                            <button onClick={handleSettings}>
                                <Image
                                    className="z-2 drop-shadow-[0_4px_6px_rgba(236,72,153,0.5)]"
                                    src={'/icons/setting.png'}
                                    width={50}
                                    height={50}
                                    alt="Settings"
                                />
                            </button>
                        </div>
                    )}

                </div>

                {/* Posts */}
                {profileDetails?.posts?.length ? (
                    <div>
                        <h2 className="mb-8 text-shadow-black/20 text-shadow-md text-xm font-extralight">
                            {profileDetails.username} has posted . . .</h2>
                        <ul className="flex flex-col gap-10">
                            {profileDetails.posts.map(post => {
                                const {
                                    id,
                                    post_uuid,
                                    username,
                                    uuid,
                                    heart_count,
                                    posted_at,
                                    hasHearted,
                                    content
                                } = post;

                                const { heading = "No heading", body = "No body" } =
                                    typeof content === 'string' ? JSON.parse(content) : content || {};

                                return (
                                    <PostCard
                                        key={id}
                                        id={id}
                                        post_uuid={post_uuid}
                                        uuid={uuid}
                                        username={username}
                                        heading={heading}
                                        body={body}
                                        heart_count={heart_count}
                                        hasHearted={hasHearted}
                                        posted_at={posted_at}
                                        isAdmin={isAdmin}
                                        isOwner={isOwner}
                                        onToggleHeart={toggleHeart}
                                        onDelete={handlePostDelete}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <p className="text-gray-500 text-xs font-extralight">User has not posted anything!</p>
                )}

            </div>

            {/* Setting Menu - Below 480px */}
            {(isOwner || isAdmin) && (
                <div className="w-[18px] z-50 group fixed bottom-15 right-13 min-[480px]:hidden">
                    <div className="z-50 absolute top-5 right-0 bg-white px-2 py-1
                            rounded-md shadow-xl text-xs text-nowrap shadow-pink-500/20
                            border border-pink-300
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Edit Profile
                    </div>
                    <button onClick={handleSettings}>
                        <Image
                            className="z-2 drop-shadow-[0_4px_6px_rgba(236,72,153,0.5)]"
                            src={'/icons/setting.png'}
                            width={50}
                            height={50}
                            alt="Settings"
                        />
                    </button>
                </div>
            )}

        </PageWrapperNormalTop>
    );
}
