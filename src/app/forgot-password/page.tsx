'use client';
import React from 'react';
import Navbar from '../(components)/Navbar';
import PageWrapperNormal from '../(components)/PageWrapperNormal';
import Link from 'next/link';

const ForgotPassword = () => {
    return (
        <PageWrapperNormal>
            <Navbar />
            <div className="z-20 max-[680px]:w-full w-[600px] max-[680px]:ml-2 max-[680px]:mr-2 mt-24 mb-24 flex flex-col justify-between items-center gap-6">
                <div className="text-center max-[350px]:text-xl font-extralight antialiased text-pink-500 rounded-xl px-5 py-1 text-shadow-lg/20 text-shadow-pink-500">
                    Oops! It looks like you&apos;ve forgotten your password. Since this is a personal project for showcase, I don’t have an automated password recovery feature just yet. But don&apos;t worry! Simply click the button below to get in touch with me, and let me know your username or email. I&apos;ll reset it for you ASAP!
                </div>
                <div className="flex flex-col gap-5">
                    <Link href="/login" className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-800 rounded-lg w-[300px] 
                        py-2 border border-yellow-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 font-extralight text-center  text-xm">
                        I just remembered my password!
                    </Link>
                    <Link href="/contact" className="bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-lg w-[300px] 
                        py-2 border border-pink-500 hover:scale-105 transition-all duration-300 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50 font-extralight text-center text-xm">
                        Contact Me to reset your password!
                    </Link>
                </div>
            </div>
        </PageWrapperNormal>
    );
};

export default ForgotPassword;
