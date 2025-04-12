"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        const sessionData = sessionStorage.getItem("userSession");
        if (sessionData) {
            const parsedSession = JSON.parse(sessionData);
            const { user, expiry } = parsedSession;

            const expiryDate = new Date(expiry);
            if (new Date() > expiryDate) {
                sessionStorage.removeItem("userSession");
                router.push("/login");
            } else {
                router.push(`/profile/${user.uuid}`);
            }
        } else {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Redirecting...</h1>
        </div>
    );
}
