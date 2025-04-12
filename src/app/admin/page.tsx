"use client";
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import getBaseUrl from '../../utils/getBaseUrl';

export default function Admin() {
    const router = useRouter();
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        
        const sessionData = sessionStorage.getItem('userSession');

        if (!sessionData) {
            router.push('/');
            return;
        }

        const parsedSession = JSON.parse(sessionData);
        const { user, expiry } = parsedSession;
        const expiryDate = new Date(expiry);

        if (new Date() > expiryDate || user.isAdmin !== 1) {
            router.push('/');
            return;
        }

        const fetchTables = async () => {
            const res = await fetch(`${getBaseUrl()}/tables`);
            const data = await res.json();
            setTables(data.tables);
        };

        fetchTables();
    }, [router]);

    return (
        <div className="space-y-2 p-2">
            {tables.map((name, index) => (
                <div key={index}>
                    <Link href={`/admin/table/${name}`}>{name}</Link>
                </div>
            ))}

        </div>
    );
}
