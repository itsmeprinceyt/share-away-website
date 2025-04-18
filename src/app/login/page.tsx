'use client'
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../utils/getBaseUrl';
import useRedirectToProfile from '../../hooks/useRedirectToProfile';
import Navbar from '../(components)/Navbar';
import PageWrapper from '../(components)/PageWrapper';
import Loading from '../(components)/Loading';

/**
 * @description     - This page is used to login the user.
 */
export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    useRedirectToProfile();

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${getBaseUrl()}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            const data = await response.json();
            const { uuid, message, ...userDetails } = data;
            if (response.ok) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);

                const sessionData = {
                    user: { uuid, ...userDetails },
                    message,
                    expiry: expiryDate.toISOString(),
                };

                if (sessionData) {
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                    localStorage.setItem('userSession', JSON.stringify(sessionData));
                    router.push(`/home`);
                }
            } else {
                setError(data.message || 'Login failed');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error during login request:', err);
            setError('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (loading) return <Loading etaSeconds={30} />;

    return (
        <PageWrapper>
            <Navbar />

            {/* Main container */}
            <div className="z-20 flex max-[1090px]:flex-col-reverse mt-24 mb-24">
                {/* Image container */}
                <div className="max-[550px]:w-[350px]  max-[350px]:w-[300px]">
                    <Image className="hover:z-20 hover:rounded-4xl hover:border
                rounded-tl-4xl rounded-bl-4xl max-[1090px]:rounded-tl-none max-[1090px]:rounded-br-4xl border-l border-t border-b max-[1090px]:border-t-0 max-[1090px]:border-r border-pink-300
                shadow-pink-500/20 shadow-xl hover:scale-105 hover:shadow-pink-500/40
                transition-all duration-500"
                        src={'/art/art9.jpg'}
                        width={500}
                        height={500}
                        alt="Login image"
                    />
                </div>
                {/* Text container */}
                <div className="z-10 backdrop-blur-xl bg-white/30 w-[500px] border-b border-r border-t border-pink-300 flex flex-col justify-center items-center gap-10 max-[550px]:gap-4
                max-[350px]:gap-4 p-4 rounded-tr-4xl rounded-br-4xl
                max-[1090px]:h-[500px] max-[550px]:h-[350px] max-[350px]:w-[300px] max-[350px]:h-[300px] max-[1090px]:rounded-br-none max-[1090px]:rounded-tl-4xl max-[1090px]:border-l max-[1090px]:border-b-0 shadow-lg
                max-[550px]:w-[350px]
                ">
                    {/* Welcome message */}
                    <div className="text-center max-[550px]:text-3xl
                    max-[350px]:text-xl text-4xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-pink-500">
                        Hello, welcome back!
                    </div>
                    {/* Input container */}
                    <div className="flex flex-col justify-center items-center">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white border border-white focus:border-pink-500 focus:outline-none text-pink-500 p-2 rounded-lg mb-4 max-[350px]:mb-2
                            w-[400px] max-[550px]:w-[250px] font-extralight"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Enter password"
                            className="bg-white border-2 border-white focus:border-pink-500 focus:outline-none text-pink-500 p-2 rounded-lg mb-4 
                            max-[350px]:mb-2 w-[400px] 
                            max-[550px]:w-[250px] font-extralight"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {/* Button container */}
                    <div className="flex justify-center items-center gap-5 max-[550px]:gap-2">
                        <button
                            onClick={handleLogin}
                            className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                        py-2 border border-pink-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight">
                            Login
                        </button>

                        <Link href="/sign-up">
                            <button
                                className="bg-gradient-to-r from-purple-500
                        to-purple-400 text-white rounded-lg w-[150px]
                        max-[550px]:w-[100px] py-2 border border-purple-500
                        hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 font-extralight">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                    {/* Error container */}
                    {error && (
                        <div className="text-red-500 text-clip font-extralight p-2 rounded text-center max-[550px]:text-xs">
                            Oops! {error}
                        </div>
                    )}
                </div>

            </div>
            {/* Background glow */}
            <div className="absolute right-0 w-[500px] h-[500px] bg-pink-100 blur-3xl"></div>

        </PageWrapper>
    );
}
