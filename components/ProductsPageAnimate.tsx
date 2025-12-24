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
    const { addToBox, box, isInBox, setBoxOpen } = useSampleBox();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleAddSample = (product: Product, variant: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const uniqueId = `${product.slug}-${toSlug(variant.name)}`;

        if (isInBox(uniqueId)) {
            setToastMessage("Already in your tray");
            setBoxOpen(true);
            return;
        }

        if (box.length >= 5) {
            setToastMessage("Tray is full (Max 5 samples)");
            setBoxOpen(true);
            return;
        }

        addToBox({
            id: uniqueId,
            name: `${product.title} - ${variant.name}`,
            color: '#b45a3c',
            texture: variant.imageUrl ? `url('${variant.imageUrl}')` : '#b45a3c'
        });
        setToastMessage("Added to sample tray");
    };
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
    const [selectedSeries, setSelectedSeries] = useState('All Series');
    const [selectedColor, setSelectedColor] = useState('Any Color');
    const [selectedPrice, setSelectedPrice] = useState('Any Budget');

    // Extract dynamic filter options
    const uniqueSeries = useMemo(() => {
        return Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.family)).filter(Boolean) as string[])).sort();
    }, [products]);

    const uniqueColors = useMemo(() => {
        return Array.from(new Set(products.flatMap(p => p.variants?.map(v => v.color)).filter(Boolean) as string[])).sort();
    }, [products]);

    const priceOptions = [
        { label: 'Any Budget', value: 'Any Budget' },
        { label: 'Budget (₹ 40-70)', value: 'low' },
        { label: 'Mid-Range (₹ 70-120)', value: 'mid' },
        { label: 'Premium (₹ 120+)', value: 'high' }
    ];

    // Sync activeTab with URL params
    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Robust fuzzy match
            const normalizedParam = catParam.toLowerCase().replace(/-/g, ' ').trim();

            const match = tabs.find(t => {
                const normalizedTab = t.name.toLowerCase();
                return normalizedTab === normalizedParam ||
                    toSlug(t.name) === catParam ||
                    normalizedTab.includes(normalizedParam) ||
                    normalizedParam.includes(normalizedTab);
            });

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
    // 3. FILTER LOGIC
    const matchingProducts = products.filter(p => {
        // Category
        if (activeTab !== 'All' && (p.category?.title || p.tag) !== activeTab) return false;

        // Series
        if (selectedSeries !== 'All Series' && !p.variants?.some(v => v.family === selectedSeries)) return false;

        // Color
        if (selectedColor !== 'Any Color' && !p.variants?.some(v => v.color === selectedColor)) return false;

        // Price
        if (selectedPrice !== 'Any Budget' && p.priceTier !== selectedPrice) return false;

        return true;
    });

    // Helper to filter variants for display
    const getFilteredVariants = (product: Product) => {
        let vars = product.variants || [];
        if (selectedSeries !== 'All Series') {
            vars = vars.filter(v => v.family === selectedSeries);
        }
        if (selectedColor !== 'Any Color') {
            vars = vars.filter(v => v.color === selectedColor);
        }

        // If filtering leaves no variants but product matched (e.g. via other variants), populating empty might be wrong.
        // But matchingProducts logic ensures product has at least one matching variant.
        // If standard/no variants exists, use default behavior check.

        if (vars.length === 0 && (product.variants?.length || 0) > 0) return []; // Should not happen due to parent filter

        return vars.length > 0 ? vars : [{
            _key: 'main',
            name: 'Standard',
            imageUrl: product.imageUrl,
            badge: null
        }];
    };

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

                {/* --- ARCHITECTURAL DARK FILTER --- */}
                <div className="sticky top-20 md:top-24 z-40 mb-16 md:mb-24 -mx-6 px-4 md:px-6">
                    {/* Desktop: Technical Grid Layout */}
                    <div className="hidden md:block">
                        <div className="bg-[#1a1a1a]/80 backdrop-blur-md border-y border-white/10 py-6">
                            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">

                                {/* Label */}
                                <div className="flex-shrink-0 flex items-center gap-3 opacity-60">
                                    <div className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></div>
                                    <span className="text-xs font-mono uppercase tracking-widest text-white">REFINE BY</span>
                                </div>

                                {/* Filter Group */}
                                <div className="flex-1 flex items-center gap-8 justify-end">

                                    {/* Categories Dropdown - Desktop */}
                                    <div className="relative group">
                                        <select
                                            value={activeTab}
                                            onChange={(e) => handleTabClick(e.target.value)}
                                            className="appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-white border border-white/20 rounded-full px-4 py-2 pr-8 hover:border-white/40 transition-colors cursor-pointer focus:outline-none focus:border-[var(--terracotta)] w-40"
                                        >
                                            {tabs.map(tab => (
                                                <option key={tab.name} value={tab.name} className="bg-[#2c241b]">{tab.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-3 h-3 text-[var(--terracotta)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Dropdowns - Minimal & Transparent */}
                                    <div className="flex items-center gap-4">
                                        {/* Series Filter */}
                                        <div className="relative group">
                                            <select
                                                value={selectedSeries}
                                                onChange={(e) => setSelectedSeries(e.target.value)}
                                                className="appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-white/70 border border-white/20 rounded-full px-4 py-2 pr-8 hover:border-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none focus:border-[var(--terracotta)] w-32"
                                            >
                                                <option className="bg-[#2c241b]">All Series</option>
                                                {uniqueSeries.map(s => <option key={s} value={s} className="bg-[#2c241b]">{s}</option>)}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Color Filter */}
                                        <div className="relative group">
                                            <select
                                                value={selectedColor}
                                                onChange={(e) => setSelectedColor(e.target.value)}
                                                className="appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-white/70 border border-white/20 rounded-full px-4 py-2 pr-8 hover:border-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none focus:border-[var(--terracotta)] w-32"
                                            >
                                                <option className="bg-[#2c241b]">Any Color</option>
                                                {uniqueColors.map(c => <option key={c} value={c} className="bg-[#2c241b]">{c}</option>)}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Price Filter */}
                                        <div className="relative group">
                                            <select
                                                value={selectedPrice}
                                                onChange={(e) => setSelectedPrice(e.target.value)}
                                                className="appearance-none bg-transparent text-xs font-medium uppercase tracking-wider text-white/70 border border-white/20 rounded-full px-4 py-2 pr-8 hover:border-white/40 hover:text-white transition-colors cursor-pointer focus:outline-none focus:border-[var(--terracotta)] w-32"
                                            >
                                                {priceOptions.map(p => <option key={p.value} value={p.value} className="bg-[#2c241b]">{p.label}</option>)}
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3 h-3 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reset Action */}
                                    <button
                                        onClick={() => {
                                            setSelectedSeries('All Series');
                                            setSelectedColor('Any Color');
                                            setSelectedPrice('Any Budget');
                                            setActiveTab('All');
                                            router.push(pathname, { scroll: false });
                                        }}
                                        className="ml-4 p-2 text-white/30 hover:text-[var(--terracotta)] transition-colors"
                                        title="Reset Filters"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: Premium Architectural Grid (Sync Check) */}
                    <div className="md:hidden relative z-30">
                        {/* Scrollable Container */}
                        <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border-y border-white/10 overflow-x-auto scrollbar-hide flex items-stretch">

                            {/* 1. Categories Block */}
                            <div className="flex-shrink-0 min-w-[160px] px-5 py-3 border-r border-white/10 relative group active:bg-white/5 transition-colors [-webkit-tap-highlight-color:transparent]">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                                    Categories
                                </label>
                                <div className="relative">
                                    <select
                                        value={activeTab}
                                        onChange={(e) => handleTabClick(e.target.value)}
                                        className="w-full bg-transparent text-xs font-bold uppercase tracking-widest text-white appearance-none border-none p-0 pr-6 focus:ring-0 outline-none focus:outline-none cursor-pointer"
                                    >
                                        {tabs.map((tab) => (
                                            <option key={tab.name} value={tab.name} className="bg-[#1a1a1a] text-gray-300">
                                                {tab.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-[var(--terracotta)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Budget Block */}
                            <div className="flex-shrink-0 min-w-[160px] px-5 py-3 border-r border-white/10 relative group active:bg-white/5 transition-colors [-webkit-tap-highlight-color:transparent]">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                                    Budget Range
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedPrice}
                                        onChange={(e) => setSelectedPrice(e.target.value)}
                                        className="w-full bg-transparent text-xs font-bold uppercase tracking-widest text-white appearance-none border-none p-0 pr-6 focus:ring-0 outline-none focus:outline-none cursor-pointer"
                                    >
                                        {priceOptions.map(p => <option key={p.value} value={p.value} className="bg-[#1a1a1a] text-gray-300">{p.label}</option>)}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-[var(--terracotta)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Color Block */}
                            <div className="flex-shrink-0 min-w-[140px] px-5 py-3 border-r border-white/10 relative group active:bg-white/5 transition-colors [-webkit-tap-highlight-color:transparent]">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                                    Color
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-full bg-transparent text-xs font-bold uppercase tracking-widest text-white appearance-none border-none p-0 pr-6 focus:ring-0 outline-none focus:outline-none cursor-pointer"
                                    >
                                        <option className="bg-[#1a1a1a] text-gray-300">Any Color</option>
                                        {uniqueColors.map(c => <option key={c} value={c} className="bg-[#1a1a1a] text-gray-300">{c}</option>)}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-[var(--terracotta)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Series Block */}
                            <div className="flex-shrink-0 min-w-[140px] px-5 py-3 border-r border-white/10 relative group active:bg-white/5 transition-colors [-webkit-tap-highlight-color:transparent]">
                                <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                                    Series
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedSeries}
                                        onChange={(e) => setSelectedSeries(e.target.value)}
                                        className="w-full bg-transparent text-xs font-bold uppercase tracking-widest text-white appearance-none border-none p-0 pr-6 focus:ring-0 outline-none focus:outline-none cursor-pointer"
                                    >
                                        <option className="bg-[#1a1a1a] text-gray-300">All Series</option>
                                        {uniqueSeries.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-gray-300">{s}</option>)}
                                    </select>
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-3 h-3 text-[var(--terracotta)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="w-8 flex-shrink-0"></div>

                            {/* Right Fade Affordance */}
                            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none border-y border-transparent"></div>
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
                                                    {getFilteredVariants(product).map((variant: any, idx: number) => (
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
                                                                    <div className={`absolute top-3 left-3 px-2 py-1 text-[9px] font-bold uppercase text-white rounded shadow-sm z-20 ${variant.badge === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                                                        {variant.badge}
                                                                    </div>
                                                                )}

                                                                {/* Small Cute Add to Sample Button - Hover Only */}
                                                                <button
                                                                    onClick={(e) => handleAddSample(product, variant, e)}
                                                                    className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] hover:scale-110 active:scale-95 transition-all duration-300"
                                                                    title="Add to Sample Box"
                                                                >                                                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
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
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-12 gap-y-16">
                                        {getFilteredVariants(product).map((variant: any, idx: number) => (
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
                                                        onClick={(e) => handleAddSample(product, variant, e)}
                                                        className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] hover:scale-110 active:scale-95 transition-all duration-300"
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
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-white px-6 py-3 rounded-full border border-white/20 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
}
