"use client";
import React from 'react';
import PageWrapperProps from '../../types/PageWrapperProps';

export default function PageWrapperNormalOrange({
    children
}: PageWrapperProps) {
    return (
        <div className={`z-50 min-h-screen bg-gradient-to-b from-orange-50 via-orange-200 to-orange-100 flex justify-center items-center`}>
            {children}
        </div>
    );
}
