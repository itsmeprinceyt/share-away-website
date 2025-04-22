'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import getBaseUrl from '@/utils/getBaseUrl';
import { useCheckSession } from '../../../../hooks/useCheckSession';
import Loading from '../../../(components)/Loading';
import Navbar from '../../../(components)/Navbar';
import PageWrapperWhiteTop from '../../../(components)/PageWrapperWhiteTop';
import NotFound from '../../../not-found';
import Link from 'next/link';

/**
 * @description     - This page is used to display the data of a specific table in the database.
 */
export default function TablePage() {
    const router = useRouter();
    const { name } = useParams();

    const [data, setData] = useState<object[]>([]);
    const [expandedFields, setExpandedFields] = useState<{ [key: string]: boolean }>({});

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

        const fetchTableData = async () => {
            try {
                const userSessionToken = sessionStorage.getItem('userSession');
                const { token } = JSON.parse(userSessionToken!);
                const res = await fetch(`${getBaseUrl()}/tables/${name}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) {
                    setIs404(true);
                }

                const json = await res.json();
                setData(json.data);
            } catch (err) {
                console.error('Error fetching table data:', err);
                setIs404(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTableData();
    }, [router, name]);

    if (loading) return <Loading />;
    if (is404) return <NotFound />;

    const toggleField = (entryIndex: number, fieldKey: string) => {
        const fieldId = `${entryIndex}-${fieldKey}`;
        setExpandedFields(prev => ({
            ...prev,
            [fieldId]: !prev[fieldId]
        }));
    };

    return (
        <PageWrapperWhiteTop>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">
                <Link href="/admin">
                    <div className="text-blue-500 text-shadow-md text-shadow-blue-500/20 hover:underline">
                        Panel
                    </div>
                </Link>

                <div className="text-center max-[350px]:text-xl text-2xl
            font-extralight antialiased text-blue-500 rounded-xl px-5 py-1  text-shadow-lg/20 text-shadow-blue-500">Data in table: {name}</div>

                {data.length > 0 ? (
                    <div className="w-full space-y-6">
                        {data.map((entry, entryIndex) => (
                            <ul
                                key={entryIndex}
                                className="bg-white shadow-lg p-4 rounded-xl border border-gray-200 text-left"
                            >
                                {Object.entries(entry).map(([key, value], i) => {
                                    const fieldId = `${entryIndex}-${key}`;
                                    const isLongBase64 = typeof value === 'string' && value.startsWith('data:image');
                                    const isExpanded = expandedFields[fieldId];

                                    return (
                                        <li key={i} className="mb-2">
                                            <div className="text-sm text-gray-800 break-words">
                                                <strong className="text-blue-600">{key}:</strong>{' '}

                                                {/* Handle Show Full / Hide for long text like body */}
                                                {key === 'body' ? (
                                                    <>
                                                        <div
                                                            className={`${isExpanded ? 'max-h-full' : 'max-h-16 overflow-hidden text-ellipsis'
                                                                } transition-all duration-300 bg-gray-50 p-2 rounded text-xs font-mono`}
                                                        >
                                                            {value}
                                                        </div>
                                                        <button
                                                            onClick={() => toggleField(entryIndex, key)}
                                                            className="mt-1 text-xs text-blue-500 underline hover:text-blue-700"
                                                        >
                                                            {isExpanded ? 'Hide' : 'Show Full'}
                                                        </button>
                                                    </>
                                                ) : key === 'heading' ? (
                                                    <span className="ml-1 font-bold">{String(value)}</span>
                                                ) : isLongBase64 ? (
                                                    <>
                                                        <div
                                                            className={`${isExpanded ? 'max-h-full' : 'max-h-16 overflow-hidden text-ellipsis'
                                                                } transition-all duration-300 bg-gray-50 p-2 rounded text-xs font-mono`}
                                                        >
                                                            {value}
                                                        </div>
                                                        <button
                                                            onClick={() => toggleField(entryIndex, key)}
                                                            className="mt-1 text-xs text-blue-500 underline hover:text-blue-700"
                                                        >
                                                            {isExpanded ? 'Hide' : 'Show Full'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="ml-1">{String(value)}</span>
                                                )}
                                            </div>

                                            {/* Add Visit Profile link if there's a UUID */}
                                            {(key === 'uuid' || key === 'user_uuid') && (
                                                <Link
                                                    href={`/profile/${String(value)}`}
                                                    className="bg-purple-500 px-2 p-1 text-xs
                                                    text-white rounded-md"
                                                >
                                                    Visit Profile
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm italic">No data found.</div>
                )}

            </div>
        </PageWrapperWhiteTop>
    );
}
