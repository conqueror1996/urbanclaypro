'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';

interface ProductsProps {
    products: Product[];
    featuredOnly?: boolean;
}

interface VariantItem {
    name: string;
    color: string;
    tag: string;
    slug: string;
    imageUrl?: string;
}

// Authentic Variant Data
const PRODUCT_VARIANTS: Record<string, VariantItem[]> = {
    'Brick Tiles': [
        { name: 'Linear Brick Tile', color: '#8d6e63', tag: 'Interiors', slug: 'brick-wall-tiles' },
        { name: 'Smooth Brick Tile', color: '#b45a3c', tag: 'Facades', slug: 'brick-wall-tiles' },
        { name: 'Rustic Brick Tile', color: '#d6cbb8', tag: 'Cladding', slug: 'brick-wall-tiles' }
    ],
    'Exposed Brick': [
        { name: 'Wirecut Brick', color: '#a84b2e', tag: 'Structural', slug: 'exposed-bricks' },
        { name: 'Pressed Brick', color: '#5d4037', tag: 'Facades', slug: 'exposed-bricks' },
        { name: 'Handmade Brick', color: '#e6d5c9', tag: 'Landscaping', slug: 'exposed-bricks' }
    ],
    'Terracotta Jaali': [
        { name: 'Camp Jaali', color: '#b45a3c', tag: 'Ventilation', slug: 'terracotta-jaali' },
        { name: 'Petal Jaali', color: '#c06a4a', tag: 'Decorative', slug: 'terracotta-jaali' },
        { name: 'Cross Jaali', color: '#a1887f', tag: 'Screening', slug: 'terracotta-jaali' }
    ]
};

