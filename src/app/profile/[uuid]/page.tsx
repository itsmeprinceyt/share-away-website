"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import getBaseUrl from '../../../utils/getBaseUrl';
import { updateUserSession } from '../../../utils/updateUserSesssion';
import User from '../../../types/User';

export default function ProfilePage() {
    const router = useRouter();
    const params = useParams();
    const uuid = params?.uuid as string;

    // State for the logged-in user's session data
    const [loggedInUserDetails, setLoggedInUserDetails] = useState<User | null>(null);

    // State for the profile details of the user we're viewing
    const [profileDetails, setProfileDetails] = useState<User | null>(null);

    // State for the logged-in user's message and admin status
    const [message, setMessage] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [form, setForm] = useState({
        currentPassword: '',
        confirmPassword: '',
        pfp: '',
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [passWordEdit, setPasswordEdit] = useState(false);
    const [pfpChange, setPfpChange] = useState(false);


    useEffect(() => {
        if (!uuid) return;

        const sessionData = sessionStorage.getItem('userSession');

        // If no user session, redirect to login
        if (!sessionData) {
            router.push('/login');
            return;
        }

        const parsedSession = JSON.parse(sessionData);
        const { user, expiry } = parsedSession;
        const expiryDate = new Date(expiry);

        // Check if session is expired and redirect to login
        if (new Date() > expiryDate) {
            sessionStorage.removeItem('userSession');
            router.push('/login');
            return;
        }

        setMessage(parsedSession.message || '');
        setIsAdmin(user.isAdmin === 1); // Check if the logged-in user is an admin

        // Set logged-in user details
        setLoggedInUserDetails(user);

        // If viewing your own profile, use logged-in user details
        if (uuid === user.uuid) {
            setProfileDetails(user);
            setIsOwner(true);
        } else {
            // If viewing someone else's profile, fetch from backend
            fetch(`${getBaseUrl()}/user/${uuid}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.uuid) {
                        setProfileDetails(data);
                        
                        setIsOwner(false); // Not the owner
                    } else {
                        router.push('/404'); // If no user found
                    }
                })
                .catch(() => {
                    router.push('/404'); // Handle error
                });
        }
    }, [router, uuid]);
    


    // If data is still loading or no profile details found, show loading message
    if (!uuid || (!profileDetails && !loggedInUserDetails)) return <p>Loading...</p>;

    // Use logged-in user details for their own profile, else use fetched profile details
    const userDetails = profileDetails || loggedInUserDetails;
    console.log(userDetails!.pfp); // Check if it's a valid base64 string


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
                console.log(`🖼️ Original dimensions: ${img.width}x${img.height}`);
    
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
        if (!session) return setError("User not logged in");

        const { user } = JSON.parse(session);

        try {
            const response = await fetch(`${getBaseUrl()}/edit/edit-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uuid: user.uuid,
                    currentPassword: form.currentPassword,
                    confirmPassword: form.confirmPassword,
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

    const handleEditPfp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const session = sessionStorage.getItem('userSession');
        if (!session) return setError("User not logged in");

        const { user } = JSON.parse(session);

        try {
            const response = await fetch(`${getBaseUrl()}/edit/edit-pfp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uuid: user.uuid,
                    pfp: form.pfp, // ✅ this should already be base64
                }),
            });

            const data = await response.json();
            if (response.ok){
                
                setSuccess(data.message)
                updateUserSession({ pfp: form.pfp });
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
            router.push('/profile');
        }
    };


    const handlePasswordChange = () => {
        setPasswordEdit(!passWordEdit);
        console.log('Edit Password clicked!');
    }

    const handlePfpChange = () => {
        setPfpChange(!pfpChange)
        console.log('Edit Pfp clicked!');
    }

    return (
        <div>
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
                    <form onSubmit={handleEditPfp} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">Upload Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {preview && <Image src={preview} alt="preview" width={96} height={96} className="mt-2 rounded-full object-cover" />}
                        </div>
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
            <h1>Welcome to {userDetails!.username}&apos;s Profile</h1>
            <p>Email: {userDetails!.email}</p>
            <p>Verified: {userDetails!.isVerified ? 'Yes' : 'No'}</p>
            <p>Registered on: {new Date(userDetails!.registeredDate).toLocaleDateString()}</p>
            <p>Profile picture: {userDetails!.pfp ? <Image src={userDetails!.pfp} alt="Profile" width={100} height={100} /> : "None"}</p>

            {message && isOwner && <p>{message}</p>}

            {/* If the user is the owner or an admin, show edit options */}
            {(isOwner || isAdmin) && (
                <div>
                    <button
                        onClick={handlePasswordChange}
                        className="bg-purple-400 p-2 px-4 rounded-lg text-white">Edit Password</button>
                    <button
                        onClick={handlePfpChange}
                        className="bg-purple-400 p-2 px-4 rounded-lg text-white">Edit Profile Pic</button>
                    {/* More owner/admin-only actions */}

                </div>

            )}
        </div>
    );
}
