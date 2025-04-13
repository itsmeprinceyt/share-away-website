"use client";
import { useRouter } from 'next/navigation';

/**
 * @brief Logout component that clears the user session and redirects to the login page.
 */
export default function Logout() {
    const router = useRouter();
    const handleLogout = () => {
        sessionStorage.removeItem('userSession');
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
