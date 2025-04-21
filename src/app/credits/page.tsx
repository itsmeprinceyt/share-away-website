'use client';
import { useState, useEffect } from 'react';
import Navbar from '../(components)/Navbar';
import PageWrapperNormal from '../(components)/PageWrapperNormal';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '../(components)/Loading';

const ArtworkCredit = () => {
    const [loading, setLoading] = useState(false);
    const [artworks, setArtworks] = useState<{ image: string, link: string }[]>([]);

    useEffect(() => {
        setLoading(true);
        const fetchArtData = async () => {
            const res = await fetch('/api/art-links');
            const data = await res.json();
            const { images, links } = data;

            const combined = images.map((img: string, i: number) => ({
                image: `/art/${img}`,
                link: links[i] || '#'
            }));

            setArtworks(combined);
            setLoading(false);
        };

        fetchArtData();
    }, []);

    if (loading) return <Loading />;

    return (
        <PageWrapperNormal>
            <Navbar />
            <div className="z-20 w-full max-w-3xl mt-24 mb-24 px-4 flex flex-col items-center gap-8">
                <h1 className="text-center text-4xl font-extralight text-pink-500">Artwork Credit</h1>

                <div className="columns-1 sm:columns-2 gap-5 space-y-14">
                    {artworks.map((art, index) => (
                        <div key={index} className="break-inside-avoid flex flex-col gap-4">
                            <Image
                                src={art.image}
                                alt={`Art ${index + 1}`}
                                width={300}
                                height={300}
                                className="rounded-lg hover:scale-105 border border-pink-300/30 shadow-xl shadow-pink-500/20 transition-transform duration-300 w-full h-auto"
                            />
                            <Link
                                href={art.link}
                                target="_blank"
                                className="block text-center mt-2 text-white text-sm px-4 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/40"
                            >
                                Original Link 🎨
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </PageWrapperNormal>
    );
};

export default ArtworkCredit;
