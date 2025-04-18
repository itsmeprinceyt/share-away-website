"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getBaseUrl from '../../utils/getBaseUrl';
import Navbar from "../(components)/Navbar";
import defaultProfilePic from '../../utils/defaultAvatar';
import PageWrapperPurple from "../(components)/PageWrapperPurple";

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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(defaultProfilePic);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let sessionData = sessionStorage.getItem('userSession');
        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                sessionStorage.setItem('userSession', sessionData);
            }
        }

        if (sessionData) {
            router.push('/profile');
        }
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 150 * 1024) {
            setError("Please upload an image that is 150KB or smaller");
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
                    setError("Image must be square (1:1 aspect ratio)");
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
        <PageWrapperPurple>
            <Navbar />
            {/* Main Container */}
            <div className="flex flex-col justify-start items-center max-[580px]:gap-20 max-[480px]:gap-24 gap-14 z-20 w-[500px] max-[580px]:w-[400px] max-[480px]:w-[300px] pb-8
            bg-white/30 m-10 mt-24 mb-24 rounded-4xl relative border border-purple-300
            shadow-xl shadow-purple-500/20">
                {/* Banner */}
                <Image
                    className="rounded-tl-4xl rounded-tr-4xl shadow-xl shadow-purple-500/30"
                    src={'/art/banner/banner2.png'}
                    width={500}
                    height={500}
                    alt="banner"
                />
                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-5">
                    {/* Profile Picture Container */}
                    <div className="absolute top-10 flex flex-col w-[150px] items-center
                    justify-center gap-2 ">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                        />
                        {preview &&
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="">
                                <Image
                                    src={preview}
                                    alt="preview"
                                    width={100}
                                    height={100}
                                    className="rounded-full border-2 border-purple-500 shadow-xl shadow-purple-500/30" />
                            </button>
                        }
                    </div>
                    {/* Form Inputs */}
                    <div className="flex flex-col justify-center items-center relative">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            className="bg-white border border-white focus:border-purple-500 focus:outline-none text-purple-500 p-2 rounded-lg mb-4 max-[350px]:mb-2
                            w-[280px] max-[550px]:w-[200px] font-extralight"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="bg-white border border-white focus:border-purple-500 focus:outline-none text-purple-500 p-2 rounded-lg mb-4 max-[350px]:mb-2
                            w-[280px] max-[550px]:w-[200px] font-extralight"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="bg-white border border-white focus:border-purple-500 focus:outline-none text-purple-500 p-2 rounded-lg mb-4 w-[280px] max-[550px]:w-[200px] font-extralight pr-10"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        {/* Eye */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="z-20 absolute right-2 bottom-22"
                        >
                            <Image
                                src={showPassword ? "/icons/eye-close-purple.png" : "/icons/eye-open-purple.png"}
                                alt="Toggle visibility"
                                width={15}
                                height={15}
                            />
                        </button>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="bg-white border border-white focus:border-purple-500 focus:outline-none text-purple-500 p-2 rounded-lg mb-4 w-[280px] max-[550px]:w-[200px] font-extralight pr-10"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        {/* Eye */}
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(prev => !prev)}
                            className="z-20 absolute right-2 bottom-8"
                        >
                            <Image
                                src={showConfirmPassword ? "/icons/eye-close-purple.png" : "/icons/eye-open-purple.png"}
                                alt="Toggle visibility"
                                width={15}
                                height={15}
                            />
                        </button>
                    </div>
                    {/* Button container */}
                    <div className="relative">
                        {/* Buttons */}
                        <div className="flex flex-col justify-center items-center gap-5">
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-purple-500
                        to-purple-400 text-white rounded-lg w-[280px]
                        max-[550px]:w-[100px] py-2 border border-purple-500
                        hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 font-extralight">
                                Sign Up
                            </button>
                            <Link href="/login">
                                <button
                                    className="text-pink-500 hover:scale-105 transition-all
                                    duration-300 text-xs font-extralight ">
                                    Already have an account? <span className="font-semibold underline animate-pulse">Click here</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {error && <p className="text-red-500 font-extralight">Oops! {error}</p>}
                </form>
                
            </div>
            {/* Background glow */}
            <div className="absolute right-0 w-[500px] h-[500px] bg-purple-200 blur-3xl"></div>
            
        </PageWrapperPurple>
    );
}
