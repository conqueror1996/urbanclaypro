'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import PremiumImage from './PremiumImage';

interface SignatureCollectionProps {
    products: Product[];
}

interface DisplayProduct {
    _id: string;
    title: string;
    subtitle?: string;
    slug: string;
    imageUrl: string;
    categorySlug?: string;
    variantName?: string;
    family?: string;
}

// ... existing categories ...

const SIGNATURE_CATEGORIES = [
    {
        id: 'exposed-brick',
        label: 'Facade Systems',
        subtitle: 'Structural Masonry',
        description: 'High-precision full-depth clay bricks engineered for load-bearing and self-supporting facades with zero efflorescence.',
        match: (p: Product) => {
            const isTile = p.category?.slug === 'brick-tile' || p.title.toLowerCase().includes('tile') || p.title.toLowerCase().includes('cladding');
            if (isTile) return false;
            return p.category?.slug === 'exposed-brick' || p.tag?.toLowerCase().includes('exposed') || p.title.toLowerCase().includes('exposed');
        }
    },
    {
        id: 'brick-tile',
        label: 'Cladding Systems',
        subtitle: 'Surface Veneers',
        description: 'Industrial-grade clay tiles for high-performance wall cladding, offering the aesthetic of brick with the efficiency of a tile.',
        match: (p: Product) => {
            const isFloorOrRoof = p.category?.slug === 'floor-tile' || p.tag?.toLowerCase().includes('floor') || p.tag?.toLowerCase().includes('roof');
            if (isFloorOrRoof) return false;
            return p.category?.slug === 'brick-tile' || p.tag?.toLowerCase().includes('cladding') || p.tag?.toLowerCase().includes('tile') || p.title.toLowerCase().includes('veneer');
        }
    },
    {
        id: 'terracotta-jaali',
        label: 'Ventilation Systems',
        subtitle: 'Geometric Jaalis',
        description: 'Modular terracotta jaali units designed for structural light-play, thermal regulation, and natural ventilation.',
        match: (p: Product) => p.category?.slug === 'terracotta-jaali' || p.tag?.toLowerCase().includes('jaali') || p.title.toLowerCase().includes('jaali') || p.title.toLowerCase().includes('jali')
    },
    {
        id: 'floor-tile',
        label: 'Paving Systems',
        subtitle: 'Natural Flooring',
        description: 'High-density terracotta floor tiles engineered for slip-resistance and thermal comfort in heavy-traffic environments.',
        match: (p: Product) => p.category?.slug === 'floor-tile' || p.tag?.toLowerCase().includes('floor') || p.title.toLowerCase().includes('floor')
    }
];

