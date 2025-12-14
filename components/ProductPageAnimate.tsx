'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import CoverageCalculator from '@/components/product-page/CoverageCalculator';
import PatternVisualizer from '@/components/product-page/PatternVisualizer';
import Breadcrumbs from '@/components/Breadcrumbs';
import QuoteModal from '@/components/QuoteModal';

interface ProductPageAnimateProps {
    product: Product;
    relatedProducts: Product[];
    quoteUrl: string;
    variantName?: string;
}

export default function ProductPageAnimate({ product, relatedProducts, quoteUrl, variantName }: ProductPageAnimateProps) {
    const { addToBox } = useSampleBox();
    const { scrollY } = useScroll();

    // Active Variant State
    const initialVariant = variantName ? product.variants?.find(v => v.name === variantName) : null;
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Active Parallax only on Desktop
    const heroY = useTransform(scrollY, [0, 500], [0, isMobile ? 0 : 100]);
    const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.4]);

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

            {/* --- HERO SECTION: Studio Split Layout --- */}
            <section className="relative min-h-[90vh] flex flex-col pt-24 lg:pt-32 pb-12 px-4 md:px-12 max-w-[1800px] mx-auto overflow-hidden md:overflow-visible">

                {/* Breadcrumbs - Always Top */}
                <div className="w-full mb-6 z-20 relative px-2">
                    <Breadcrumbs range={product.range} />
                </div>

                <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-24 items-center w-full">

                    {/* LEFT: Product Visual "Sample" (Desktop Order 1, Mobile Order 1 - Visual First) */}
                    <div className="lg:col-span-7 w-full flex flex-col lg:block items-center justify-center lg:items-center lg:h-full lg:min-h-[50vh] order-1 lg:order-1">
                        <div className="relative w-[90%] max-w-sm lg:w-full lg:max-w-none mx-auto aspect-square lg:aspect-[4/3] rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-[#120d0b] border border-white/5 shadow-2xl group flex items-center justify-center">

                            {/* Background Gradient for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeImage}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="absolute inset-0 z-10 p-4 md:p-12"
                                >
                                    <div className="relative w-full h-full shadow-2xl rounded-2xl overflow-hidden">
                                        {activeImage && (
                                            <Image
                                                src={activeImage}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                                priority
                                                quality={95}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Desktop Gallery Toolbar - Floating (Restored) */}
                            {displayImages.length > 1 && (
                                <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-2 rounded-full border border-white/10">
                                    <button
                                        onClick={() => setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                                    >
                                        ←
                                    </button>
                                    <span className="text-[10px] font-mono font-medium text-white/60 w-16 text-center">
                                        {activeImageIndex + 1} / {displayImages.length}
                                    </span>
                                    <button
                                        onClick={() => setActiveImageIndex((i) => (i + 1) % displayImages.length)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Gallery Toolbar - Below Container (Mobile Only) */}
                        {displayImages.length > 1 && (
                            <div className="lg:hidden flex items-center gap-6 mt-6 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                                <button
                                    onClick={() => setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length)}
                                    className="w-8 h-8 flex items-center justify-center hover:text-[var(--terracotta)] text-white transition-colors"
                                >
                                    ←
                                </button>
                                <span className="text-xs font-mono font-medium text-white/60 w-12 text-center">
                                    {activeImageIndex + 1} / {displayImages.length}
                                </span>
                                <button
                                    onClick={() => setActiveImageIndex((i) => (i + 1) % displayImages.length)}
                                    className="w-8 h-8 flex items-center justify-center hover:text-[var(--terracotta)] text-white transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        )}

                        {/* Mobile Collection Selector (Range Siblings) - Moved below title/specs on mobile now */}
                    </div>



                    {/* RIGHT: Typography & Context (Desktop Order 2, Mobile Order 2) */}
                    <div className="lg:col-span-5 relative z-10 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-2">

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-center lg:items-start w-full"
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#EBE5E0] leading-[1.1] mb-6 tracking-tight">
                                {product.title}
                            </h1>

                            {/* Poetic Value Statement */}
                            <p className="text-xl lg:text-2xl text-white/80 font-serif italic mb-6 text-center lg:text-left">
                                {product.subtitle || 'Timeless texture. Unyielding strength.'}
                            </p>

                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-white/40 uppercase tracking-widest mb-10">
                                <span>Handmade</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>Est. 2024</span>
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                <span>Made in India</span>
                            </div>

                            {/* --- MOBILE CONTENT BLOCK (Variants, Description, Collection) --- */}
                            <div className="lg:hidden w-full flex flex-col gap-8 mb-8">

                                {/* 1. Mobile Variant Selector */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="w-full">
                                        <div className="flex justify-between items-baseline mb-3 px-1">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Select Finish</span>
                                            {selectedVariant && <span className="text-[var(--terracotta)] text-xs font-bold uppercase">{selectedVariant.name}</span>}
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

                                {/* 2. Mobile Description */}
                                <p className="text-base text-white/70 font-light leading-relaxed text-center px-2">
                                    {product.description || 'Premium handcrafted clay for timeless architecture. Engineered for durability and designed for elegance. Each piece matches international standards for strength and aesthetics.'}
                                </p>

                                {/* 3. Mobile Collection Row */}
                                <div className="w-full pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4 text-center">
                                        More in {product.range || 'Collection'}
                                    </p>
                                    <div className="flex overflow-x-auto gap-3 pb-2 px-1 scrollbar-hide snap-x justify-start">
                                        {/* Current Product Highlight */}
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-[var(--terracotta)] shadow-sm opacity-100"
                                        >
                                            {product.imageUrl ? (
                                                <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#3a3430]" />
                                            )}
                                        </Link>

                                        {relatedProducts && relatedProducts.length > 0 && relatedProducts.map((rel) => (
                                            <Link
                                                key={rel.slug}
                                                href={`/products/${rel.slug}`}
                                                className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-all snap-center"
                                            >
                                                {rel.imageUrl ? (
                                                    <Image src={rel.imageUrl} alt={rel.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#3a3430]" />
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Actions (Primary) */}
                            <div className="hidden lg:flex flex-col w-full gap-4 mb-10">
                                <a
                                    href={`https://wa.me/918080081951?text=Inquiry for ${product.title}`}
                                    className="w-full py-5 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 relative overflow-hidden group shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 transform hover:-translate-y-0.5"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    <span className="relative z-10">Get Quote</span>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </a>

                                <button
                                    onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })}
                                    className="w-full py-5 bg-transparent hover:bg-white/5 text-white/80 border border-white/20 hover:border-[var(--terracotta)] rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="group-hover:text-[var(--terracotta)] transition-colors">+ Order Sample</span>
                                </button>

                                <div className="flex items-center justify-center gap-6 text-[10px] text-white/30 font-medium">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        In Stock
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Ships in 7-10 Days
                                    </span>
                                </div>
                            </div>

                            {/* Mobile: Description is moved below image for better "above fold" experience */}
                            <div className="hidden lg:block w-full">
                                <p className="text-lg text-white/60 font-light leading-relaxed mb-8 max-w-xl pl-1 border-l-2 border-[var(--terracotta)] pl-6">
                                    {product.description || 'Premium handcrafted clay for timeless architecture. Engineered for durability and designed for elegance.'}
                                </p>

                                {/* Variant Selection (Simplified) */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <span className="text-xs font-bold uppercase tracking-widest text-white/50">Available Finishes</span>
                                            {selectedVariant && <span className="text-[var(--terracotta)] text-xs font-bold uppercase">{selectedVariant.name}</span>}
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
                            </div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* --- OVERVIEW & CONFIGURATOR: Luxury Studio Layout --- */}
            <section className="py-16 md:py-24 px-4 md:px-6 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 relative">

                    {/* LEFT: EDITORIAL CONTENT (Story, Specs, Details) - Full Width now */}
                    <div className="lg:col-span-12 space-y-20">

                        {/* 1. Narrative */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[var(--terracotta)] text-4xl font-serif">01</span>
                                    <div className="h-px w-12 bg-white/10" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-white/40">The Narrative</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif text-[#EBE5E0]">
                                    Distinctive Character
                                </h2>
                            </div>
                            <div className="prose prose-invert prose-lg max-w-none text-white/70 font-light leading-loose">
                                <p className="text-lg">
                                    Designed for architects who value texture, depth, and permanence. Each tile carries natural variation, giving walls a lived-in, timeless quality.
                                </p>
                            </div>
                        </div>

                        {/* 2. Technical Profile (Matrix) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-[#1f1a16] border border-white/5 rounded-3xl p-8 lg:p-12">
                            <div className="lg:col-span-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[var(--terracotta)] text-4xl font-serif">02</span>
                                    <div className="h-px w-12 bg-white/10" />
                                </div>
                                <h2 className="text-2xl font-serif text-[#EBE5E0] mb-4">Technical Profile</h2>
                                <p className="text-white/40 text-sm leading-relaxed mb-8">
                                    Engineering-grade durability tested for harsh climates.
                                </p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--terracotta)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                        <span>Indian Climate Tested</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-white/60">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[var(--terracotta)]">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                        </div>
                                        <span>Low Efflorescence</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-8">
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
                                <span className="text-[var(--terracotta)] text-4xl font-serif">03</span>
                                <div className="h-px w-12 bg-white/10" />
                                <span className="text-sm font-bold uppercase tracking-widest text-white/40">Visualizer & Estimation</span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Pattern Visualizer */}
                                <div className="bg-[#1f1a16] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                        <span className="text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-widest mb-1 block">Visualizer</span>
                                        <h3 className="text-xl font-serif text-[#EBE5E0]">Preview Your Wall</h3>
                                    </div>
                                    {/* Mobile: Fixed Height 500px to prevent clipping. Desktop: Aspect Video (Restored) */}
                                    <div className="h-[500px] lg:h-auto lg:aspect-video w-full">
                                        <PatternVisualizer title={product.title} />
                                    </div>
                                    <div className="p-4 bg-[#1a1512] text-center border-t border-white/5">
                                        <p className="text-white/40 text-[10px] uppercase tracking-wider">Interactive: Click pattern to zoom</p>
                                    </div>
                                </div>

                                {/* Coverage Calculator */}
                                <div className="bg-[#EBE5E0] text-[#1a1512] rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-center">
                                    <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">Calculator</span>
                                    <h3 className="text-3xl font-serif mb-6">Estimate Quantity</h3>
                                    <CoverageCalculator />

                                    {/* Decorative Icon */}
                                    <div className="absolute -bottom-8 -right-8 opacity-5 pointer-events-none">
                                        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- CURATED PALETTE (Related) --- */}
            {
                relatedProducts && relatedProducts.length > 0 && (
                    <section className="py-20 md:py-32 border-t border-white/5 relative bg-[#1f1a16]">
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
                                        <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#120d0b] rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-white/5 group-hover:border-[var(--terracotta)]/50">
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

                                        <div className="flex justify-between items-start pt-2">
                                            <div>
                                                <h3 className="text-lg font-serif text-[#EBE5E0] mb-1 group-hover:text-[var(--terracotta)] transition-colors">{bgProduct.title}</h3>
                                                <p className="text-white/40 text-xs uppercase tracking-wider">{bgProduct.category?.title}</p>
                                            </div>
                                            <span className="text-white/20 group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Sticky CTA on Scroll (Bottom of Collection) */}
                            <div className="mt-24 flex justify-center flex-col items-center gap-6">
                                <p className="text-white/40 text-sm font-light">Need something custom?</p>
                                <div className="flex gap-4">
                                    <Link href="/products" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest border border-white/10">
                                        Explore Full Catalogue
                                    </Link>
                                    <a href="https://wa.me/918080081951" className="px-8 py-4 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-full transition-all duration-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-orange-900/20">
                                        Chat with Architect
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                )
            }

            {/* --- MOBILE STICKY DOCK (Items hidden on desktop) --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#1a1512]/80 backdrop-blur-xl border-t border-white/10 z-50 flex items-center gap-3 safe-area-pb">
                <button
                    onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })}
                    className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform"
                >
                    + Sample
                </button>
                <button
                    onClick={() => setIsQuoteModalOpen(true)}
                    className="flex-[2] py-3.5 bg-[var(--terracotta)] text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform shadow-lg shadow-orange-900/20 relative overflow-hidden"
                >
                    <span className="relative z-10">Get Quote</span>
                </button>
            </div>

            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                productName={product.title}
                variantName={selectedVariant?.name}
            />

        </main >
    );
}
