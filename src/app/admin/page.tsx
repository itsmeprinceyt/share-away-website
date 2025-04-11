"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import getBaseUrl from '../../utils/getBaseUrl';

export default function Admin() {
    const [tables, setTables] = useState<string[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            const res = await fetch(`${getBaseUrl()}/tables`);
            const data = await res.json();
            setTables(data.tables);
        };

        fetchTables();
    }, []);

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
