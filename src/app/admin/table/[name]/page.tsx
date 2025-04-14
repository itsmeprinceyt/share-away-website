'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import getBaseUrl from '@/utils/getBaseUrl';
import { useCheckSession } from '../../../../hooks/useCheckSession';
import Loading from '../../../(components)/Loading';
import Navbar from '../../../(components)/Navbar';

/**
 * @description     - This page is used to display the data of a specific table in the database.
 */
export default function TablePage() {
    const router = useRouter();
    const { name } = useParams();
    const [data, setData] = useState<object[]>([]);
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

        fetch(`${getBaseUrl()}/tables/${name}`)
            .then(res => res.json())
            .then(json => {
                setData(json.data);
            })
            .catch(err => {
                console.error('Error fetching table data:', err);
            }).finally(() => {
                setLoading(false);
            });
    }, [router, name]);

    if (loading) return <Loading />;

    return (
        <div>
            <Navbar />
            <h1>Data in table: {name}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
