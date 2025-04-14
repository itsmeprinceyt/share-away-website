/**
 * @brief       - Loading page component throughout the application.
 */
export default function Loading() {
    return (
        <div className="flex justify-center items-center h-64">
            <p className="text-lg font-semibold animate-pulse bg-black text-white">Loading...</p>
        </div>
    );
}