export default function SignatureCollection({ products }: SignatureCollectionProps) {
    const [activeTab, setActiveTab] = useState(SIGNATURE_CATEGORIES[0].id);

    // Filter products for each category
    const categoryData = useMemo(() => {
        return SIGNATURE_CATEGORIES.map(cat => {
            const matches = products.filter(cat.match);

            // Expand variants
            const items: DisplayProduct[] = matches.flatMap(p => {
                const categorySlug = p.category?.slug || 'products';

                if (p.variants && p.variants.length > 0) {
                    return p.variants.map((v: any, idx: number) => ({
                        _id: `${p._id}-${idx}`,
                        title: v.name,
                        subtitle: p.title, // Parent title as context
                        slug: p.slug, // Use parent slug for base URL
                        imageUrl: v.imageUrl || p.imageUrl,
                        categorySlug: categorySlug,
                        variantName: v.name,
                        family: v.family // Capture family for grouping
                    }));
                }

                return [{
                    _id: p._id,
                    title: p.title,
                    subtitle: cat.label,
                    slug: p.slug,
                    imageUrl: p.imageUrl || (p.variants && p.variants[0]?.imageUrl) || '',
                    categorySlug: categorySlug,
                    variantName: undefined,
                    family: undefined
                }];
            });

            // Smart Selection: Interleave by Family/Product to show variety
            // Especially for 'brick-tile' as requested
            let selectedItems = items;

            if (cat.id === 'brick-tile' && items.length > 0) {
                const groups: Record<string, DisplayProduct[]> = {};

                // Group by Family (priority) or Subtitle (Product Name)
                items.forEach(item => {
                    const key = item.family || item.subtitle || 'default';
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(item);
                });

                const groupKeys = Object.keys(groups);

                // Sort keys based on User Preference: Handmade -> Smooth -> Wirecut -> Textured
                const priorityOrder = ['handmade', 'smooth', 'wirecut', 'textured'];

                groupKeys.sort((a, b) => {
                    const aLower = a.toLowerCase();
                    const bLower = b.toLowerCase();

                    const aIndex = priorityOrder.findIndex(p => aLower.includes(p));
                    const bIndex = priorityOrder.findIndex(p => bLower.includes(p));

                    // If both found, sort by priority
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

                    // If only 'a' is in priority list, it comes first
                    if (aIndex !== -1) return -1;

                    // If only 'b' is in priority list, it comes first
                    if (bIndex !== -1) return 1;

                    return aLower.localeCompare(bLower);
                });

                const interleaved: DisplayProduct[] = [];
                // Sort keys to ensure consistent order (maybe prioritizing groups with more distinct images?)
                // For now, simple interleaving
                const maxLen = Math.max(...Object.values(groups).map(g => g.length));

                for (let i = 0; i < maxLen; i++) {
                    for (const key of groupKeys) {
                        const candidate = groups[key][i];
                        if (candidate) {
                            interleaved.push(candidate);
                        }
                    }
                }

                // FILTER FOR UNIQUE IMAGES
                // This ensures we don't show 4 cards with the exact same visual
                const seenImages = new Set<string>();
                const uniqueItems: DisplayProduct[] = [];

                for (const item of interleaved) {
                    // Normalize URL to handle potential query params differences if strictly needed, 
                    // but usually Sanity CDN URLs are stable.
                    if (item.imageUrl && !seenImages.has(item.imageUrl)) {
                        seenImages.add(item.imageUrl);
                        uniqueItems.push(item);
                    } else if (!item.imageUrl && !seenImages.has('placeholder')) {
                        // Allow at least one placeholder
                        seenImages.add('placeholder');
                        uniqueItems.push(item);
                    }
                }

                selectedItems = uniqueItems;
            }

            // Take top 4 for the smaller grid
            return {
                ...cat,
                items: selectedItems.slice(0, 4)
            };
        });
    }, [products]);

    const activeCategory = categoryData.find(c => c.id === activeTab) || categoryData[0];

    return (
        <section className="py-20 md:py-32 bg-[#Fbf9f7] overflow-hidden" id="signature-collection">
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
                            High-Performance <br /> Clay Systems
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
                                {activeCategory.items.map((item, index) => (
                                    <ProductCard
                                        key={item._id}
                                        product={item}
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

                            {/* View All - Bottom centered */}
                            <div className="mt-16 md:mt-24 text-center">
                                <Link
                                    href={`/products?category=${activeCategory.id}`}
                                    className="btn-link-dotted text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]"
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

function ProductCard({ product, index }: { product: DisplayProduct, index: number }) {
    const { title, subtitle, imageUrl, categorySlug, slug, variantName } = product;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
        >
            <Link
                href={`/products/${categorySlug || 'products'}/${slug}${variantName ? `?variant=${encodeURIComponent(variantName)}` : ''}`}
                className="block h-full"
            >
                {/* Image Card - Increased Radius & Smaller Aspect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4 shadow-sm group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-3xl border border-transparent group-hover:border-[var(--line)]">
                    {imageUrl ? (
                        <>
                            <PremiumImage
                                src={imageUrl}
                                alt={title}
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                                containerClassName="absolute inset-0 w-full h-full"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[var(--ink)]/20 bg-[var(--sand)]/20">
                            <span className="font-serif italic text-xs">Image Coming Soon</span>
                        </div>
                    )}

                    {/* Floating Action Button */}
                    <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-10">
                        <span className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg text-[var(--ink)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </div>

                {/* Minimal Info */}
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-500 px-2">
                    <h4 className="text-lg font-serif text-[var(--ink)] mb-1 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">
                        {title}
                    </h4>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink)]/40 font-bold line-clamp-1 mt-1">
                        {subtitle}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
