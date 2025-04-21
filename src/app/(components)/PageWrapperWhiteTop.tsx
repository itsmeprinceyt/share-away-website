"use client";
import React from 'react';
import PageWrapperProps from '../../types/PageWrapperProps';

export default function PageWrapperWhiteTop({
    children
}: PageWrapperProps) {
    return (
        <div className={`z-50 min-h-screen bg-white flex justify-center items-start`}>
            {children}
        </div>
    );
}
