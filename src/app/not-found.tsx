import Link from 'next/link';
import PageWrapper from "./(components)/PageWrapper";

export default function NotFound() {
    return (
        <PageWrapper>
            <div className="flex flex-col justify-center items-center">
            <h1 className="text-4xl font-extralight mb-4">404 - Page Not Found</h1>
            <p className="mb-6 font-extralight">Sorry, we couldn’t find the page you’re looking for.</p>
            <Link href="/home">
                <button className="bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600 transition font-extralight">
                    Home
                </button>
            </Link>
            </div>
        </PageWrapper>
    );
}
