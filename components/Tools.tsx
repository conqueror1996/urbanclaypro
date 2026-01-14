'use client';

import React from 'react';

import { Product } from '@/lib/products';



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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Specifier Resources</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">The Architect’s Toolkit</h2>
                    <p className="mt-4 text-[#5d554f] max-w-2xl mx-auto font-light leading-relaxed">
                        Visualize high-precision clay systems across various bonds and grout configurations.
                    </p>
                </div>

                <div className="h-[400px] w-full max-w-5xl mx-auto shadow-sm rounded-3xl overflow-hidden border border-[var(--line)] bg-[#EBE5D9] flex items-center justify-center flex-col p-8 text-center">
                    <div className="w-16 h-16 bg-[var(--ink)]/5 text-[var(--ink)] rounded-full flex items-center justify-center mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <h3 className="text-2xl font-serif text-[var(--ink)] mb-2">Visualizer v2.0 Upgrading</h3>
                    <p className="text-[var(--ink)]/60 max-w-md">
                        We are currently upgrading our specifier tools. Please check back later for updates.
                    </p>
                </div>
            </div>
        </section>
    );
}
