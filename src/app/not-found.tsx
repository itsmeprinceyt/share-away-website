import Link from 'next/link';
import PageWrapperNormal from "./(components)/PageWrapperNormal";

export default function NotFound() {
    return (
        <PageWrapperNormal>
            <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-extralight mb-4 max-[400px]:text-2xl">404 - Page Not Found</h1>
            <p className="mb-6 font-extralight max-[400px]:text-xs">Sorry, we couldn’t find the page you’re looking for.</p>
            <Link href="/home">
                <button className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg w-[150px] max-[550px]:w-[100px]
                        py-2 border border-pink-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight">
                    Home
                </button>
            </Link>
            </div>
        </PageWrapperNormal>
    );
}
