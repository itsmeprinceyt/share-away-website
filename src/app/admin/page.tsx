"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import getBaseUrl from '../../utils/getBaseUrl';
import { useCheckSession } from '../../hooks/useCheckSession';
import Loading from '../(components)/Loading';
import Navbar from '../(components)/Navbar';

/**
 * @description     - This is the main Admin panel where we can see all the user activity,
 * recently posted, recently heart givens, and access database tables and edit or delete.
 */
export default function Admin() {
    const [tables, setTables] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const session = useCheckSession('ADMIN');
    
    useEffect(() => {
        if (!session) return;

        setLoading(true);

        const fetchTables = async () => {
            const res = await fetch(`${getBaseUrl()}/tables`);
            const data = await res.json();
            setTables(data.tables);
            setLoading(false);
        };
        fetchTables();
    }, [session]);

    if (loading) return <Loading/>;
    
    return (
        <div className="space-y-2">
            <Navbar/>
            {tables.map((name, index) => (
                <div key={index}>
                    <Link href={`/admin/table/${name}`}>{name}</Link>
                </div>
            ))}

        </div>
    );
}
