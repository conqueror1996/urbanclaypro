'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import { useSearchParams, useRouter } from 'next/navigation';
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

    // 1. EXTRACT CATEGORIES
    const uniqueCategories = Array.from(new Set(products.map(p => {
        return p.category?.title || p.tag || 'Uncategorized';
    }))).filter(c => c !== 'Uncategorized').sort();

    const tabs = [
        { name: 'All', filter: 'All' },
        ...uniqueCategories.map(cat => ({ name: cat, filter: cat }))
    ];

    // 2. ACTIVE TAB STATE
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Simple fuzzy match
            const match = tabs.find(t =>
                t.name === catParam ||
                toSlug(t.name) === catParam ||
                t.name.toLowerCase() === catParam.toLowerCase()
            );
            if (match) setActiveTab(match.name);
        }
    }, [searchParams, tabs]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
        // Optional: Update URL without reload could go here
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

                {/* --- FILTERS (Studio Style) --- */}
                <div className="sticky top-20 md:top-24 z-40 mb-12 md:mb-16 py-4 bg-[#1a1512]/90 backdrop-blur-md border-b border-white/5 -mx-6 px-6">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {tabs.map((tab) => (
                            <button
                                key={tab.name}
                                onClick={() => handleTabClick(tab.name)}
                                className={`
                                    whitespace-nowrap px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border
                                    ${activeTab === tab.name
                                        ? 'bg-[var(--terracotta)] border-[var(--terracotta)] text-white'
                                        : 'bg-transparent border-white/10 text-white/50 hover:border-white/30 hover:text-white'}
                                `}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PRODUCTS GRID --- */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16"
                    >
                        {matchingProducts.length > 0 ? (
                            matchingProducts.map((product) => (
                                <Link
                                    href={`/products/${product.category?.slug || 'collection'}/${product.slug}`}
                                    key={product.slug}
                                    className="group flex flex-col"
                                >
                                    {/* Image Card */}
                                    <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#241e1a] mb-6 border border-white/5 group-hover:border-[var(--terracotta)]/50 transition-colors">
                                        {/* Main Image */}
                                        {product.imageUrl ? (
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs tracking-widest uppercase">
                                                No Preview
                                            </div>
                                        )}

                                        {/* Overlay & Quick Actions */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' });
                                            }}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#1a1512] text-white flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[var(--terracotta)]"
                                            title="Add Sample"
                                        >
                                            <span className="text-lg leading-none mb-1">+</span>
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="px-2">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-serif text-[#EBE5E0] group-hover:text-[var(--terracotta)] transition-colors">
                                                {product.title}
                                            </h3>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 border border-white/10 px-2 py-1 rounded-full">
                                                {product.category?.title || product.tag || 'Collection'}
                                            </span>
                                        </div>
                                        <p className="text-white/40 text-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                                            {product.description || 'Premium architectural terracotta.'}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center">
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
