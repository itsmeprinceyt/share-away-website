"use client";
import React from 'react';
import PageWrapperProps from '../../types/PageWrapperProps';

export default function PageWrapper({
    children,
    fromColor = "pink-50",
    viaColor = "pink-200",
    toColor = "pink-100",
    alignItems = "center"
}: PageWrapperProps) {
    const gradientClass = `bg-gradient-to-b from-${fromColor} via-${viaColor} to-${toColor}`;
    const alignClass = alignItems === "start" ? "items-start" : "items-center";
    return (
        <div className={`z-50 min-h-screen ${gradientClass} flex justify-center ${alignClass}`}>
            {children}
        </div>
    );
}
