"use client";
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the user session from sessionStorage
        sessionStorage.removeItem('userSession');

        // Redirect to the login page
        router.push('/login');
    };

    return (
        <div>
            <button
                onClick={handleLogout}
                className="bg-red-500 p-2 text-white rounded-2xl px-4"
            >
                Log Out
            </button>
        </div>
    );
}
