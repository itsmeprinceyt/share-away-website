"use client";
import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
}

export default function PageWrapper2({ children }: PageWrapperProps) {
    return (
        <div className="z-50 min-h-screen bg-gradient-to-b
        from-pink-50 via-pink-100 to-pink-50 flex
        justify-center items-center">
            {children}
        </div>
    );
}
