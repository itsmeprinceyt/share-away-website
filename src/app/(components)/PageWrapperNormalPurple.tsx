"use client";
import React from 'react';
import PageWrapperProps from '../../types/PageWrapperProps';

export default function PageWrapperNormalPurple({
    children
}: PageWrapperProps) {
    return (
        <div className={`z-50 min-h-screen bg-gradient-to-b from-purple-50 via-purple-200 to-purple-100 flex justify-center items-center`}>
            {children}
        </div>
    );
}
