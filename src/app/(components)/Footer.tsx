"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <div className={`z-50 min-h-19 bg-gradient-to-r border-t-2 border-pink-200 from-pink-100 via-pink-300/50 to-pink-100 flex justify-center items-center flex-col py-4`}>
            <div className="flex items-center gap-2">
                <Image
                    className="h-[60px] w-[60px]"
                    src={'/logo/ShareAway5-png.png'}
                    height={1000}
                    width={1000}
                    alt='Logo'
                />
                <Link href="/home">
                    <div className="text-center text-2xl antialiased font-extralight text-pink-500 text-shadow-lg/20 text-shadow-pink-500">
                        Share Away
                    </div>
                </Link>
            </div>
            <div className="text-center text-lg antialiased font-extralight text-pink-500 text-shadow-lg/20 text-shadow-pink-500 pointer-events-none border-t border-b py-2 border-pink-300/50 ">
                &quot;Share your thoughts, embrace your voice.&quot;
            </div>
            {/* Quick Links Section */}
            <div className="text-white text-xs mt-4 mb-4 flex gap-4">
                <Link href="/terms-and-conditions" className="text-center antialiased font-extralight text-pink-500 text-shadow-lg/20 text-shadow-pink-500 hover:scale-125 transition-all duration-300">Privacy Policy</Link>
                <Link href="/terms-and-conditions" className="text-center antialiased font-extralight text-pink-500 text-shadow-lg/20 text-shadow-pink-500 hover:scale-125 transition-all duration-300">Terms of Service</Link>
                <Link href="/contact" className="text-center antialiased font-extralight text-pink-500 text-shadow-lg/20 text-shadow-pink-500 hover:scale-125 transition-all duration-300">Contact Me</Link>
            </div>
        </div>
    );
}
