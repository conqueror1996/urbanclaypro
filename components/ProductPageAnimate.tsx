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

const CuratedProductCard = ({ product }: { product: Product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Combine main image and variants, filtering duplicates and nulls
    const images = React.useMemo(() => {
        const main = product.imageUrl;
        const variants = product.variants?.map(v => v.imageUrl) || [];
        const all = [main, ...variants].filter(Boolean) as string[];
        return [...new Set(all)]; // unique
    }, [product]);

    React.useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 25000); // 25 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    const activeImage = images[currentImageIndex];

    return (
        <Link href={`/products/${product.slug}`} className="group block">
            <div className="aspect-[3/4] bg-[#241e1a] rounded-xl overflow-hidden relative mb-4">
                <AnimatePresence mode='wait'>
                    {activeImage && (
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <Image
                                src={activeImage}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <h4 className="text-white font-serif">{product.title}</h4>
            {images.length > 1 && (
                <div className="flex gap-1 mt-2">
                    {images.map((_, i) => (
                        <div key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-[var(--terracotta)]' : 'w-1 bg-white/20'}`} />
                    ))}
                </div>
            )}
        </Link>
    );
};

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

    // Auto-rotate images every 20 seconds
    React.useEffect(() => {
        const interval = setInterval(() => {
            setActiveImageIndex(prev => (prev + 1) % displayImages.length);
        }, 20000); // 20 seconds
        return () => clearInterval(interval);
    }, [displayImages.length]);

    const handleVariantSelect = (variantName: string) => {
        const v = product.variants?.find(v => v.name === variantName) || null;
        setSelectedVariant(v);
        setActiveImageIndex(0);
    };

    return (
        <main className="bg-[#1a1512] text-[#EBE5E0] min-h-screen selection:bg-[var(--terracotta)] selection:text-white pb-32 lg:pb-0 overflow-x-hidden w-full relative">

            {/* --- HERO SECTION: Swiss Hierarchy --- */}
            <section className="relative min-h-[90vh] flex flex-col pt-28 pb-12 px-4 md:px-12 max-w-[1800px] mx-auto">

                {/* Mobile Breadcrumbs: Standard Flow (Scrollable) */}
                <div className="lg:hidden w-full mb-6 z-10 relative overflow-x-auto no-scrollbar whitespace-nowrap px-1">
                    <Breadcrumbs range={product.range} />
                </div>

                <div className="flex-1 grid lg:grid-cols-12 gap-4 lg:gap-24 items-center">

                    {/* LEFT: Typography & Context */}
                    <div className="lg:col-span-5 relative z-10 flex flex-col justify-center order-1 lg:order-1">
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
                            <span className="inline-block mb-3 lg:mb-6 text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-[10px] lg:text-xs">
                                {product.category?.title || 'Collection'}
                            </span>

                            {/* H1: Commanding, Minimal */}
                            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-[#EBE5E0] leading-[0.9] mb-4 lg:mb-8 tracking-tight break-words hyphens-auto w-full">
                                {product.title}
                                {(selectedVariant?.name || product.variants?.find(v => v.imageUrl === activeImage)?.name) && (
                                    <span className="block text-3xl md:text-5xl lg:text-6xl text-[var(--terracotta)] mt-2 font-light italic">
                                        {selectedVariant?.name || product.variants?.find(v => v.imageUrl === activeImage)?.name}
                                    </span>
                                )}
                            </h1>

                            {/* Body: Breathable, High Readability */}
                            <p className="text-base md:text-xl text-white/60 font-light leading-relaxed mb-6 lg:mb-10 max-w-xl border-l-[3px] border-[var(--terracotta)] pl-6">
                                {product.subtitle || 'Premium handcrafted clay for timeless architecture. Engineered for durability and designed for elegance.'}
                            </p>

                            {/* Micro: Origin Data */}
                            <div className="flex items-center gap-6 text-[10px] lg:text-xs font-mono text-white/30 uppercase tracking-[0.15em] mb-4 lg:mb-0">
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

                    {/* RIGHT: Product Container + Chips (Visual Block) */}
                    <div className="lg:col-span-7 w-full flex flex-col gap-6 lg:gap-10 items-center justify-center order-2 lg:order-2">

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
                                        {/* Main Image Badge Overlay */}
                                        {((selectedVariant?.badge) || (!selectedVariant && product.variants?.find(v => v.imageUrl === activeImage)?.badge)) && (
                                            <div className={`absolute top-6 right-6 px-3 py-1.5 text-xs font-bold uppercase text-white rounded shadow-sm z-20 ${(selectedVariant?.badge || product.variants?.find(v => v.imageUrl === activeImage)?.badge) === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                                {(selectedVariant?.badge || product.variants?.find(v => v.imageUrl === activeImage)?.badge)}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {displayImages.length > 1 && (
                                <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 md:gap-2 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-2 rounded-full border border-white/10 transition-all">
                                    <button onClick={() => setActiveImageIndex((i) => (i - 1 + displayImages.length) % displayImages.length)} className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors">←</button>
                                    <span className="text-[9px] md:text-[10px] font-mono font-medium text-white/60 w-10 md:w-12 text-center">{activeImageIndex + 1} / {displayImages.length}</span>
                                    <button onClick={() => setActiveImageIndex((i) => (i + 1) % displayImages.length)} className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:bg-white/20 text-white transition-colors">→</button>
                                </div>
                            )}

                            {/* Small Cute Add to Sample Button - Hover Only */}
                            <motion.button
                                onClick={() => addToBox({
                                    id: product.slug,
                                    name: selectedVariant?.name ? `${product.title} - ${selectedVariant.name}` : product.title,
                                    color: '#b45a3c',
                                    texture: activeImage ? `url('${activeImage}')` : '#b45a3c'
                                })}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:from-[var(--terracotta)]/30 hover:to-[var(--terracotta)]/20 hover:border-[var(--terracotta)]/50 transition-all duration-300"
                                title="Add to Sample Box"
                            >
                                <svg className="w-4 h-4 md:w-4.5 md:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* --- VARIANT CHIPS: MOBILE (Horizontal Scroll) --- */}
                        <div className="w-full max-w-[90vw] lg:hidden mt-4 flex flex-col items-center">
                            {product.variants && product.variants.length > 0 && (
                                <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 py-2 snap-x w-full justify-start md:justify-center">
                                    {product.variants.map((v, i) => (
                                        <button
                                            key={v._key || i}
                                            onClick={() => handleVariantSelect(v.name)}
                                            className={`flex-shrink-0 relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 snap-center ${selectedVariant?.name === v.name || (!selectedVariant && activeImage === v.imageUrl)
                                                ? 'border-[var(--terracotta)] ring-2 ring-[var(--terracotta)] ring-offset-2 ring-offset-[#120d0b] scale-110'
                                                : 'border-white/20'
                                                }`}
                                            title={v.name}
                                        >
                                            {v.imageUrl ? (
                                                <Image
                                                    src={v.imageUrl}
                                                    alt={v.name}
                                                    fill
                                                    sizes="56px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#3a3430]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 text-center h-6">
                                {(selectedVariant || product.variants?.find(v => v.imageUrl === activeImage)) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={selectedVariant?.name || activeImage}
                                        className="text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-[var(--terracotta)]"></span>
                                        {selectedVariant?.name || product.variants?.find(v => v.imageUrl === activeImage)?.name}
                                    </motion.div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- VARIANT CHIPS: DESKTOP (Full Width Grid) --- */}
                <div className="mt-20 w-full hidden lg:flex flex-col items-center border-t border-white/5 pt-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-8">Select Variant</span>
                    {product.variants && product.variants.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-6">
                            {product.variants.map((v, i) => (
                                <button
                                    key={v._key || i}
                                    onClick={() => handleVariantSelect(v.name)}
                                    className={`group/btn relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${selectedVariant?.name === v.name || (!selectedVariant && activeImage === v.imageUrl)
                                        ? 'border-[var(--terracotta)] ring-2 ring-[var(--terracotta)] ring-offset-4 ring-offset-[#120d0b] scale-110'
                                        : 'border-white/20 hover:border-white/60 hover:scale-105'
                                        }`}
                                    title={v.name}
                                >
                                    {v.imageUrl ? (
                                        <Image
                                            src={v.imageUrl}
                                            alt={v.name}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#3a3430]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="mt-6 text-center h-8">
                        {(selectedVariant || product.variants?.find(v => v.imageUrl === activeImage)) && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={selectedVariant?.name || activeImage}
                                className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>
                                {selectedVariant?.name || product.variants?.find(v => v.imageUrl === activeImage)?.name}
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>

            {/* --- OVERVIEW & SPECS: Centered Layout (Sidebar Removed) --- */}
            <section className="py-20 md:py-32 px-4 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="max-w-5xl mx-auto space-y-24">

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
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                                    {generateLuxurySpecs(product).map((spec, i) => (
                                        <div key={i} className="flex flex-col border-b border-white/5 pb-4 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg px-2 -mx-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">
                                                {spec.label}
                                            </span>
                                            <div>
                                                <span className="block text-xl font-mono font-bold leading-none tracking-tight uppercase mb-2 text-[#EBE5E0]">
                                                    {spec.value}
                                                </span>
                                                <p className="text-xs leading-relaxed text-white/50 font-medium">
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
            </section >

            {/* --- CURATED PALETTE (Related) --- */}
            {
                relatedProducts && relatedProducts.length > 0 && (
                    <section className="py-20 md:py-32 border-t border-white/5 relative bg-[#1f1a16]">
                        <div className="max-w-[1800px] mx-auto px-4 md:px-6 relative z-10">
                            <div className="mb-12">
                                <h2 className="text-3xl font-serif text-[#EBE5E0]">Curated Palette</h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.slice(0, 4).map((bgProduct) => (
                                    <CuratedProductCard key={bgProduct.slug} product={bgProduct} />
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} productName={product.title} variantName={selectedVariant?.name} />

            {/* --- UNIFIED STICKY DOCK (Mobile & Desktop) --- */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1512]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="max-w-[1800px] mx-auto w-full px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Desktop Price Display */}
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Estimated Price</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-serif text-[#EBE5E0]">{product.priceRange?.split('/')[0] || 'Inquire'}</span>
                            {product.priceRange && <span className="text-xs text-white/40 font-light lowercase">/ sq.ft</span>}
                        </div>
                    </div>

                    {/* Buttons Container */}
                    <div className="flex w-full md:w-auto gap-3 md:gap-4">
                        <button onClick={() => addToBox({ id: product.slug, name: product.title, color: '#b45a3c', texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c' })} className="flex-1 md:flex-none md:w-48 py-3.5 md:py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                            + Add To Sample Box
                        </button>
                        <button onClick={() => setIsQuoteModalOpen(true)} className="flex-[2] md:flex-none md:w-64 py-3.5 md:py-4 bg-[var(--terracotta)] hover:bg-[#a85638] text-white rounded-xl text-center font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-lg shadow-orange-900/20">
                            Get Custom Quote
                        </button>
                    </div>
                </div>
            </div>

        </main >
    );
}
