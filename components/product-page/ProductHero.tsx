'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/products';
import { useSampleBox } from '@/context/SampleContext';

interface ProductHeroProps {
    product: Product;
    quoteUrl: string;
    otherVariants?: { name: string; imageUrl?: string; slug: string; categorySlug?: string }[];
    selectedVariantName?: string;
}

export default function ProductHero({ product, quoteUrl, otherVariants, selectedVariantName }: ProductHeroProps) {
    const { addToBox } = useSampleBox();
    const [activeIndex, setActiveIndex] = useState(0);

    // Determines active gallery images based on variant selection
    const activeVariant = selectedVariantName
        ? product.variants?.find(v => v.name === selectedVariantName)
        : null;

    const currentGallery = activeVariant
        ? [activeVariant.imageUrl, ...(activeVariant.gallery || [])].filter(Boolean) as string[]
        : [
            product.imageUrl,
            ...(product.images?.map(i => typeof i === 'string' ? i : i.url) || []),
            ...(product.variants?.map(v => v.imageUrl) || [])
        ].filter(Boolean) as string[];

    const displayImages = currentGallery.length > 0 ? currentGallery : [''];
    const activeImage = displayImages[activeIndex];

    return (
        <section className="animate-fade-in-up md:px-0 relative z-0 pb-20 md:pb-32">
            {/* Header Title (Mobile) */}
            <div className="md:hidden mb-8">
                <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-2 block">
                    {product.tag || 'Collection'}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif text-[#2A1E16] leading-[1.1] mb-2">{product.title}</h1>
                <p className="text-[#5d554f]">{product.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-20 items-start">

                {/* LEFT: Gallery (7 Cols) */}
                <div className="lg:col-span-7 lg:sticky lg:top-32">
                    <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#F2F0ED] shadow-sm group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
                            >
                                {activeImage ? (
                                    <Image
                                        src={activeImage}
                                        alt={product.title}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Arrows */}
                        {displayImages.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between p-4 md:p-6 pointer-events-none z-10">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length); }}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform pointer-events-auto text-[#2A1E16]"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveIndex((prev) => (prev + 1) % displayImages.length); }}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform pointer-events-auto text-[#2A1E16]"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Product Details (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-10 py-2">
                    {/* 1. Header & Title (Desktop) */}
                    <div className="hidden md:block">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-[#F5EEE7] text-[var(--terracotta)] text-[10px] uppercase font-bold tracking-widest rounded-full">
                                {product.tag || 'New Arrival'}
                            </span>
                            {/* Badges */}
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400">
                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    ISO Certified
                                </span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-serif text-[#2A1E16] leading-[1.1] mb-4">
                            {product.title}
                        </h1>
                        <p className="text-lg text-[#5d554f] font-light leading-relaxed">
                            {product.subtitle || 'Premium handcrafted clay for timeless architecture.'}
                        </p>
                    </div>

                    {/* 2. Key Specs Grid */}
                    <div className="grid grid-cols-2 gap-y-4 border-t border-b border-[#EBE5E0] py-6">
                        <div className="pr-4 border-r border-[#EBE5E0]">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Dimensions</span>
                            <span className="font-serif text-lg text-[#2A1E16] block">{product.specs?.size || 'Custom sizes'}</span>
                        </div>
                        <div className="pl-4">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Finish</span>
                            <span className="font-serif text-lg text-[#2A1E16] block">{activeVariant ? activeVariant.name : 'Matte / Natural'}</span>
                        </div>
                        <div className="pr-4 border-r border-[#EBE5E0]">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Material</span>
                            <span className="font-serif text-lg text-[#2A1E16] block">Natural Clay</span>
                        </div>
                        <div className="pl-4">
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lead Time</span>
                            <span className="font-serif text-lg text-[#2A1E16] block">7-10 Days</span>
                        </div>
                    </div>

                    {/* 3. Variant Selector (Chips) */}
                    {product.variants && product.variants.length > 0 && (
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#9C8C74] mb-4 block">Available Finishes</span>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((v, i) => {
                                    const isSelected = selectedVariantName === v.name;
                                    return (
                                        <Link
                                            key={i}
                                            href={`?variant=${encodeURIComponent(v.name)}`}
                                            className={`flex items-center gap-3 pr-4 rounded-full border transition-all ${isSelected ? 'bg-[#2A1E16] border-[#2A1E16] text-white shadow-lg transform scale-105' : 'bg-white border-[#EBE5E0] hover:border-[#2A1E16] text-[#2A1E16]'}`}
                                        >
                                            <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white">
                                                {v.imageUrl ? <Image src={v.imageUrl} alt={v.name} fill className="object-cover" /> : <div className="bg-gray-200 w-full h-full" />}
                                            </div>
                                            <div className="flex flex-col text-left py-1">
                                                <span className="text-xs font-bold uppercase tracking-wide leading-none">{v.name}</span>
                                                {/* Optional mini-desc */}
                                                <span className={`text-[9px] mt-0.5 leading-none ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>Standard Grade</span>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* 4. Pricing & CTA Box */}
                    <div className="bg-[#FAF8F6] p-6 rounded-2xl border border-[#EBE5E0]">
                        <div className="flex flex-col gap-1 mb-6">
                            <div className="flex items-baseline gap-2 group relative w-fit cursor-help">
                                <span className="text-4xl font-serif font-bold text-[#2A1E16]">
                                    {product.priceRange && product.priceRange !== 'On Request' ? product.priceRange.split('/')[0] : 'Price on Request'}
                                </span>
                                {product.priceRange && product.priceRange !== 'On Request' && (
                                    <span className="text-sm text-gray-400 font-medium">/ sq.ft</span>
                                )}
                                {/* Tooltip */}
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 w-48 bg-black text-white text-xs p-2 rounded hidden group-hover:block z-10">
                                    Base price. Varies by quantity & finish choice.
                                </div>
                            </div>
                            <p className="text-xs text-green-700 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                In Stock - Ships in 24hrs
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href={quoteUrl}
                                className="w-full py-4 bg-[#2A1E16] text-white rounded-xl font-bold tracking-wide hover:bg-black transition-all shadow-xl text-center flex items-center justify-center gap-2 group"
                            >
                                Get Exact Quote
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <div className="text-center">
                                <span className="text-[10px] text-gray-400 font-medium">Typically responds within 4 hours</span>
                            </div>

                            <button
                                onClick={() => addToBox({
                                    id: product.slug,
                                    name: product.title,
                                    color: '#b45a3c',
                                    texture: product.imageUrl ? `url('${product.imageUrl}')` : '#b45a3c'
                                })}
                                className="w-full py-3.5 bg-white border border-[#EBE5E0] text-[#2A1E16] rounded-xl font-bold hover:bg-[#F2F0ED] hover:border-[#d6cbb8] transition-all flex items-center justify-center gap-2"
                            >
                                <span>Order Sample</span>
                            </button>
                        </div>
                    </div>

                    {/* Trust Signals */}
                    <div className="flex items-center gap-6 pt-4 border-t border-[#EBE5E0]">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-[#EBE5E0] text-[#2A1E16]"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Pan-India</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-[#EBE5E0] text-[#2A1E16]"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Low Efflorescence</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-[#EBE5E0] text-[#2A1E16]"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Long Life</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
