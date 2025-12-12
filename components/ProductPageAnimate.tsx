'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import CoverageCalculator from '@/components/product-page/CoverageCalculator';
import PatternVisualizer from '@/components/product-page/PatternVisualizer';
import Breadcrumbs from '@/components/Breadcrumbs';

interface ProductPageAnimateProps {
    product: Product;
    relatedProducts: Product[];
    quoteUrl: string;
    variantName?: string;
}

export default function ProductPageAnimate({ product, relatedProducts, quoteUrl, variantName }: ProductPageAnimateProps) {
    const { addToBox } = useSampleBox();
    const { scrollY } = useScroll();

    // Parallax & Fade Effects for Hero
    const heroY = useTransform(scrollY, [0, 500], [0, 100]);
    const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.4]);

    // Active Variant State
    const initialVariant = variantName ? product.variants?.find(v => v.name === variantName) : null;
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Image Handling
    const galleryImages = selectedVariant
        ? [selectedVariant.imageUrl, ...(selectedVariant.gallery || [])].filter(Boolean) as string[]
        : [product.imageUrl, ...(product.images?.map(i => typeof i === "string" ? i : i.url) || []), ...(product.variants?.map(v => v.imageUrl) || [])].filter(Boolean) as string[];

    const displayImages = galleryImages.length > 0 ? galleryImages : [''];
    const activeImage = displayImages[activeImageIndex] || displayImages[0];

    const handleVariantSelect = (variantName: string) => {
        const v = product.variants?.find(v => v.name === variantName) || null;
        setSelectedVariant(v);
        setActiveImageIndex(0);
    };

    return (
        <main className="bg-[#1a1512] text-[#EBE5E0] min-h-screen selection:bg-[var(--terracotta)] selection:text-white pb-32 lg:pb-0">

            {/* --- HERO SECTION: Clean, Centered, Editorial --- */}
            <section className="relative min-h-[90vh] flex flex-col pt-32 pb-20 px-6 max-w-[1800px] mx-auto">
                <div className="flex justify-center mb-8 opacity-60 relative z-10">
                    <Breadcrumbs range={product.range} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center relative z-10 max-w-4xl mx-auto mb-16"
                >
                    <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                        {product.category?.title || 'Collection'}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-8xl font-serif text-[#EBE5E0] leading-[0.9] mb-8">
                        {product.title}
                    </h1>
                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                        {product.subtitle || 'Premium handcrafted clay for timeless architecture.'}
                    </p>
                </motion.div>

                {/* Hero Image / Gallery */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[3rem] overflow-hidden bg-[#241e1a] shadow-2xl border border-white/5"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0"
                        >
                            {activeImage && (
                                <Image
                                    src={activeImage}
                                    alt={product.title}
                                    fill
                                    className="object-contain p-8 md:p-16"
                                    priority
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Simple Bottom Controls */}
                    {displayImages.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                            <button onClick={() => setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length)} className="hover:text-[var(--terracotta)] transition-colors">←</button>
                            <span className="text-xs font-mono opacity-60">{activeImageIndex + 1} / {displayImages.length}</span>
                            <button onClick={() => setActiveImageIndex((i) => (i + 1) % displayImages.length)} className="hover:text-[var(--terracotta)] transition-colors">→</button>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* --- OVERVIEW & CONFIGURATOR: Luxury Studio Layout --- */}
            <section className="py-16 md:py-24 px-4 md:px-6 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 relative">

                    {/* LEFT: EDITORIAL CONTENT (Story, Specs, Details) */}
                    <div className="lg:col-span-8 space-y-20">

                        {/* 1. Narrative */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-5xl font-serif">01</span>
                                <div className="h-px w-24 bg-white/10" />
                                <span className="text-sm font-bold uppercase tracking-widest text-white/40">The Narrative</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-8 text-[#EBE5E0]">
                                Distinctive Character
                            </h2>
                            <div className="prose prose-invert prose-lg max-w-none text-white/60 font-light leading-loose break-words">
                                <p>{product.description || `Crafted with precision and fired to perfection, ${product.title} represents the pinnacle of terracotta engineering. Validated for harsh climates and designed for aesthetic versatility, it bridges the gap between traditional warmth and modern minimalism.`}</p>
                            </div>
                        </div>

                        {/* 2. Technical Profile (Matrix) */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-5xl font-serif">02</span>
                                <div className="h-px w-24 bg-white/10" />
                                <span className="text-sm font-bold uppercase tracking-widest text-white/40">Technical Profile</span>
                            </div>

                            <div className="bg-[#241e1a] rounded-2xl p-8 border border-white/5">
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                    {Object.entries(product.specs || { 'Water Absorption': '< 10%', 'Compressive Strength': '> 25 N/mm²', 'Dimensions': '230 x 75 x 18 mm', 'Coverage': '48 pcs/sq.m' }).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-baseline border-b border-white/5 pb-4">
                                            <span className="text-sm uppercase tracking-widest text-white/40 font-medium">{key}</span>
                                            <span className="font-serif text-lg text-[#EBE5E0] text-right">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Interactive Tools (Horizontal) */}
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-5xl font-serif">03</span>
                                <div className="h-px w-24 bg-white/10" />
                                <span className="text-sm font-bold uppercase tracking-widest text-white/40">Estimation</span>
                            </div>
                            <div className="bg-[#EBE5E0] text-[#1a1512] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                                <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">Calculator</span>
                                <h3 className="text-3xl font-serif mb-6">Quantity Estimator</h3>
                                <CoverageCalculator />
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: STICKY CONFIGURATOR (Commerce) */}
                    <div className="lg:col-span-4 relative">
                        <div className="lg:sticky lg:top-32 space-y-8">

                            {/* Configuration Card */}
                            <div className="bg-[#241e1a] border border-white/5 p-6 rounded-2xl shadow-2xl">
                                <div className="mb-8 border-b border-white/5 pb-6">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/30 mb-2 block">Collection</span>
                                    <h2 className="text-2xl font-serif text-white">{product.title}</h2>
                                    {selectedVariant && (
                                        <div className="mt-2 text-[var(--terracotta)] text-sm font-medium flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></span>
                                            {selectedVariant.name}
                                        </div>
                                    )}
                                </div>

                                {/* Variant Swatches */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="mb-8">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Select Finish</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-3">
                                            {product.variants.map((v, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleVariantSelect(v.name)}
                                                    className={`group relative aspect-square rounded-lg overflow-hidden border transition-all ${selectedVariant?.name === v.name ? 'border-[var(--terracotta)] ring-1 ring-[var(--terracotta)]' : 'border-white/10 hover:border-white/40'}`}
                                                    title={v.name}
                                                >
                                                    {v.imageUrl ? (
                                                        <Image src={v.imageUrl} alt={v.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-[#3a3430]" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Price & Actions */}
                                <div className="space-y-4">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-serif text-[#EBE5E0]">
                                            {product.priceRange?.split('/')[0] || 'Inquire'}
                                        </span>
                                        {product.priceRange && <span className="text-xs text-white/40">/ sq.ft</span>}
                                    </div>

                                    <button
                                        onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })}
                                        className="hidden lg:flex w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all items-center justify-center gap-2"
                                    >
                                        <span>+ Add Sample</span>
                                    </button>

                                    <a
                                        href={`https://wa.me/918080081951?text=Inquiry for ${product.title}`}
                                        className="hidden lg:flex w-full py-4 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors items-center justify-center gap-2"
                                    >
                                        Get Quote
                                    </a>

                                    <p className="text-[10px] text-center text-white/30 pt-2 leading-relaxed">
                                        Typically ships in 7-10 days. <br />Bulk volume discounts available.
                                    </p>
                                </div>
                            </div>

                            {/* Need Help Card */}
                            <div className="bg-[#EBE5E0] p-6 rounded-2xl text-[#1a1512] relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="font-serif text-xl mb-2">Need a Specialist?</h3>
                                    <p className="text-sm opacity-70 mb-4 leading-relaxed">Our architects can help with facade engineering and custom molds.</p>
                                    <a href={quoteUrl} className="text-[var(--terracotta)] text-xs font-bold uppercase tracking-widest border-b border-[var(--terracotta)] pb-1 hover:opacity-80">
                                        Book Consultation
                                    </a>
                                </div>
                                <div className="absolute -bottom-4 -right-4 text-[var(--terracotta)]/10">
                                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" /></svg>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* --- CURATED PALETTE (Related) --- */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-20 md:py-32 border-t border-white/5 relative">
                    <div className="max-w-[1800px] mx-auto px-4 md:px-6 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
                            <div>
                                <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">The Collection</span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#EBE5E0]">
                                    Curated Palette
                                </h2>
                            </div>
                            <p className="text-white/40 max-w-md text-sm leading-relaxed text-right md:text-left">
                                Complementary textures and tones selected to work in harmony with {product.title}.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {relatedProducts.slice(0, 4).map((bgProduct, idx) => (
                                <Link href={`/products/${bgProduct.slug}`} key={bgProduct.slug} className="group block">
                                    <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#241e1a] rounded-2xl">
                                        {bgProduct.imageUrl ? (
                                            <Image
                                                src={bgProduct.imageUrl}
                                                alt={bgProduct.title}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 text-xs uppercase tracking-widest">No Image</div>
                                        )}

                                        {/* Minimal Overlay */}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />

                                        {/* Number Badge */}
                                        <div className="absolute top-4 left-4 text-xs font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                                            0{idx + 1}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start border-t border-white/10 pt-4 group-hover:border-[var(--terracotta)] transition-colors duration-500">
                                        <div>
                                            <h3 className="text-lg font-serif text-[#EBE5E0] mb-1 group-hover:text-[var(--terracotta)] transition-colors">{bgProduct.title}</h3>
                                            <p className="text-white/40 text-xs uppercase tracking-wider">{bgProduct.category?.title}</p>
                                        </div>
                                        <span className="text-white/20 group-hover:translate-x-1 transition-transform duration-300">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-24 flex justify-center">
                            <Link href="/products" className="group flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-[var(--terracotta)] text-white rounded-full transition-all duration-300">
                                <span className="text-xs font-bold uppercase tracking-widest">Explore Full Catalogue</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* --- MOBILE STICKY DOCK (Items hidden on desktop) --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#1a1512]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center gap-3">
                <button
                    onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })}
                    className="flex-1 py-3 bg-white/10 text-white rounded-lg font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform"
                >
                    + Sample
                </button>
                <a
                    href={quoteUrl}
                    className="flex-[2] py-3 bg-[var(--terracotta)] text-white rounded-lg text-center font-bold uppercase tracking-widest text-xs active:scale-95 transition-transform shadow-lg shadow-orange-900/20"
                >
                    Get Quote
                </a>
            </div>

        </main>
    );
}
