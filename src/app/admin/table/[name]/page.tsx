'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import getBaseUrl from '@/utils/getBaseUrl';

export default function TablePage() {
    const { name } = useParams();
    const [data, setData] = useState<object[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${getBaseUrl()}/tables/${name}`)
            .then(res => res.json())
            .then(json => {
                setData(json.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching table data:', err);
                setLoading(false);
            });
    }, [name]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h1>Data in table: {name}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
