"use client";
import React from 'react';

interface PageWrapperProps {
    children: React.ReactNode;
}

export default function PageWrapperPurple({ children }: PageWrapperProps) {
    return (
        <div className="z-50 min-h-screen bg-gradient-to-b
        from-purple-50 via-purple-100 to-purple-50 flex
        justify-center items-center">
            {children}
        </div>
    );
}
