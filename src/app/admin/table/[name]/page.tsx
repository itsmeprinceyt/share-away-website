'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import getBaseUrl from '@/utils/getBaseUrl';
import { useCheckSession } from '../../../../hooks/useCheckSession';
import Loading from '../../../(components)/Loading';
import Navbar from '../../../(components)/Navbar';

/**
 * @description     - This page is used to display the data of a specific table in the database.
 */
export default function TablePage() {
    const { name } = useParams();
    const [data, setData] = useState<object[]>([]);
    const [loading, setLoading] = useState(false);
    useCheckSession('ADMIN');

    useEffect(() => {
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
        }, [name]);

    if (loading) return <Loading/>;

    return (
        <div>
            <Navbar/>
            <h1>Data in table: {name}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
