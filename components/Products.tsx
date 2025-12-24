'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import PremiumImage from './PremiumImage';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { useSampleBox } from '@/context/SampleContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProductFilter, FilterState } from '@/hooks/useProductFilter';
import FilterBar from './FilterBar';
import { toSlug } from '@/lib/utils';


interface ProductsProps {
    products: Product[];
    featuredOnly?: boolean;
}

// Interface for display items
interface DisplayItem {
    name: string;
    imageUrl: string | undefined;
    slug: string;
    variantName?: string;
    categorySlug: string;
    color: string;
    tag: string;
    priceRange: string;
    range?: string;
}

export default function Products({ products, featuredOnly }: ProductsProps) {
    const { addToBox } = useSampleBox();
    const searchParams = useSearchParams();

    // Use the custom filter hook
    const {
        filters,
        setCategory,
        toggleColor,
        toggleApplication,
        setSeries,
        setSize,
        setSearchTerm,
        filteredProducts,
        options
    } = useProductFilter(products);

    // Group actions for FilterBar
    const actions = {
        setCategory,
        toggleColor,
        toggleApplication,
        setSeries,
        setSize,
        setSearchTerm
    };

    // Initial Sync with URL (Category only for now)
    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Legacy mapping or direct match
            const slugMap: Record<string, string> = {
                'exposed-bricks': 'Exposed Brick',
                'brick-walls': 'Brick Tiles',
                'jaali': 'Jaali',
                'floor-tiles': 'Floor Tiles',
                'roof-tiles': 'Roof Tiles',
            };

            // If the current filter is already set, don't loop
            if (filters.category === (slugMap[catParam] || catParam)) return;

            if (slugMap[catParam]) {
                actions.setCategory(slugMap[catParam]);
            } else {
                // Try to find matching category from options? 
                // We'll just trust the param matching logic for now
                // Find category name that matches slug
                const allCats = Array.from(new Set(products.map(p => p.category?.title || p.tag || 'Uncategorized')));
                const match = allCats.find(c => toSlug(c) === catParam || c === catParam);
                if (match) actions.setCategory(match);
            }
        }
    }, [searchParams]);

    // Derived Categories List for Tabs
    const uniqueCategories = React.useMemo(() =>
        Array.from(new Set(products.map(p => p.category?.title || p.tag || 'Uncategorized')))
            .filter(c => c !== 'Uncategorized')
            .sort()
        , [products]);


    // TRANSFORM PRODUCTS TO DISPLAY ITEMS
    const variantsToShow: DisplayItem[] = React.useMemo(() => {
        return filteredProducts.flatMap((product): DisplayItem[] => {
            const categorySlug = product.category?.slug || toSlug(product.tag || 'uncategorized');

            // Logic: Which variants to show?
            // If colors filter is active, show only variants matching those colors.
            // If series filter is active, products are already filtered by hook.

            let relevantVariants = product.variants || [];

            // Filter variants by color if color filter is active
            if (filters.colors.length > 0) {
                relevantVariants = relevantVariants.filter(v => filters.colors.includes(v.color || ''));
            }

            // If we have relevant variants, show them individually
            if (relevantVariants.length > 0) {
                return relevantVariants.map(v => ({
                    name: v.name,
                    imageUrl: v.imageUrl || product.imageUrl,
                    slug: product.slug,
                    variantName: v.name,
                    categorySlug: categorySlug,
                    color: v.color || '#e6d5c9',
                    tag: product.title,
                    priceRange: product.priceRange,
                    range: product.range
                }));
            }

            // Fallback: If no variants match (shouldn't happen if product passed filter, unless product has NO variants but matched via other props?)
            // Or if product has no variants defined at all, show main product.
            const displayImage = product.imageUrl || (product.variants && product.variants[0]?.imageUrl) || '';

            return [{
                name: product.title,
                imageUrl: displayImage,
                slug: product.slug,
                variantName: undefined,
                categorySlug: categorySlug,
                color: '#e6d5c9',
                tag: product.category?.title || product.tag || 'General',
                priceRange: product.priceRange,
                range: product.range
            }];
        });
    }, [filteredProducts, filters.colors]);


    return (
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">

            {/* HEADer */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-3 block">
                    {featuredOnly ? 'Curated Collections' : 'Material Library'}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">
                    {featuredOnly ? 'Signature Clay Products' : 'Explore Our Range'}
                </h2>

                {/* Breadcrumb only if filtering */}
                {!featuredOnly && filters.category !== 'All' && (
                    <div className="flex justify-center mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a6f66]/60">
                        <Link href="/" className="hover:text-[var(--terracotta)] transition-colors">Home</Link>
                        <span className="mx-3">/</span>
                        <span className="text-[var(--terracotta)]">{filters.category}</span>
                    </div>
                )}
            </motion.div>

            {/* NEW FILTER BAR */}
            {!featuredOnly && (
                <FilterBar
                    filters={filters}
                    actions={actions}
                    options={options}
                    categories={uniqueCategories}
                    productCount={variantsToShow.length}
                />
            )}

            {/* RESULTS GRID */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={filters.category + filters.series} // Re-animate on major context switch
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {(() => {
                        if (variantsToShow.length === 0) {
                            return (
                                <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 text-lg">No materials match your criteria.</p>
                                    <button onClick={() => actions.setCategory('All')} className="mt-4 text-[var(--terracotta)] hover:underline">Clear Filters</button>
                                </div>
                            );
                        }

                        // Grouping Logic (Preserved)
                        const grouped = variantsToShow.reduce((acc, variant) => {
                            const rangeName = variant.range || 'General Collection';
                            if (!acc[rangeName]) acc[rangeName] = [];
                            acc[rangeName].push(variant);
                            return acc;
                        }, {} as Record<string, DisplayItem[]>);

                        const sortedRanges = Object.keys(grouped).sort((a, b) => {
                            if (a === 'General Collection') return 1;
                            if (b === 'General Collection') return -1;
                            return a.localeCompare(b);
                        });

                        return (
                            <div className="space-y-16">
                                {/* Range Navigation */}
                                {sortedRanges.length > 1 && (
                                    <div className="flex flex-wrap gap-4 mb-16">
                                        {sortedRanges.map(range => (
                                            <button
                                                key={range}
                                                onClick={() => {
                                                    const el = document.getElementById(`range-${toSlug(range)}`);
                                                    if (el) {
                                                        // Use scrollIntoView with scroll-margin handling via CSS
                                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                                    const showHeader = !featuredOnly && (sortedRanges.length > 1 || rangeName !== 'General Collection');

                                    return (
                                        <div
                                            key={rangeName}
                                            id={`range-${toSlug(rangeName)}`}
                                            className="scroll-mt-40" // Add scroll margin to account for sticky header + filter bar
                                        >
                                            {showHeader && (
                                                <div className="flex items-end gap-6 mb-10 pt-6">
                                                    <h3 className="text-xl md:text-2xl font-serif text-[#2A1E16] leading-none">
                                                        {rangeName}
                                                    </h3>
                                                    <div className="h-px bg-[#EBE5E0] flex-1 mb-2"></div>
                                                </div>
                                            )}

                                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 ${featuredOnly ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
                                                {variants.map((variant, index) => (
                                                    <div key={`${variant.slug}-${index}`} className="group block h-full">
                                                        <Link
                                                            href={`/products/${variant.categorySlug}/${variant.slug}${variant.variantName ? `?variant=${encodeURIComponent(variant.variantName)}` : ''}`}
                                                            className="flex flex-col h-full"
                                                        >
                                                            {/* Image Card */}
                                                            <div className="aspect-[4/5] rounded-[2rem] mb-6 relative overflow-hidden bg-[#f4f1ee] group-hover:shadow-xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
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
                                                                    <div className="absolute inset-0 bg-gray-200" />
                                                                )}

                                                                {/* Hover Actions */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        addToBox({
                                                                            id: variant.slug + '-' + variant.name,
                                                                            name: variant.name,
                                                                            color: variant.color,
                                                                            texture: variant.imageUrl ? `url('${variant.imageUrl}')` : variant.color
                                                                        });
                                                                    }}
                                                                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur text-[var(--ink)] shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-[var(--terracotta)] hover:text-white flex items-center justify-center z-20"
                                                                    title="Add Sample"
                                                                >
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                                                </button>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="text-center px-2 group-hover:-translate-y-1 transition-transform duration-500">
                                                                <h3 className="text-lg font-serif text-[#2A1E16] mb-2 group-hover:text-[var(--terracotta)] transition-colors line-clamp-1">
                                                                    {variant.name}
                                                                </h3>
                                                                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#7a6f66]/60 border border-[#e9e2da] px-2 py-1 rounded-full">
                                                                    {variant.tag}
                                                                </span>
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

            {/* View All CTA (Featured Only) */}
            {featuredOnly && (
                <div className="text-center mt-20">
                    <Link
                        href={`/products`}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[var(--line)] text-[#2A1E16] rounded-full text-sm font-medium hover:bg-[#2A1E16] hover:text-white transition-all shadow-sm hover:shadow-lg group"
                    >
                        Explore Material Library
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            )}
        </section>
    );
}
