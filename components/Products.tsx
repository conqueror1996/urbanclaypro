'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PremiumImage from './PremiumImage';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';

import { useSearchParams, useRouter } from 'next/navigation';

interface ProductsProps {
    products: Product[];
    featuredOnly?: boolean;
}

// Interface for display items
interface DisplayItem {
    name: string;
    imageUrl: string;
    slug: string;
    variantName?: string;
    categorySlug: string;
    color: string;
    tag: string;
    priceRange: string;
    range?: string;
}

// Utility to clean strings for slugs
const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export default function Products({ products, featuredOnly }: ProductsProps) {
    const { addToBox } = useSampleBox();
    const searchParams = useSearchParams();
    const router = useRouter();

    // 1. DYNAMIC CATEGORY EXTRACTION
    // Extract unique categories from actual products to auto-generate tabs
    const uniqueCategories = Array.from(new Set(products.map(p => {
        // Preferred: Referenced Category Title, Fallback: Legacy Tag
        return p.category?.title || p.tag || 'Uncategorized';
    }))).filter(c => c !== 'Uncategorized').sort();

    // 2. BUILD TABS DYNAMICALLY
    const tabs = [
        { name: 'All', filter: 'All' },
        ...uniqueCategories.map(cat => ({ name: cat, filter: cat }))
    ];

    // Initialize from URL or default to All
    const [activeTab, setActiveTab] = useState(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Map URL slugs to Tab Names - Still helpful for legacy/external links
            const slugMap: Record<string, string> = {
                'exposed-bricks': 'Exposed Brick',
                'brick-walls': 'Brick Tiles',
                'jaali': 'Jaali',
                'floor-tiles': 'Floor Tiles',
                'roof-tiles': 'Roof Tiles',
                // Generic fallback: capitalize slug
            };

            if (slugMap[catParam]) return slugMap[catParam];

            // Fuzzy match against dynamic tabs
            const match = tabs.find(t =>
                t.name === catParam ||
                t.name.toLowerCase() === catParam.toLowerCase() ||
                toSlug(t.name) === catParam
            );
            if (match) return match.name;
        }
        return 'All';
    });


    // Sync tab with URL changes
    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            const slugMap: Record<string, string> = {
                'exposed-bricks': 'Exposed Brick', // Legacy support
                'brick-walls': 'Brick Tiles',
                'jaali': 'Jaali',
                'floor-tiles': 'Floor Tiles',
                'roof-tiles': 'Roof Tiles',
            };

            if (slugMap[catParam]) {
                setActiveTab(slugMap[catParam]);
            } else {
                const match = tabs.find(t =>
                    t.name === catParam ||
                    t.name.toLowerCase() === catParam.toLowerCase() ||
                    toSlug(t.name) === catParam
                );
                if (match) setActiveTab(match.name);
            }
        } else {
            // Optional: Reset to 'All' if no param? Or keep current?
            // Usually keeping current is better if user just removed param, but for navigation it implies 'All' usually.
            // Given the 'redirect at proper page' requirement, explicit navigation usually includes the param.
        }
    }, [searchParams, tabs]);
    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };



    // 3. DYNAMIC FILTERING LOGIC
    const matchingProducts = products.filter(p => {
        if (activeTab === 'All') return true;
        const pCategory = p.category?.title || p.tag;
        return pCategory === activeTab;
    });

    // Map Products to Display Items (Series View)
    const variantsToShow: DisplayItem[] = matchingProducts.flatMap((product): DisplayItem[] => {
        const categorySlug = product.category?.slug || toSlug(product.tag || 'uncategorized');

        // If specific category selected, show individual variants
        if (activeTab !== 'All' && product.variants && product.variants.length > 0) {
            return product.variants.map(v => ({
                name: v.name,
                imageUrl: v.imageUrl || product.imageUrl,
                slug: product.slug,
                variantName: v.name, // Pass specific variant name
                categorySlug: categorySlug,
                color: v.color || '#e6d5c9',
                tag: product.title, // Show parent product name as tag context
                priceRange: product.priceRange,
                range: product.range
            }));
        }

        // Default: Show Main Product
        const displayImage = product.imageUrl || (product.variants && product.variants[0]?.imageUrl) || '';

        return [{
            name: product.title,
            imageUrl: displayImage,
            slug: product.slug,
            variantName: undefined,
            categorySlug: categorySlug,
            color: '#e6d5c9',
            tag: product.category?.title || product.tag, // Use consistent category title
            priceRange: product.priceRange,
            range: product.range
        }];
    });

    return (
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            {/* HEADER */}
            <motion.div
                className="text-center mb-12 md:mb-20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 block">
                    {featuredOnly ? 'Curated Collections' : 'Complete Catalogue'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">
                    {featuredOnly ? 'Signature Clay Products' : 'Explore Our Range'}
                </h2>

                {/* DYNAMIC BREADCRUMB FOR CATEGORY */}
                {!featuredOnly && (
                    <div className="flex justify-center mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a6f66]/60">
                        <Link href="/" className="hover:text-[var(--terracotta)] transition-colors">Home</Link>
                        <span className="mx-3">/</span>
                        <Link href="/products" className="hover:text-[var(--terracotta)] transition-colors">Products</Link>
                        <span className="mx-3">/</span>
                        <span className="text-[var(--terracotta)]">{activeTab}</span>
                    </div>
                )}
            </motion.div>

            {/* TABS - Totem Style - MOBILE OPTIMIZED */}
            <div className="flex justify-center mb-16">
                <div className={`
                        inline-flex bg-white p-1.5 rounded-full border border-[var(--line)] shadow-sm
                        overflow-x-auto max-w-full scrollbar-hide
                        ${!featuredOnly ? 'justify-start md:justify-center' : ''}
                    `}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <button
                                key={tab.name}
                                onClick={() => handleTabClick(tab.name)}
                                className={`relative px-5 py-3 md:px-6 md:py-3 min-h-[48px] rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap flex-shrink-0 z-10 active:scale-95 flex items-center justify-center ${isActive ? 'text-white' : 'text-[#5d554f] hover:text-[#2A1E16] hover:bg-gray-50'
                                    }`}
                                aria-label={`Filter by ${tab.name}`}
                                aria-pressed={isActive}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-[#2A1E16] rounded-full shadow-md -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {tab.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* GRID */}
            <AnimatePresence>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {(() => {
                        // Group variants by range
                        const grouped = variantsToShow.reduce((acc, variant: DisplayItem) => {
                            const rangeName = variant.range || 'General Collection';
                            if (!acc[rangeName]) acc[rangeName] = [];
                            acc[rangeName].push(variant);
                            return acc;
                        }, {} as Record<string, DisplayItem[]>);

                        // If "All" tab or featured only, maybe stick to flat list or keep grouped? 
                        // User request implies they want to see ranges. Grouping is safer.
                        // Order ranges: specific ones first, 'General Collection' last
                        const sortedRanges = Object.keys(grouped).sort((a, b) => {
                            if (a === 'General Collection') return 1;
                            if (b === 'General Collection') return -1;
                            return a.localeCompare(b);
                        });

                        if (variantsToShow.length === 0) {
                            return (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-400 text-lg">No products found in this category.</p>
                                </div>
                            );
                        }

                        // Check if we effectively just have one group (e.g. all are General)
                        // If so, don't show the header to keep it clean, unless we just want consistency.
                        // But for "General Collection" specifically, we might want to hide the header if it's the only one.

                        return (
                            <div className="space-y-16">
                                {/* QUICK LINKS - Jump to specific collection */}
                                {!featuredOnly && sortedRanges.length > 1 && (
                                    <div className="flex flex-wrap gap-4 justify-center mb-16 -mt-4 animate-fade-in border-b border-[#EBE5E0] pb-10">
                                        <div className="w-full text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#9C8C74] mb-4">
                                            Jump to Collection
                                        </div>
                                        {sortedRanges.map(range => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    const el = document.getElementById(`range-${toSlug(range)}`);
                                                    if (el) {
                                                        const offset = 100;
                                                        const bodyRect = document.body.getBoundingClientRect().top;
                                                        const elementRect = el.getBoundingClientRect().top;
                                                        const elementPosition = elementRect - bodyRect;
                                                        const offsetPosition = elementPosition - offset;

                                                        window.scrollTo({
                                                            top: offsetPosition,
                                                            behavior: 'smooth'
                                                        });
                                                    }
                                                }}
                                                className="min-h-[48px] px-5 py-3 rounded-xl border-2 border-[#EBE5E0] bg-white text-xs font-bold text-[#2A1E16] hover:border-[#2A1E16] hover:shadow-lg transition-all uppercase tracking-wider transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
                                                aria-label={`Jump to ${range} collection`}
                                            >
                                                {range}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {sortedRanges.map(rangeName => {
                                    const variants = grouped[rangeName];
                                    const showHeader = sortedRanges.length > 1 || rangeName !== 'General Collection';

                                    return (
                                        <div key={rangeName} id={`range-${toSlug(rangeName)}`}>
                                            {showHeader && (
                                                <div className="flex items-end gap-6 mb-10 pt-6">
                                                    <h3 className="text-2xl md:text-3xl font-serif text-[#2A1E16] leading-none">
                                                        {rangeName}
                                                    </h3>
                                                    <div className="h-px bg-[#EBE5E0] flex-1 mb-2"></div>
                                                    <span className="text-[10px] font-bold text-[#9C8C74] uppercase tracking-widest mb-2">
                                                        {variants.length} Selection{variants.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            )}

                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 ${featuredOnly ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                                                {variants.map((variant, index) => (
                                                    <div key={`${rangeName}-${index}`} className="group block h-full">
                                                        <Link
                                                            href={`/products/${variant.categorySlug}/${variant.slug}${variant.variantName ? `?variant=${encodeURIComponent(variant.variantName)}` : ''}`}
                                                            className="flex flex-col h-full"
                                                        >
                                                            {/* Image Card - Consistent Radius */}
                                                            <div className="aspect-[4/5] rounded-[2rem] mb-6 relative overflow-hidden bg-[#f4f1ee] group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
                                                                {/* Show Image if available, else Texture Overlay */}
                                                                {variant.imageUrl ? (
                                                                    <PremiumImage
                                                                        src={variant.imageUrl}
                                                                        alt={variant.name}
                                                                        fill
                                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                                        className="object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
                                                                        containerClassName="w-full h-full"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <div className="absolute inset-0 opacity-20 mix-blend-multiply"
                                                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                                    </>
                                                                )}

                                                                {/* Floating Add to Box - MOBILE OPTIMIZED */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        addToBox({
                                                                            id: variant.slug + '-' + variant.name,
                                                                            name: variant.name,
                                                                            color: variant.color || '#b45a3c',
                                                                            texture: variant.imageUrl ? `url('${variant.imageUrl}')` : (variant.color || '#b45a3c')
                                                                        });
                                                                    }}
                                                                    className="absolute top-4 right-4 min-w-[48px] min-h-[48px] w-12 h-12 rounded-full bg-white/90 backdrop-blur text-[var(--ink)] shadow-lg opacity-0 translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--terracotta)] hover:text-white flex items-center justify-center z-20 active:scale-95 touch-target md:opacity-0 opacity-100"
                                                                    title="Add Sample"
                                                                    aria-label={`Add ${variant.name} to sample box`}
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                </button>

                                                                {/* View Details Badge */}
                                                                <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                                    <span className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg text-[var(--ink)]">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Minimal Info - Centered Family Style */}
                                                            <div className="text-center px-2 group-hover:-translate-y-1 transition-transform duration-500">
                                                                <h3 className="text-xl font-serif text-[#2A1E16] mb-2 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">
                                                                    {variant.name}
                                                                </h3>

                                                                <div className="flex justify-center gap-2">
                                                                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#7a6f66]/60 border border-[#e9e2da] px-2 py-1 rounded-full">
                                                                        {variant.tag}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </motion.div>
            </AnimatePresence>

            {/* VIEW ALL CTA */}
            {featuredOnly && (
                <div className="text-center mt-20">
                    <Link
                        href={`/products`}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[var(--line)] text-[#2A1E16] rounded-full text-sm font-medium hover:bg-[#2A1E16] hover:text-white transition-all shadow-sm hover:shadow-lg group"
                    >
                        Explore Full Catalogue
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            )}
        </section>
    );
}
