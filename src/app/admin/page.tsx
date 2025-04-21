"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import getBaseUrl from '../../utils/getBaseUrl';
import { useCheckSession } from '../../hooks/useCheckSession';
import Loading from '../(components)/Loading';
import Navbar from '../(components)/Navbar';
import PageWrapperNormalOrange from '../(components)/PageWrapperNormalOrange';

/**
 * @description     - This is the main Admin panel where we can see all the user activity,
 * recently posted, recently heart givens, and access database tables and edit or delete.
 */
export default function Admin() {
    const router = useRouter();
    const [tables, setTables] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
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
            const res = await fetch(`${getBaseUrl()}/tables`);
            const data = await res.json();
            setTables(data.tables);
            setLoading(false);
        };
        fetchTables();
    }, [router]);

    if (loading) return <Loading />;
    return (
        <PageWrapperNormalOrange>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 grid grid-cols-2 justify-center items-center gap-6">
                <Link
                    href="/admin/ban">
                    <button className="bg-blue-700 text-white rounded-2xl px-4 p-2">
                        Ban
                    </button>
                </Link>
                <Link
                    href="/admin/revoke">
                    <button className="bg-blue-700 text-white rounded-2xl px-4 p-2">
                        Revoke ban!
                    </button>
                </Link>

                {tables.map((name, index) => (
                    <div key={index}>
                        <Link href={`/admin/table/${name}`}>{name}</Link>
                    </div>
                ))}
            </div>

        </PageWrapperNormalOrange>
    );
}
