"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import PageWrapper from './PageWrapper';

interface LoadingProps {
    etaSeconds?: number;
}

/**
 * @brief       - Loading page component throughout the application.
 */
export default function Loading({ etaSeconds }: LoadingProps) {
    const [showDelayText, setShowDelayText] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowDelayText(true);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <PageWrapper>

            <div className="flex flex-col items-center gap-5">
                <Image
                    className="w-[250px] h-[250px] rounded-4xl border
                border-pink-300 shadow-pink-500/20 shadow-xl hover:scale-105
                hover:shadow-pink-500/40 transition-all duration-500"
                    src={'/art/art7.jpg'}
                    width={500}
                    height={500}
                    alt="loading"
                />
                <div className=" -tracking-tighter leading-7 text-center
                text-sm p-2 text-pink-950">
                    Please wait while the site loads!
                </div>

                {etaSeconds !== undefined && (
                    <div className="-tracking-tighter leading-7 text-center text-sm p-2 text-pink-800">
                        ETA: 1 - {etaSeconds} second{etaSeconds === 1 ? '' : 's'}
                    </div>
                )}

                {showDelayText && (
                    <div className="-tracking-tighter leading-7 text-center
                    text-sm p-2 text-pink-950 animate-pulse">
                        [ Try refreshing if it&apos;s taking too long ]
                    </div>
                )}

            </div>

        </PageWrapper>
    );
}
