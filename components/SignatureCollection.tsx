'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';

interface SignatureCollectionProps {
    products: Product[];
}

const SIGNATURE_CATEGORIES = [
    {
        id: 'exposed-brick',
        label: 'Exposed Brick',
        subtitle: 'Masonry Construction',
        description: 'Full-depth structural clay bricks for building authentic, timeless facades.',
        // EXCLUDE 'tile' and 'cladding' to ensure no overlap
        match: (p: Product) => {
            const isTile = p.category?.slug === 'brick-tile' || p.title.toLowerCase().includes('tile') || p.title.toLowerCase().includes('cladding');
            if (isTile) return false;

            return p.category?.slug === 'exposed-brick' || p.tag?.toLowerCase().includes('exposed') || p.title.toLowerCase().includes('exposed');
        }
    },
    {
        id: 'brick-tile',
        label: 'Brick Tile',
        subtitle: 'Surface Cladding',
        description: 'Slim, lightweight cladding veneers to dress existing walls with brick aesthetics.',
        // Explicitly include "tile", "cladding", "veneer" but EXCLUDE Floor/Roof
        match: (p: Product) => {
            const isFloorOrRoof = p.category?.slug === 'floor-tile' || p.tag?.toLowerCase().includes('floor') || p.tag?.toLowerCase().includes('roof');
            if (isFloorOrRoof) return false;

            return p.category?.slug === 'brick-tile' || p.tag?.toLowerCase().includes('cladding') || p.tag?.toLowerCase().includes('tile') || p.title.toLowerCase().includes('veneer');
        }
    },
    {
        id: 'floor-tile',
        label: 'Floor Tile',
        subtitle: 'Natural Grounding',
        description: 'Durable and earthy terracotta floor tiles for warm, inviting spaces.',
        match: (p: Product) => p.category?.slug === 'floor-tile' || p.tag?.toLowerCase().includes('floor') || p.title.toLowerCase().includes('floor')
    }
];

export default function SignatureCollection({ products }: SignatureCollectionProps) {
    const [activeTab, setActiveTab] = useState(SIGNATURE_CATEGORIES[0].id);

    // Filter products for each category
    const categoryData = useMemo(() => {
        return SIGNATURE_CATEGORIES.map(cat => {
            const matches = products.filter(cat.match);
            // Deduplicate by slug
            const unique = Array.from(new Map(matches.map(item => [item.slug, item])).values());
            // Take top 4 for the smaller grid
            return {
                ...cat,
                items: unique.slice(0, 4)
            };
        });
    }, [products]);

    const activeCategory = categoryData.find(c => c.id === activeTab) || categoryData[0];

    return (
        <section className="py-24 md:py-32 bg-[#Fbf9f7] overflow-hidden" id="signature-collection">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADLINE SECTION - Compact Layout */}
                {/* HEADLINE SECTION - Centered & Premium */}
                <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-3 block">
                            Signature Series
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif text-[var(--ink)] leading-tight">
                            Crafted from Earth
                        </h2>
                    </motion.div>

                    {/* TABS NAVIGATION - Centered Floating Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex bg-white p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[var(--line)] overflow-x-auto max-w-full scrollbar-hide"
                    >
                        {categoryData.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveTab(cat.id)}
                                className={`
                                    relative px-6 py-3 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap z-10
                                    ${activeTab === cat.id ? 'text-white' : 'text-[var(--ink)]/60 hover:text-[var(--ink)] hover:bg-gray-50'}
                                `}
                            >
                                {activeTab === cat.id && (
                                    <motion.div
                                        layoutId="tab-pill"
                                        className="absolute inset-0 bg-[var(--ink)] rounded-full -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* CONTENT AREA */}
                <div className="min-h-[400px]">
                    <AnimatePresence>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {/* Category Intro Line */}
                            <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-4">
                                <motion.p
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    className="text-[var(--ink)]/60 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
                                >
                                    {activeCategory.description}
                                </motion.p>
                            </div>

                            {/* Products Grid - Smaller Cards (4 cols) */}
                            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                                {activeCategory.items.map((product, index) => (
                                    <ProductCard
                                        key={`${activeCategory.id}-${product._id}`}
                                        product={product}
                                        categoryId={activeCategory.id}
                                        index={index}
                                    />
                                ))}

                                {activeCategory.items.length === 0 && (
                                    <div className="col-span-full py-20 text-center border border-dashed border-[var(--ink)]/20 rounded-2xl">
                                        <p className="text-[var(--ink)]/40 font-serif text-xl">
                                            No products found in this collection yet.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile View All */}
                            {/* View All - Bottom centered */}
                            <div className="mt-16 md:mt-24 text-center">
                                <Link
                                    href={`/products?category=${activeCategory.id}`}
                                    className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] hover:text-[var(--ink)] transition-colors duration-300"
                                >
                                    View All {activeCategory.label}
                                    <span>→</span>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}

function ProductCard({ product, categoryId, index }: { product: Product, categoryId: string, index: number }) {
    const image = product.imageUrl || (product.variants?.[0]?.imageUrl);
    const categorySlug = product.category?.slug || product.tag?.toLowerCase().replace(/\s+/g, '-') || 'products';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
        >
            <Link href={`/products/${categorySlug}/${product.slug}`} className="block h-full">
                {/* Image Card - Increased Radius & Smaller Aspect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-3xl border border-transparent group-hover:border-[var(--line)]">
                    {image ? (
                        <>
                            <Image
                                src={image}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--ink)]/20 bg-[var(--sand)]/20">
                            <span className="font-serif italic text-xs">Image Coming Soon</span>
                        </div>
                    )}

                    {/* Floating Action Button */}
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                        <span className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg text-[var(--ink)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </div>

                {/* Minimal Info */}
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-500 px-2">
                    <h4 className="text-lg font-serif text-[var(--ink)] mb-1 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">
                        {product.title}
                    </h4>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink)]/40 font-bold line-clamp-1 mt-1">
                        {product.subtitle || categoryId.replace('-', ' ')}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
