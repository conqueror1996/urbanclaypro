'use client';

import React from 'react';
import { Product } from '@/lib/products';
import { generateLuxurySpecs, generateArtisticDescription } from '@/lib/catalogue-content';

interface CatalogueProductProps {
    product: Product;
    index: number;
}

export default function CatalogueProduct({ product, index }: CatalogueProductProps) {
    // OPTIMIZATION: Request lighter images (1200px width, 75% quality) to reduce PDF size significantly
    const mainImageRaw = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/1000x1000?text=No+Image';
    const mainImage = mainImageRaw.includes('?') ? `${mainImageRaw}&w=1200&q=75&auto=format` : `${mainImageRaw}?w=1200&q=75&auto=format`;

    const pageNum = index.toString().padStart(3, '0');

    const luxurySpecs = generateLuxurySpecs(product);
    const artisticNote = generateArtisticDescription(product);

    return (
        <div className="w-full h-full bg-[#E8E6E1] text-[#111] relative flex flex-col p-8 overflow-hidden font-sans print:bg-white print:p-0">

            {/* Decorative 'Punch Holes' - HIDDEN ON PRINT */}
            <div className="absolute left-2 top-0 bottom-0 w-8 flex flex-col justify-center gap-20 items-center z-10 border-r border-[#111]/10 print:hidden">
                <div className="w-3 h-3 rounded-full bg-[#111]/10"></div>
                <div className="w-3 h-3 rounded-full bg-[#111]/10"></div>
                <div className="w-3 h-3 rounded-full bg-[#111]/10"></div>
            </div>

            {/* 1. HEADER: RAW & BOLD with LOGO */}
            <div className="w-full border-b-4 border-black pb-4 mb-4 flex justify-between items-end print:border-b-2">
                <div className="flex flex-col max-w-[80%]">
                    {/* BRAND LOGO */}
                    <div className="mb-4">
                        <span className="font-serif font-black text-2xl tracking-tighter italic text-black">UrbanClay</span>
                        <span className="text-[8px] uppercase tracking-[0.4em] block ml-1 text-neutral-500">Studio</span>
                    </div>
                    <h1 className="text-7xl font-serif font-black tracking-tighter uppercase leading-[0.8] mix-blend-multiply print:text-5xl">
                        {product.title}
                    </h1>
                </div>

                <div className="flex flex-col items-end text-right min-w-[150px]">
                    <div className="bg-black text-[#E8E6E1] px-3 py-1 text-[10px] uppercase font-bold tracking-[0.25em] mb-1 print:bg-transparent print:text-black print:border print:border-black">
                        {product.category?.title || 'System'}
                    </div>
                    <span className="font-mono text-sm tracking-tighter font-bold text-neutral-500">
                        NO. {product.slug.slice(0, 3).toUpperCase()}-{index}
                    </span>
                </div>
            </div>

            <div className="flex-grow flex gap-8 print:block">

                {/* 2. LEFT COLUMN: IMAGE & NOTE (65% Width) */}
                <div className="w-[65%] flex flex-col gap-6 h-full print:w-full print:h-auto print:mb-8">

                    {/* Image Container - Raw Border */}
                    <div className="flex-grow w-full border-2 border-black bg-white p-1 relative group print:border-0 print:p-0">
                        <img
                            src={mainImage}
                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/1000x1000?text=URBAN+CLAY'; }}
                            alt={product.title}
                            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 print:grayscale-0 print:contrast-100 print:h-[400px] print:object-contain print:object-left"
                        />
                        {/* Technical Overlay */}
                        <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 text-[8px] font-mono print:hidden">
                            IMG_REF_{index}A
                        </div>
                    </div>

                    {/* Artistic Note - Bottom of Image */}
                    <div className="border-l-4 border-black pl-4 py-1 print:border-l-2 print:mt-4">
                        <p className="font-serif italic text-2xl leading-none text-neutral-800 print:text-xl">
                            "{artisticNote}"
                        </p>
                    </div>

                </div>

                {/* 3. RIGHT COLUMN: TECHNICAL DATA (35% Width) */}
                <div className="w-[35%] flex flex-col pt-1 print:w-full print:grid print:grid-cols-2 print:gap-8">

                    <div className="mb-6 flex items-center gap-2 print:hidden">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Specification Data</span>
                    </div>

                    {/* Specs List - Stacked for safety, no horizontal crashing */}
                    <div className="flex flex-col border-t-2 border-black print:border-t">
                        {luxurySpecs.map((spec, i) => (
                            <div key={i} className="flex flex-col border-b border-black/20 py-4 print:py-2 print:border-neutral-200">
                                {/* Label */}
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-500 mb-1">
                                    {spec.label}
                                </span>

                                {/* Value - Large & Bold */}
                                <span className="text-xl font-mono font-bold leading-tight tracking-tight uppercase break-words">
                                    {spec.value}
                                </span>

                                {/* Detail - Small & Technical */}
                                <p className="text-[10px] leading-relaxed font-medium text-neutral-600 mt-2 max-w-[95%]">
                                    {spec.detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Variants / Finishes */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mt-auto pt-6 print:mt-0 print:pt-0">
                            <span className="text-[9px] font-bold uppercase tracking-widest mb-3 block">
                                Available Finishes
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.slice(0, 4).map((v, i) => (
                                    <div key={i} className="w-10 h-10 border border-black p-[2px] bg-white print:border-neutral-300">
                                        <img src={v.imageUrl} className="w-full h-full object-cover grayscale print:grayscale-0" />
                                    </div>
                                ))}
                                {product.variants.length > 4 && (
                                    <div className="w-10 h-10 border border-black flex items-center justify-center text-[10px] font-bold bg-black text-[#E8E6E1]">
                                        +{product.variants.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            </div>

            {/* FOOTER */}
            <div className="absolute bottom-6 left-8 font-mono text-[10px] tracking-widest uppercase text-neutral-400 print:bottom-0 print:left-0 print:text-black">
                Urban Clay Monograph / 2025 Volume
            </div>

        </div>
    );
}
