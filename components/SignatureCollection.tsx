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
        id: 'terracotta-panels',
        label: 'Facade Systems',
        subtitle: 'Rainscreen Facades',
        description: 'Large-format, precision-engineered terracotta facade systems designed for high-rise thermal efficiency and zero-failure longevity.',
        match: (p: Product) => {
            const title = p.title?.toLowerCase() || '';
            const catSlug = p.category?.slug?.toLowerCase() || '';
            return title.includes('panel') || title.includes('facade') || catSlug.includes('panel') || catSlug.includes('facade');
        }
    },
    {
        id: 'exposed-brick',
        label: 'Exposed Brick',
        subtitle: 'Structural Masonry',
        description: 'High-precision full-depth clay bricks engineered for load-bearing and self-supporting facades with zero efflorescence.',
        match: (p: Product) => {
            const title = p.title?.toLowerCase() || '';
            const catSlug = p.category?.slug?.toLowerCase() || '';
            const isFlex = title.includes('flexible') || catSlug.includes('flexible');
            const isTile = title.includes('tile') || catSlug.includes('tile');
            if (isFlex || isTile) return false;
            return catSlug === 'exposed-brick' || catSlug === 'exposed-bricks' || title.includes('exposed');
        }
    },
    {
        id: 'flexible-brick-tiles',
        label: 'Flexible Brick Tiles',
        subtitle: 'Ultra-Thin Cladding',
        description: 'Advanced 3mm bendable clay tiles that wrap around columns and curved facades with authentic brick texture and zero load.',
        match: (p: Product) => {
            const title = p.title?.toLowerCase() || '';
            const catSlug = p.category?.slug?.toLowerCase() || '';
            return title.includes('flexible') || catSlug.includes('flexible');
        }
    },
    {
        id: 'handmade-brick-tiles',
        label: 'Handmade Brick Tiles',
        subtitle: 'Artisanal Cladding',
        description: 'Individually hand-moulded brick veneers that capture the raw, organic beauty of traditional earth-fired ceramics.',
        match: (p: Product) => {
            const title = p.title?.toLowerCase() || '';
            const catSlug = p.category?.slug?.toLowerCase() || '';
            return title.includes('handmade') || catSlug.includes('handmade');
        }
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
        <section className="section-padding overflow-hidden" id="signature-collection">
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
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            System Specifications
                        </span>
                        <h2 className="mb-4">
                            Engineered Facade <br /> & Cladding Systems
                        </h2>
                    </motion.div>

                    {/* TABS NAVIGATION - Premium Typography / Editorial Style */}
                    <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 mb-4 md:mb-8">
                        <motion.nav
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-nowrap md:flex-wrap md:justify-center items-baseline gap-x-6 md:gap-x-8 gap-y-4 min-w-max md:min-w-0"
                        >
                            {categoryData.map((cat, i) => (
                                <React.Fragment key={cat.id}>
                                    {/* Divider - Subtle Dot */}
                                    {i > 0 && (
                                        <span className="hidden md:block text-[var(--ink)]/10 text-xs">•</span>
                                    )}
                                    <button
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`
                                            relative transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group
                                            ${activeTab === cat.id
                                                ? 'text-xl md:text-[28px] font-serif text-[var(--ink)] italic font-semibold'
                                                : 'text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ink)]/40 hover:text-[var(--ink)]/80'}
                                        `}
                                    >
                                        <span className="relative z-10 whitespace-nowrap">{cat.label}</span>

                                        {/* Active Underline - Elegant & Thin */}
                                        {activeTab === cat.id && (
                                            <motion.div
                                                layoutId="active-tab-line"
                                                className="absolute -bottom-2 md:-bottom-4 left-0 right-0 h-[1px] bg-[var(--terracotta)]"
                                                transition={{ duration: 0.5, ease: "circOut" }}
                                            />
                                        )}
                                    </button>
                                </React.Fragment>
                            ))}
                        </motion.nav>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode='wait'>
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
                            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
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
                                    href={`/${activeCategory.id}`}
                                    className="btn-link-dotted text-[10px] md:text-xs font-extrabold uppercase tracking-[0.2em]"
                                >
                                    Explore {activeCategory.label} Pillar
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
            className="group relative w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.5rem)]"
        >
            <Link
                href={`/products/${categorySlug || 'products'}/${slug}${variantName ? `?variant=${encodeURIComponent(variantName)}` : ''}`}
                className="block h-full bg-transparent rounded-3xl p-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] border-none hover:-translate-y-2"
            >
                {/* Image Card - Increased Radius & Smaller Aspect */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--background)] mb-4 rounded-xl md:rounded-2xl">
                    {imageUrl ? (
                        <>
                            <PremiumImage
                                src={imageUrl}
                                alt={`${title} ${subtitle} - Exposed Brick & Flexible Terracotta Panels by UrbanClay`}
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
                        <span className="h-8 w-8 bg-[var(--background)] rounded-full flex items-center justify-center shadow-lg text-[var(--foreground)]">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </div>

                {/* Minimal Info */}
                <div className="text-center group-hover:-translate-y-1 transition-transform duration-500">
                    <h3 className="text-xl font-serif text-[var(--ink)] font-semibold mb-2 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">
                        {title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--ink)]/40 font-extrabold line-clamp-1 mt-0">
                        {subtitle}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