export default function Products({ products, featuredOnly = false }: ProductsProps) {
    const { addToBox } = useSampleBox();
    const allTabs = [
        { name: 'Brick Tiles', filter: 'Brick Wall Tiles', icon: 'grid' },
        { name: 'Exposed Brick', filter: 'Exposed Bricks', icon: 'layers' },
        { name: 'Terracotta Jaali', filter: 'Jaali', icon: 'pattern' },
        { name: 'Clay Facade Panels', filter: 'Terracotta Panels', icon: 'layers' },
        { name: 'Clay Floor Tiles', filter: 'Floor Tiles', icon: 'squares' },
        { name: 'Roof Tiles', filter: 'Roof Tile', icon: 'roof' },
        { name: 'Clay Ceiling Tiles', filter: 'Clay Ceiling Tile', icon: 'grid' }
    ];

    const tabs = featuredOnly
        ? allTabs.filter(t => ['Brick Tiles', 'Exposed Brick', 'Terracotta Jaali'].includes(t.name))
        : allTabs;

    const [activeTab, setActiveTab] = React.useState(tabs[0].name);

    // Logic for Full Catalogue Mode (featuredOnly = false)
    const matchingProducts = !featuredOnly
        ? products.filter(p => p.tag && p.tag.includes(tabs.find(t => t.name === activeTab)?.filter || ''))
        : [];

    let dynamicVariants: { name: string; imageUrl?: string; altText?: string; slug?: string; color?: string; tag?: string }[] = [];

    if (!featuredOnly) {
        matchingProducts.forEach(product => {
            if (product.variants) {
                dynamicVariants.push(...product.variants.map(v => ({ ...v, slug: product.slug, color: '#e6d5c9', tag: product.tag })));
            }
            if (product.collections) {
                product.collections.forEach(collection => {
                    if (collection.variants) {
                        dynamicVariants.push(...collection.variants.map(v => ({ ...v, slug: product.slug, color: '#e6d5c9', tag: product.tag })));
                    }
                });
            }
            if ((!product.variants || product.variants.length === 0) && (!product.collections || product.collections.length === 0)) {
                dynamicVariants.push({
                    name: product.title,
                    imageUrl: product.imageUrl || '',
                    slug: product.slug,
                    color: '#e6d5c9',
                    tag: product.tag
                });
            }
        });
    }

    // Hydrate homepage variants with real images if available
    const hydratedHomepageVariants = React.useMemo(() => {
        const variants = PRODUCT_VARIANTS[activeTab as keyof typeof PRODUCT_VARIANTS] || [];
        return variants.map(v => {
            const product = products.find(p => p.slug === v.slug);
            let imageUrl = v.imageUrl;

            if (product) {
                // 1. Try to find exact variant match
                const exactMatch = product.variants?.find(pv => pv.name === v.name) ||
                    product.collections?.flatMap(c => c.variants).find(cv => cv.name === v.name);

                if (exactMatch?.imageUrl) {
                    imageUrl = exactMatch.imageUrl;
                }
                // 2. Fallback to product main image if no variant image found (optional, but good for visuals)
                else if (!imageUrl && product.imageUrl) {
                    imageUrl = product.imageUrl;
                }
            }
            return { ...v, imageUrl };
        });
    }, [activeTab, products]);

    // Decide which variants to show
    const variantsToShow = featuredOnly
        ? hydratedHomepageVariants
        : dynamicVariants;

    return (
        <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-48">
            {/* HEADER */}
            <motion.div
                className="text-center mb-10 md:mb-16 lg:mb-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">
                    {featuredOnly ? 'Curated Collections' : 'Complete Catalogue'}
                </span>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-serif text-[#2A1E16]">
                    {featuredOnly ? 'Signature Clay Products' : 'Explore Our Range'}
                </h2>
            </motion.div>

            {/* TABS */}
            <div className="flex justify-center mb-8 md:mb-12 lg:mb-20">
                <div className={`
                    inline-flex bg-[#f4f1ee] p-1.5 rounded-full border border-[var(--line)]
                    overflow-x-auto max-w-full scrollbar-hide
                    ${!featuredOnly ? 'justify-start md:justify-center rounded-3xl' : ''}
                `}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <button
                                key={tab.name}
                                onClick={() => setActiveTab(tab.name)}
                                className={`relative px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${isActive ? 'text-white' : 'text-[#5d554f] hover:text-[#2A1E16]'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabBg"
                                        className="absolute inset-0 bg-[#2A1E16] rounded-full shadow-md"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* GRID */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${featuredOnly ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
                >
                    {variantsToShow.map((variant, index) => (
                        <Link href={`/products/${variant.slug}?variant=${encodeURIComponent(variant.name)}`} key={index} className="group block">
                            <div className="bg-white rounded-2xl p-4 border border-transparent shadow-sm hover:border-[var(--line)] hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                                {/* Color Block / Image Placeholder */}
                                <div
                                    className="aspect-[4/3] rounded-xl mb-6 relative overflow-hidden shadow-inner bg-[#f0e8e2]"
                                    style={{ backgroundColor: variant.color || '#f0e8e2' }}
                                >
                                    {/* Show Image if available, else Texture Overlay */}
                                    {variant.imageUrl ? (
                                        <Image
                                            src={variant.imageUrl}
                                            alt={variant.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 opacity-20 mix-blend-multiply"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}
                                            />
                                            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-serif font-bold text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">
                                            {variant.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#7a6f66] bg-[#f4f1ee] px-2 py-1 rounded">
                                            {variant.tag || activeTab}
                                        </span>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-[var(--line)] flex items-center justify-end gap-4 text-xs font-medium text-[#7a6f66] group-hover:text-[var(--terracotta)] transition-colors">
                                        <span>View Details</span>
                                        <div className="flex items-center gap-3">
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
                                                className="w-8 h-8 rounded-full bg-[#f4f1ee] hover:bg-[var(--terracotta)] hover:text-white flex items-center justify-center transition-colors"
                                                title="Add to Sample Box"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {variantsToShow.length === 0 && (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 text-lg">No products found in this category.</p>
                        </div>
                    )}
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
