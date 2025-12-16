'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';
import dynamic from 'next/dynamic';
import CoverageCalculator from '@/components/product-page/CoverageCalculator';
// import PatternVisualizer from '@/components/product-page/PatternVisualizer';
import Breadcrumbs from '@/components/Breadcrumbs';

const WallStyler = dynamic(() => import('./WallStyler'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#1a1512] animate-pulse rounded-3xl" />
});
import { generateLuxurySpecs } from '@/lib/catalogue-content';
import QuoteModal from '@/components/QuoteModal'; // Assuming this exists or used by QuoteUrl logic

interface ProductPageAnimateProps {
    product: Product;
    relatedProducts: Product[];
    quoteUrl: string;
    variantName?: string;
}

export default function ProductPageAnimate({ product, relatedProducts, quoteUrl, variantName }: ProductPageAnimateProps) {
    const { addToBox } = useSampleBox();


    // Active Variant State
    const initialVariant = variantName ? product.variants?.find(v => v.name === variantName) : null;
    const [selectedVariant, setSelectedVariant] = useState(initialVariant);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Active Parallax only on Desktop


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

            {/* --- HERO SECTION: Swiss Hierarchy --- */}
            <section className="relative min-h-[90vh] flex flex-col pt-28 pb-12 px-4 md:px-12 max-w-[1800px] mx-auto">

                {/* Mobile Breadcrumbs: Standard Flow (Scrollable) */}
                <div className="lg:hidden w-full mb-6 z-10 relative overflow-x-auto no-scrollbar whitespace-nowrap px-1">
                    <Breadcrumbs range={product.range} />
                </div>

                <div className="flex-1 grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* LEFT: Typography & Context */}
                    <div className="lg:col-span-5 relative z-10 flex flex-col justify-center order-2 lg:order-1">
                        <div className="mb-8 hidden lg:block">
                            <Breadcrumbs range={product.range} />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-start"
                        >
                            {/* Micro-Metadata: Category */}
                            <span className="inline-block mb-6 text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px]">
                                {product.category?.title || 'Collection'}
                            </span>

                            {/* H1: Commanding, Minimal */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#EBE5E0] leading-[0.9] mb-8 tracking-tight break-words hyphens-auto w-full">
                                {product.title}
                            </h1>

                            {/* Body: Breathable, High Readability */}
                            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed mb-10 max-w-xl border-l-[3px] border-[var(--terracotta)] pl-6">
                                {product.subtitle || 'Premium handcrafted clay for timeless architecture. Engineered for durability and designed for elegance.'}
                            </p>

                            {/* Micro: Origin Data */}
                            <div className="flex items-center gap-6 text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] mb-8 lg:mb-0">
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                                    Est. 2024
                                </span>
                                <span className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                                    Mumbai Studio
                                </span>
                            </div>

                        </motion.div>
                    </div>

                    {/* RIGHT: Product Container (Preserved) */}
                    <div className="lg:col-span-7 w-full flex items-center order-1 lg:order-2">

                        <div className="relative w-full aspect-[4/3] rounded-[2rem] lg:rounded-[3rem] overflow-hidden bg-[#120d0b] border border-white/5 shadow-2xl group">

                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-0" />

                            <AnimatePresence>
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
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover"
                                                priority
                                                quality={95}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {displayImages.length > 1 && (
                                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
                                    <button onClick={() => setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors">←</button>
                                    <span className="text-[10px] font-mono font-medium text-white/60 w-12 text-center">{activeImageIndex + 1} / {displayImages.length}</span>
                                    <button onClick={() => setActiveImageIndex((i) => (i + 1) % displayImages.length)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors">→</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- OVERVIEW & SPECS: Editorial Grid System --- */}
            <section className="py-20 md:py-32 px-4 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 relative">

                    {/* LEFT: Primary Content Flow */}
                    <div className="lg:col-span-8 flex flex-col gap-24 lg:gap-32">

                        {/* 1. Narrative Section */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-3xl font-serif">01</span>
                                <div className="h-px w-16 bg-white/10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">The Narrative</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-[#EBE5E0] leading-tight">
                                Distinctive Character
                            </h2>
                            <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-white/60 font-light leading-loose">
                                <p>{product.description || `Crafted with precision and fired to perfection, ${product.title} represents the pinnacle of terracotta engineering.`}</p>
                            </div>
                        </div>

                        {/* 2. Technical Profile - Dark Blueprint Mode */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-3xl font-serif">02</span>
                                <div className="h-px w-16 bg-white/10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Technical Profile</span>
                            </div>

                            <div className="bg-[#1a1512] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                                {/* Header */}
                                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-serif text-[#EBE5E0]">Specifications</h2>
                                        <p className="text-[10px] mt-2 text-white/40 uppercase tracking-widest font-mono">ISO 10545 Certified</p>
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-[var(--terracotta)] tracking-widest border border-white/5">
                                        REF: {product.slug.toUpperCase().slice(0, 6)}
                                    </div>
                                </div>

                                {/* The Grid */}
                                <div className="p-6 md:p-10">
                                    <div className="flex flex-col">
                                        {generateLuxurySpecs(product).map((spec, i) => (
                                            <div key={i} className="flex flex-col md:flex-row md:items-baseline border-b border-white/5 py-6 last:border-0 first:pt-0 -mx-2 px-2 md:-mx-4 md:px-4 hover:bg-white/[0.02] transition-colors rounded-lg">

                                                {/* Label - Fixed Width */}
                                                <div className="w-full md:w-1/3 mb-2 md:mb-0">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block">
                                                        {spec.label}
                                                    </span>
                                                </div>

                                                {/* Value & Detail - Fluid */}
                                                <div className="w-full md:w-2/3">
                                                    <span className="block text-xl md:text-2xl font-mono font-bold leading-none tracking-tight uppercase mb-3 text-[#EBE5E0] break-words">
                                                        {spec.value}
                                                    </span>
                                                    <p className="text-sm leading-relaxed text-white/50 font-medium max-w-md">
                                                        {spec.detail}
                                                    </p>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Visualizer & Tools */}
                        <div className="group">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] text-3xl font-serif">03</span>
                                <div className="h-px w-16 bg-white/10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Visualizer</span>
                            </div>

                            <div className="grid gap-8">
                                <div className="h-[500px] md:h-[600px] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
                                    <WallStyler
                                        initialColor="#b45a3c"
                                        variantImages={[product.imageUrl, ...(product.variants?.map(v => v.imageUrl) || [])].filter(Boolean) as string[]}
                                    />
                                </div>

                                <div className="bg-[#EBE5E0] text-[#1a1512] rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
                                    <div className="relative z-10">
                                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] mb-4 block">Calculator</span>
                                        <h3 className="text-3xl font-serif mb-8">Quantity Estimator</h3>
                                        <CoverageCalculator />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT: CONFIGURATOR (Sticky) - Preserved & Polished */}
                    <div className="lg:col-span-4 relative hidden lg:block">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-[#1a1512] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                                <div className="mb-8 border-b border-white/5 pb-6 relative z-10">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3 block">Collection</span>
                                    <h2 className="text-3xl font-serif text-white mb-2">{product.title}</h2>
                                    {selectedVariant && (
                                        <div className="text-[var(--terracotta)] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>{selectedVariant.name}
                                        </div>
                                    )}
                                </div>

                                {/* Variants */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="mb-8 relative z-10">
                                        <div className="grid grid-cols-4 gap-3">
                                            {product.variants.map((v, i) => (
                                                <button key={i} onClick={() => handleVariantSelect(v.name)} className={`group/btn relative aspect-square rounded-lg overflow-hidden border transition-all duration-300 ${selectedVariant?.name === v.name ? 'border-[var(--terracotta)] ring-1 ring-[var(--terracotta)]' : 'border-white/10 hover:border-white/40'}`}>
                                                    {v.imageUrl ? <Image src={v.imageUrl} alt={v.name} fill sizes="64px" className="object-cover transition-transform group-hover/btn:scale-110" /> : <div className="w-full h-full bg-[#3a3430]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-serif text-[#EBE5E0]">{product.priceRange?.split('/')[0] || 'Inquire'}</span>
                                        {product.priceRange && <span className="text-xs text-white/40 font-light">/ sq.ft</span>}
                                    </div>
                                    <button onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })} className="flex w-full py-4 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-[var(--terracotta)] rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all items-center justify-center gap-2 group">
                                        + Add to Box
                                    </button>
                                    <button onClick={() => setIsQuoteModalOpen(true)} className="flex w-full py-4 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all items-center justify-center gap-2 relative overflow-hidden group shadow-lg shadow-orange-900/20">
                                        Get Quote
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CURATED PALETTE (Related) --- */}
            {relatedProducts && relatedProducts.length > 0 && (
                <section className="py-20 md:py-32 border-t border-white/5 relative bg-[#1f1a16]">
                    <div className="max-w-[1800px] mx-auto px-4 md:px-6 relative z-10">
                        <div className="mb-12">
                            <h2 className="text-3xl font-serif text-[#EBE5E0]">Curated Palette</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.slice(0, 4).map((bgProduct) => (
                                <Link href={`/products/${bgProduct.slug}`} key={bgProduct.slug} className="group block">
                                    <div className="aspect-[3/4] bg-[#241e1a] rounded-xl overflow-hidden relative mb-4">
                                        {bgProduct.imageUrl && <Image src={bgProduct.imageUrl} alt={bgProduct.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                                    </div>
                                    <h4 className="text-white font-serif">{bgProduct.title}</h4>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} productName={product.title} variantName={selectedVariant?.name} />

            {/* --- MOBILE STICKY DOCK --- */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#1a1512]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center gap-3 pb-8">
                <button onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })} className="flex-1 py-3.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform">
                    + Sample
                </button>
                <button onClick={() => setIsQuoteModalOpen(true)} className="flex-[2] py-3.5 bg-[var(--terracotta)] text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
                    Get Quote
                </button>
            </div>

        </main>
    );
}
