"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../utils/getBaseUrl';
import { useCheckSession } from '../../hooks/useCheckSession';
import Loading from '../(components)/Loading';
import Navbar from '../(components)/Navbar';
import PageWrapperWhiteTop from '../(components)/PageWrapperWhiteTop';
import NotFound from '../not-found';

/**
 * @description     - This is the main Admin panel where we can see all the user activity,
 * recently posted, recently heart givens, and access database tables and edit or delete.
 */
export default function Admin() {
    const router = useRouter();
    const [tables, setTables] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [is404, setIs404] = useState(false);
    useCheckSession('ADMIN');

    useEffect(() => {
        let sessionData = sessionStorage.getItem('userSession');

        if (!sessionData) {
            sessionData = localStorage.getItem('userSession');
            if (sessionData) {
                sessionStorage.setItem('userSession', sessionData);
            }
        }

        if (!sessionData) {
            router.push(`/login`);
        }

        setLoading(true);

        const fetchTables = async () => {
            try {
                const res = await fetch(`${getBaseUrl()}/tables`);
                if (!res.ok) {
                    setIs404(true);
                }
                const data = await res.json();
                setTables(data.tables);
            } catch (err) {
                console.error('Error fetching tables:', err);
                setIs404(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [router]);

    if (loading) return <Loading />;
    if (is404) return <NotFound />;

    return (
        <PageWrapperWhiteTop>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">
                <div className="text-center max-[350px]:text-xl text-2xl
            font-extralight antialiased text-orange-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-orange-500">Admin Panel</div>
                <div className="flex max-[600px]:flex-col gap-5">
                    <Link
                        href="/admin/ban">
                        <button
                            className="bg-gradient-to-r from-orange-500 to-orange-400
                    text-white rounded-2xl w-[150px] h-[60px] py-2 border border-orange-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 font-extralight">
                            Ban
                        </button>
                    </Link>
                    <Link
                        href="/admin/revoke">
                        <button
                            className="bg-gradient-to-r from-green-500 to-green-400
                    text-white rounded-2xl w-[150px] h-[60px] py-2 border border-green-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-green-500/30 hover:shadow-green-500/50 font-extralight">
                            Revoke ban!
                        </button>
                    </Link>
                </div>
                <div className="text-center max-[350px]:text-xl text-2xl
            font-extralight antialiased text-blue-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-blue-500">Database Tables: {tables.length}</div>
                <div className="grid max-[600px]:grid-cols-2 grid-cols-3">
                    {tables.map((name, index) => {
                        const formattedName = name
                            .split('_')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                        return (
                            <div key={index} className="p-2">
                                <Link href={`/admin/table/${name}`}>
                                    <button className="bg-gradient-to-r from-blue-500
                    to-blue-400 text-white rounded-2xl w-[150px]
                    h-[60px] py-2 border border-blue-500
                    hover:scale-105 transition-all duration-300
                    shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50
                    font-extralight">
                                        {formattedName}
                                    </button>
                                </Link>
                            </div>
                        );
                    })}

                </div>

            </div>

        </PageWrapperWhiteTop>
    );
}
