'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../utils/getBaseUrl';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleLogin = async () => {
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
            console.log(data);
            const { uuid, message, ...userDetails } = data;
            if (response.ok) {
                // Store the user details and set an expiry time of 30 days
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);  // Expiry date set to 30 days from now
    
                const sessionData = {
                    user: { uuid, ...userDetails },
                    message,
                    expiry: expiryDate.toISOString(),  // Store expiry as an ISO string
                };
    
                sessionStorage.setItem('userSession', JSON.stringify(sessionData));
    
                // Redirect to the profile page
                router.push(`/profile/${uuid}`);
            } else {
                // Handle login failure
                console.log("Login failed");
            }
        } catch (err) {
            console.error('Error during login request:', err);
        }
    };
    
    

    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="bg-blue-500 flex flex-col justify-center items-center p-4 rounded-lg shadow-lg w-1/3">
                <label>Email</label>
                <input
                    type="text"
                    className="bg-white text-black p-2 rounded-lg mb-4 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label>Password</label>
                <input
                    type="password"
                    className="bg-white text-black p-2 rounded-lg mb-4 w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg mt-4 w-[150px]"
            >
                Login
            </button>


            <Link href="/sign-up">
                <button className="bg-purple-500 text-white p-2 rounded-lg mt-4 w-[150px]">
                    Sign Up
                </button>
            </Link>
        </div>
    );
}
