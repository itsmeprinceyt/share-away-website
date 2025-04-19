"use client";
import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
}

export default function PageWrapperOrange({ children }: PageWrapperProps) {
    return (
        <div className="z-50 min-h-screen bg-gradient-to-b
        from-orange-50 via-orange-100 to-orange-50 flex
        justify-center items-center">
            {children}
        </div>
    );
}
