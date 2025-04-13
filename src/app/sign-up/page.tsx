"use client";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import getBaseUrl from '../../utils/getBaseUrl';

export default function SignUp() {
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
        profilePic: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const router = useRouter();

    // Check if the user is already logged in so there is no need to sign up so it redirect to profile page
    useEffect(() => {
        const userSession = sessionStorage.getItem('userSession');
        if (userSession) {
            const userData = JSON.parse(userSession);
            if (userData.user.username) {
                router.push(`/profile/${userData.user.uuid}`);
            }
        }
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // 🔒 File size check (150KB max)
        if (file.size > 150 * 1024) {
            setError("Image must be under 150KB.");
            return;
        }
    
        const reader = new FileReader();
        const img = new window.Image();
    
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
    
            // Guard in case reader fails
            if (!base64) {
                setError("Failed to read image.");
                return;
            }
    
            img.src = base64;
    
            img.onload = () => {
                // 🧭 Enforce 1:1 aspect ratio
                if (img.width !== img.height) {
                    setError("Image must be square (1:1 ratio).");
                    return;
                }
    
                // ✅ All good: update state
                setError(null);
                setPreview(base64);
                setForm((prev) => ({
                    ...prev,
                    profilePic: base64,
                }));
            };
    
            img.onerror = () => {
                setError("Could not load image.");
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
                    {preview && <Image src={preview} alt="preview" className="mt-2 w-24 h-24 rounded-full object-cover" />}
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
    );
}
