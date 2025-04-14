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
                className="text-red-600 hover:text-red-800 font-semibold "
            >
                Log Out
            </button>
        </div>
    );
}
