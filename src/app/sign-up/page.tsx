"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import getBaseUrl from '../../utils/getBaseUrl';
import Navbar from "../(components)/Navbar";
import defaultProfilePic from '../../utils/defaultAvatar';
/**
 * @description    - This page is used to sign up a new user.
 */
export default function SignUp() {
    const router = useRouter();
    const [form, setForm] = useState<{
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        profilePic: string;
    }>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePic: defaultProfilePic,
    });

    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(defaultProfilePic);
    let sessionData = sessionStorage.getItem('userSession');
    if (!sessionData) {
        sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            sessionStorage.setItem('userSession', sessionData);
        }
    }

    if (sessionData) {
        router.push('/profile');
        return;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 150 * 1024) {
            setError("Image is too large. Please choose a smaller image.");
            return;
        }

        const img = new window.Image();
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;

            if (!base64) {
                setError("Failed to read image.");
                return;
            }

            img.src = base64;
            img.onload = () => {
                if (img.width !== img.height) {
                    setError("Image must be square (1:1 aspect ratio).");
                    return;
                }

                const maxSize = 128;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                const canvasWidth = img.width * scale;
                const canvasHeight = img.height * scale;

                const canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    return;
                }

                ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                const base64Length = compressedBase64.length - 'data:image/jpeg;base64,'.length;
                const estimatedSize = (base64Length * 3) / 4;

                if (estimatedSize > 150 * 1024) {
                    setError("Compressed image still exceeds 150KB. Please choose a smaller image.");
                    return;
                }

                setPreview(compressedBase64);
                setForm(prev => ({ ...prev, profilePic: compressedBase64 }));
                setError('');
            };
        };

        reader.onerror = () => {
            setError("Failed to read the file.");
        };

        reader.readAsDataURL(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${getBaseUrl()}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    pfp: form.profilePic,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                router.push('/login')
            }
            if (!response.ok) {
                setError(data.message || "Registration failed");
            } else {
                setForm({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    profilePic: "",
                });
                setPreview(null);
            }
        } catch (err) {
            setError("An error occurred while registering.");
            console.error("❌ Registration error:", err);
        }
    };

    return (
        <div>
            <Navbar />

            <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4 mt-10">
                <h2 className="text-xl font-bold">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full border p-2 rounded"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="w-full border p-2 rounded"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <div>
                        <label className="block font-medium mb-1">Upload Profile Picture</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {preview && <Image src={preview} alt="preview" width={100} height={100} className="mt-2 rounded-full object-cover" />}
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
