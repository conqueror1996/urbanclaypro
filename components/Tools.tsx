'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Product } from '@/lib/products';

const WallStyler = dynamic(() => import('./WallStyler'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#1a1512] animate-pulse rounded-3xl" />
});

interface ToolsProps {
    products?: Product[];
}

export default function Tools({ products = [] }: ToolsProps) {
    // Filter products for the texture gallery
    // We want "Brick Tile" and "Exposed Brick" (loosely matched by tags or titles)
    const textureProducts = products.filter(p =>
        (p.tag?.includes('Brick') || p.title.includes('Brick') || p.tag?.includes('Facade')) && p.imageUrl
    ).slice(0, 8); // Grab top 8 for the gallery

    // Extract images for the WallStyler
    const variantImages = textureProducts.map(p => p.imageUrl || '').filter(Boolean);

    return (
        <section id="tools" className="bg-[var(--sand)] border-y border-[var(--line)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Planning Tools</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">Plan Your Project</h2>
                    <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
                        Visualize our collections in various bonds and grout configurations.
                    </p>
                </div>

                <div className="h-[600px] w-full max-w-5xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-white/20">
                    <WallStyler
                        initialColor="#b45a3c"
                        variantImages={variantImages}
                    />
                </div>
            </div>
        </section>
    );
}
