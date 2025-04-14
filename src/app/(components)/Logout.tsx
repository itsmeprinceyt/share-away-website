"use client";
import { useRouter } from 'next/navigation';
import { removeSession } from '../../hooks/useRemoveSession';

/**
 * @brief       - Logout component that clears the user session and redirects to the login page.
 */
export default function Logout() {
    const router = useRouter();
    
    const handleLogout = () => {
        removeSession();
        router.push('/');
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
