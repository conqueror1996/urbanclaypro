'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ProductsPageAnimateProps {
    products: Product[];
}

// Utility to clean strings for slugs
const toSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export default function ProductsPageAnimate({ products }: ProductsPageAnimateProps) {
    const { addToBox } = useSampleBox();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1. EXTRACT CATEGORIES
    const uniqueCategories = useMemo(() => {
        return Array.from(new Set(products.map(p => {
            return p.category?.title || p.tag || 'Uncategorized';
        }))).filter(c => c !== 'Uncategorized').sort();
    }, [products]);

    const tabs = useMemo(() => [
        { name: 'All', filter: 'All' },
        ...uniqueCategories.map(cat => ({ name: cat, filter: cat }))
    ], [uniqueCategories]);

    // 2. ACTIVE TAB STATE
    const [activeTab, setActiveTab] = useState('All');

    // Sync activeTab with URL params
    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Simple fuzzy match
            const match = tabs.find(t =>
                t.name === catParam ||
                toSlug(t.name) === catParam ||
                t.name.toLowerCase() === catParam.toLowerCase()
            );
            if (match) {
                setActiveTab(match.name);
            }
        } else {
            setActiveTab('All');
        }
    }, [searchParams, tabs]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);

        const params = new URLSearchParams(searchParams.toString());
        if (tabName === 'All') {
            params.delete('category');
        } else {
            params.set('category', toSlug(tabName));
        }

        // Update URL to allow sharing
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // 3. FILTER LOGIC
    const matchingProducts = products.filter(p => {
        if (activeTab === 'All') return true;
        return (p.category?.title || p.tag) === activeTab;
    });

    return (
        <div className="bg-[#1a1512] min-h-screen text-[#EBE5E0]">
            <Header />

            <main className="pt-32 pb-20 px-6 max-w-[1800px] mx-auto min-h-screen">

                {/* --- CATALOG HEADER --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                            Material Library
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif text-[#EBE5E0] leading-[0.9]">
                            The<br />Archive
                        </h1>
                    </div>
                    <div className="max-w-md text-white/40 text-sm leading-loose md:text-right">
                        <p>Explore our curated collection of handcrafted terracotta, designed for the modern architectural vernacular.</p>
                    </div>
                </div>

                {/* --- FILTERS (Premium Navbar Style) --- */}
                <div className="sticky top-20 md:top-24 z-30 mb-8 md:mb-20 -mx-6 px-4 md:px-6">
                    <div className="bg-white py-4 md:py-6 px-4 md:px-12 rounded-xl md:rounded-lg shadow-sm border border-gray-100">
                        {/* Mobile: Horizontal Scroll */}
                        <div className="flex md:hidden gap-3 overflow-x-auto pb-2 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {/* Categories - Mobile */}
                            <div className="flex-shrink-0 w-40">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                                    Categories
                                </label>
                                <div className="relative">
                                    <select
                                        value={activeTab}
                                        onChange={(e) => handleTabClick(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-xs font-semibold text-[#2A1E16] appearance-none cursor-pointer shadow-sm"
                                    >
                                        {tabs.map((tab) => (
                                            <option key={tab.name} value={tab.name}>
                                                {tab.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Series - Mobile */}
                            <div className="flex-shrink-0 w-32">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                                    Series
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-xs font-semibold text-[#2A1E16] appearance-none cursor-pointer shadow-sm">
                                        <option>Smooth</option>
                                        <option>Textured</option>
                                        <option>Rustic</option>
                                        <option>Modern</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Color - Mobile */}
                            <div className="flex-shrink-0 w-32">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                                    Color
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-xs font-semibold text-[#2A1E16] appearance-none cursor-pointer shadow-sm">
                                        <option>Any color</option>
                                        <option>Red</option>
                                        <option>Brown</option>
                                        <option>Beige</option>
                                        <option>Gray</option>
                                        <option>Black</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Budget - Mobile */}
                            <div className="flex-shrink-0 w-36">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">
                                    Budget
                                </label>
                                <div className="relative">
                                    <select className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-xs font-semibold text-[#2A1E16] appearance-none cursor-pointer shadow-sm">
                                        <option>All</option>
                                        <option>Low</option>
                                        <option>Mid</option>
                                        <option>High</option>
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Desktop: Premium Navbar Style */}
                        <div className="hidden md:flex items-center justify-between gap-8">
                            {/* Categories Dropdown */}
                            <div className="flex-1">
                                <div className="relative group">
                                    <select
                                        value={activeTab}
                                        onChange={(e) => handleTabClick(e.target.value)}
                                        className="w-full px-6 py-3 bg-transparent border border-gray-200 rounded-lg text-center text-sm font-medium text-[#2A1E16] appearance-none cursor-pointer transition-all hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20"
                                    >
                                        {tabs.map((tab) => (
                                            <option key={tab.name} value={tab.name}>
                                                {tab.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--terracotta)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-gray-200"></div>

                            {/* Series Dropdown */}
                            <div className="flex-1">
                                <div className="relative group">
                                    <select
                                        className="w-full px-6 py-3 bg-transparent border border-gray-200 rounded-lg text-center text-sm font-medium text-[#2A1E16] appearance-none cursor-pointer transition-all hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20"
                                    >
                                        <option value="">Series</option>
                                        <option>Smooth</option>
                                        <option>Textured</option>
                                        <option>Rustic</option>
                                        <option>Modern</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--terracotta)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-gray-200"></div>

                            {/* Color Dropdown */}
                            <div className="flex-1">
                                <div className="relative group">
                                    <select
                                        className="w-full px-6 py-3 bg-transparent border border-gray-200 rounded-lg text-center text-sm font-medium text-[#2A1E16] appearance-none cursor-pointer transition-all hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20"
                                    >
                                        <option value="">Color</option>
                                        <option>Red</option>
                                        <option>Brown</option>
                                        <option>Beige</option>
                                        <option>Gray</option>
                                        <option>Black</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--terracotta)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-8 w-px bg-gray-200"></div>

                            {/* Budget Range Dropdown */}
                            <div className="flex-1">
                                <div className="relative group">
                                    <select
                                        className="w-full px-6 py-3 bg-transparent border border-gray-200 rounded-lg text-center text-sm font-medium text-[#2A1E16] appearance-none cursor-pointer transition-all hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/20"
                                    >
                                        <option value="">Budget Range</option>
                                        <option>Low (₹40-60/sq.ft)</option>
                                        <option>Mid (₹60-100/sq.ft)</option>
                                        <option>High (₹100+/sq.ft)</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-[var(--terracotta)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- PRODUCTS DISPLAY --- */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={activeTab === 'All' ? "space-y-32" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16"}
                    >
                        {/* SCENARIO 1: HIERARCHICAL VIEW (When 'All' tab is active) */}
                        {activeTab === 'All' ? (
                            Object.entries(
                                matchingProducts.reduce((acc, p) => {
                                    const cat = p.category?.title || p.tag || 'Uncategorized';
                                    if (!acc[cat]) acc[cat] = [];
                                    acc[cat].push(p);
                                    return acc;
                                }, {} as Record<string, Product[]>)
                            ).sort().map(([category, categoryProducts]) => (
                                <div key={category} className="section-category">
                                    {/* CATEGORY HEADER */}
                                    <div className="flex items-end gap-6 mb-12 border-b border-white/10 pb-6">
                                        <h2 className="text-5xl md:text-7xl font-serif text-white font-bold uppercase tracking-tighter leading-none select-none">
                                            {category.split(' ')[0]}
                                        </h2>
                                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-4 ml-[-20px] bg-[#1a1512] px-2 z-10">
                                            {category}
                                        </span>
                                    </div>

                                    <div className="space-y-20">
                                        {categoryProducts.map((product) => (
                                            <div key={product._id} className="section-series">
                                                {/* SERIES HEADER */}
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></div>
                                                    <h3 className="text-2xl md:text-3xl font-serif text-[#EBE5E0]">
                                                        {product.title} <span className="text-white/30 text-lg font-sans font-light italic ml-2">Series</span>
                                                    </h3>
                                                    <div className="h-px bg-white/5 flex-1 ml-4" />
                                                    <Link
                                                        href={`/products/${product.category?.slug || 'collection'}/${product.slug}`}
                                                        className="text-white/30 text-[10px] font-bold uppercase tracking-widest hover:text-[var(--terracotta)] transition-colors"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>

                                                {/* VARIANTS GRID */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
                                                    {(product.variants && product.variants.length > 0 ? product.variants : [{
                                                        _key: 'main',
                                                        name: 'Standard',
                                                        imageUrl: product.imageUrl,
                                                        badge: null
                                                    }]).map((variant: any, idx: number) => (
                                                        <Link
                                                            key={`${product._id}-${idx}`}
                                                            href={`/products/${product.category?.slug || 'collection'}/${product.slug}${variant.name !== 'Standard' ? `?variant=${encodeURIComponent(variant.name)}` : ''}`}
                                                            className="group flex flex-col"
                                                        >
                                                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#241e1a] mb-4 border border-white/5 group-hover:border-[var(--terracotta)]/50 transition-colors shadow-lg">
                                                                {variant.imageUrl ? (
                                                                    <Image
                                                                        src={variant.imageUrl}
                                                                        alt={variant.name}
                                                                        fill
                                                                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                                        suppressHydrationWarning
                                                                    />
                                                                ) : (
                                                                    <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs tracking-widest uppercase">
                                                                        No Image
                                                                    </div>
                                                                )}

                                                                {variant.badge && (
                                                                    <div className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-bold uppercase text-white rounded shadow-sm z-20 ${variant.badge === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                                                        {variant.badge}
                                                                    </div>
                                                                )}

                                                                {/* Small Cute Add to Sample Button - Hover Only */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        addToBox({
                                                                            id: product.slug,
                                                                            name: `${product.title} - ${variant.name}`,
                                                                            color: '#b45a3c',
                                                                            texture: variant.imageUrl ? `url('${variant.imageUrl}')` : '#b45a3c'
                                                                        });
                                                                    }}
                                                                    className="absolute bottom-2 right-2 z-30 w-7 h-7 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:from-[var(--terracotta)]/30 hover:to-[var(--terracotta)]/20 hover:border-[var(--terracotta)]/50 hover:scale-110 active:scale-95 transition-all duration-300"
                                                                    title="Add to Sample Box"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </button>

                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                                            </div>

                                                            <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 px-2">
                                                                <h4 className="text-sm font-bold text-white mb-1">{variant.name}</h4>
                                                                <p className="text-[10px] text-[var(--terracotta)]/80 uppercase tracking-widest">{product.title}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* SCENARIO 2: FLAT GRID (When specific filtered tab is active) */
                            /* BUT wait, user probably also wants the sub-variants to be visible even in filtered view */
                            /* Let's stick to the hierarchical series breakdown BUT flatten the Category grouping since only 1 category is active. */
                            /* Actually, the prompt says "only for products page when the navigation is on (All)". */
                            /* This implies standard filtered view for other tabs. */
                            /* HOWEVER, standard filtered view currently only shows PRODUCTS, not variants. */
                            /* If user wants to see subvariants even in filtered view, we should use the same 'Series' card style logic but without the category wrapper. */

                            /* Let's implement the grouped Series view for the filtered category too, just without the Category Header. */

                            matchingProducts.map((product) => (
                                <div key={product._id} className="col-span-full mb-12">
                                    {/* SERIES HEADER */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <h3 className="text-2xl font-serif text-[#EBE5E0]">
                                            {product.title} <span className="text-white/30 text-lg font-sans font-light italic ml-2">Series</span>
                                        </h3>
                                        <div className="h-px bg-white/5 flex-1 ml-4" />
                                    </div>

                                    {/* VARIANTS GRID */}
                                    {/* We reuse the grid style but maybe 4 cols instead of 5 for filtered view since width might be different? No, keep consistent. */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
                                        {(product.variants && product.variants.length > 0 ? product.variants : [{
                                            _key: 'main',
                                            name: 'Standard',
                                            imageUrl: product.imageUrl,
                                            badge: null
                                        }]).map((variant: any, idx: number) => (
                                            <Link
                                                key={`${product._id}-${idx}`}
                                                href={`/products/${product.category?.slug || 'collection'}/${product.slug}${variant.name !== 'Standard' ? `?variant=${encodeURIComponent(variant.name)}` : ''}`}
                                                className="group flex flex-col"
                                            >
                                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#241e1a] mb-4 border border-white/5 group-hover:border-[var(--terracotta)]/50 transition-colors shadow-lg">
                                                    {variant.imageUrl ? (
                                                        <Image
                                                            src={variant.imageUrl}
                                                            alt={variant.name}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                                            suppressHydrationWarning
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs tracking-widest uppercase">No Image</div>
                                                    )}
                                                    {variant.badge && (
                                                        <div className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-bold uppercase text-white rounded shadow-sm z-20 ${variant.badge === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                                            {variant.badge}
                                                        </div>
                                                    )}

                                                    {/* Small Cute Add to Sample Button - Hover Only */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            addToBox({
                                                                id: product.slug,
                                                                name: `${product.title} - ${variant.name}`,
                                                                color: '#b45a3c',
                                                                texture: variant.imageUrl ? `url('${variant.imageUrl}')` : '#b45a3c'
                                                            });
                                                        }}
                                                        className="absolute bottom-2 right-2 z-30 w-7 h-7 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:from-[var(--terracotta)]/30 hover:to-[var(--terracotta)]/20 hover:border-[var(--terracotta)]/50 hover:scale-110 active:scale-95 transition-all duration-300"
                                                        title="Add to Sample Box"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                        </svg>
                                                    </button>

                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                                </div>
                                                <div className="text-center group-hover:-translate-y-1 transition-transform duration-300 px-2">
                                                    <h4 className="text-sm font-bold text-white mb-1">{variant.name}</h4>
                                                    <p className="text-[10px] text-[var(--terracotta)]/80 uppercase tracking-widest">{product.title}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}

                        {matchingProducts.length === 0 && (
                            <div className="col-span-full py-32 text-center border-t border-white/5">
                                <span className="text-white/30 text-lg font-serif italic">No architectural pieces found in this collection.</span>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

            </main>
            <Footer />
        </div>
    );
}
