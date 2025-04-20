"use client";
import React from 'react';
import PageWrapperProps from '../../types/PageWrapperProps';

export default function PageWrapperLight({
    children
}: PageWrapperProps) {
    return (
        <div className={`z-50 min-h-screen bg-gradient-to-b from-pink-50 via-pink-100 to-pink-200 flex justify-center items-center`}>
            {children}
        </div>
    );
}
