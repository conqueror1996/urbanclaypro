'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface PremiumImageProps extends ImageProps {
    containerClassName?: string;
    shimmerColor?: string;
    backgroundColor?: string;
}

export default function PremiumImage({
    className = '',
    containerClassName = '',
    // Default to a subtle warm shimmer that matches the terracotta theme
    shimmerColor = 'bg-gradient-to-r from-transparent via-[#b45a3c]/10 to-transparent',
    backgroundColor = 'bg-[var(--sand)]',
    alt,
    ...props
}: PremiumImageProps) {
    const [isLoading, setIsLoading] = useState(!props.priority);

    return (
        <div
            className={`relative overflow-hidden ${backgroundColor} ${containerClassName}`}
        >
            {/* Loading Shimmer Overlay - Only show if not priority or still loading */}
            {isLoading && !props.priority && (
                <div
                    className={`absolute inset-0 z-10 w-full h-full animate-slide-shimmer ${shimmerColor}`}
                />
            )}

            <Image
                className={`transition-all duration-700 ease-out ${isLoading && !props.priority ? 'scale-105 blur-lg opacity-0' : 'scale-100 blur-0 opacity-100'
                    } ${className}`}
                onLoad={() => setIsLoading(false)}
                alt={alt}
                {...props}
            />
        </div>
    );
}
