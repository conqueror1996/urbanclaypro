import React from 'react';
import { Product } from '@/lib/products';
import { generateLuxurySpecs, generateArtisticDescription } from '@/lib/catalogue-content';

interface CatalogueProductProps {
    product: Product;
    index: number;
    version?: 'light' | 'full';
}

export default function CatalogueProduct({ product, index, version = 'full' }: CatalogueProductProps) {
    // OPTIMIZATION: Request lighter images for print efficiency
    const mainImageRaw = product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/1000x1000?text=No+Image';
    const mainImage = mainImageRaw.includes('?') ? `${mainImageRaw}&w=1600&q=80&auto=format` : `${mainImageRaw}?w=1600&q=80&auto=format`;

    const pageNum = index.toString().padStart(3, '0');
    const luxurySpecs = generateLuxurySpecs(product);
    const artisticNote = generateArtisticDescription(product);

    if (version === 'light') {
        return (
            <div className="w-full h-full bg-white text-black flex flex-col p-4 md:p-12 font-sans">
                {/* LIGHT VERSION - Minimal Ink/Structure */}
                <div className="border-b border-black pb-4 mb-6 flex justify-between items-end">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold">{product.title}</h1>
                    <span className="font-mono text-xs text-neutral-500">REF.{product.slug.slice(0, 3).toUpperCase()}-{pageNum}</span>
                </div>

                <div className="flex-grow flex flex-col md:grid md:grid-cols-2 gap-8 mb-8">
                    <div className="aspect-square bg-neutral-100 relative max-h-[300px] md:max-h-none w-full">
                        {/* Smaller Image for Light Version */}
                        <img src={mainImage} className="w-full h-full object-contain" alt={product.title} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black/10 pb-2">Technical Specifications</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {luxurySpecs.slice(0, 5).map((spec, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                    <span className="text-neutral-500">{spec.label}</span>
                                    <span className="font-mono">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-black/10 text-[9px] text-neutral-400 flex justify-between">
                    <span>Urban Clay Light Catalogue</span>
                    <span>Page {pageNum}</span>
                </div>
            </div>
        );
    }

    // FULL VERSION (Original Premium Layout)
    return (
        <div className="w-full min-h-screen md:h-full bg-white text-black relative flex flex-col p-4 md:p-12 overflow-hidden font-sans print:p-0 print:m-0">

            {/* 1. TOP BAR: Brand & Identification */}
            <div className="flex justify-between items-end border-b border-black pb-4 mb-8">
                <div className="flex flex-col">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Urban Clay Monograph</span>
                    <span className="font-serif italic text-base md:text-lg text-black">Collection 2025</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-neutral-500 block mb-1">Reference</span>
                    <span className="font-mono text-xs md:text-sm font-bold block">REF.{product.slug.slice(0, 3).toUpperCase()}-{pageNum}</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID (Stack on mobile, Grid on desktop) */}
            <div className="flex-grow flex flex-col md:grid md:grid-cols-12 gap-8">

                {/* LEFT: Product Title & Description (Mobile: Top, Desktop: Left Col) */}
                <div className="w-full md:col-span-4 flex flex-col justify-between h-auto md:h-full md:border-r border-black/10 md:pr-8 order-2 md:order-1">
                    <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] mb-4 block">
                            {product.category?.title || 'Architectural System'}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif leading-[1] mb-6 md:mb-8 text-black break-words">
                            {product.title}
                        </h1>
                        <p className="font-serif italic text-lg md:text-xl text-neutral-600 leading-relaxed mb-8">
                            "{artisticNote}"
                        </p>
                    </div>

                    {/* Specs Table */}
                    <div className="border-t border-black w-full mt-4 md:mt-0">
                        {luxurySpecs.map((spec, i) => (
                            <div key={i} className="flex justify-between items-baseline py-3 border-b border-black/10">
                                <span className="text-[9px] uppercase tracking-widest text-neutral-500">{spec.label}</span>
                                <span className="text-xs font-mono font-bold text-right ml-4">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Visuals (Mobile: Hero, Desktop: Right Col) */}
                <div className="w-full md:col-span-8 flex flex-col h-auto md:h-full md:pl-4 order-1 md:order-2">

                    {/* Primary Image */}
                    <div className="w-full bg-neutral-100 relative mb-6 aspect-square md:aspect-auto md:flex-grow">
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    </div>

                    {/* Bottom Row: Variants & QR/Code (Hidden on small mobile to save space, visible on print/desktop) */}
                    <div className="hidden md:flex h-32 gap-6 items-start">
                        <div className="flex-grow">
                            <span className="text-[9px] uppercase tracking-widest text-neutral-400 mb-2 block">Available Finishes</span>
                            <div className="flex gap-2">
                                {product.variants && product.variants.slice(0, 5).map((v, i) => (
                                    <div key={i} className="w-16 h-16 border border-black/10">
                                        <img src={v.imageUrl} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-32 h-full border border-black p-2 flex flex-col justify-between items-center text-center">
                            <span className="text-[8px] uppercase tracking-widest text-neutral-500">Scan Comp.</span>
                            <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-[8px]">QR</div>
                        </div>
                    </div>

                </div>

            </div>

            {/* 3. FOOTER */}
            <div className="mt-8 pt-4 border-t border-black flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400">Page {pageNum}</span>
                <span className="text-[9px] uppercase tracking-widest text-neutral-400">Urban Clay Studio © All Rights Reserved</span>
            </div>

        </div>
    );
}
