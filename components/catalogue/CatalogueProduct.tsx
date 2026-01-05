import React from 'react';
import { Product } from '@/lib/products';
import { generateLuxurySpecs, generateArtisticDescription } from '@/lib/catalogue-content';

interface CatalogueProductProps {
    product: Product;
    index: number;
    version?: 'light' | 'full';
}

export default function CatalogueProduct({ product, index, version = 'full' }: CatalogueProductProps) {
    // OPTIMIZATION: Request high-res images for print quality
    // Priority: Main Image -> First Gallery Image -> First Variant Image -> Fallback
    let mainImageRaw =
        product.imageUrl ||
        (product.images && product.images[0]) ||
        (product.variants && product.variants[0] && product.variants[0].imageUrl);

    // Fallback if absolutely nothing found
    if (!mainImageRaw) {
        console.warn(`[Catalogue] Missing image for product: ${product.title}`);
        mainImageRaw = '/images/menu-cladding.jpg'; // Reliable local fallback
    }

    // Append params only if it's a Sanity/External URL (contains http)
    const isRemote = mainImageRaw.startsWith('http');
    const mainImage = isRemote && !mainImageRaw.includes('placeholder')
        ? (mainImageRaw.includes('?') ? `${mainImageRaw}&w=1600&q=90&auto=format` : `${mainImageRaw}?w=1600&q=90&auto=format`)
        : mainImageRaw;

    const pageNum = index.toString().padStart(3, '0');
    const luxurySpecs = generateLuxurySpecs(product);
    const artisticNote = generateArtisticDescription(product);

    // DUAL LAYOUT: Desktop = Split, Mobile = Vertical Flow
    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] relative overflow-hidden flex flex-col md:grid md:grid-cols-12 p-8 md:p-12 gap-8 md:gap-16 font-sans">

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

            {/* --- LEFT COLUMN: NARRATIVE & SPECS (Col-Span-5) --- */}
            <div className="relative z-10 md:col-span-5 flex flex-col justify-between h-full order-2 md:order-1">

                {/* Header Info */}
                <div>
                    <div className="flex items-baseline gap-4 mb-6 border-b border-black pb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--terracotta)] truncate max-w-[150px]">
                            {product.category?.title || 'Architectural System'}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400 ml-auto flex-shrink-0">REF.{product.slug.slice(0, 3).toUpperCase()}-{pageNum}</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif leading-[0.95] text-[#1a1512] mb-6 break-words tracking-tight">
                        {product.title}
                    </h1>

                    <p className="text-sm md:text-base font-serif italic text-neutral-600 leading-relaxed mb-8">
                        "{artisticNote}"
                    </p>
                </div>

                {/* Technical "Receipt" Spec Sheet */}
                <div className="mt-auto">
                    <strong className="block text-[9px] uppercase tracking-[0.2em] mb-4 border-b border-black pb-2">Technical Data</strong>
                    <ul className="grid grid-cols-1 gap-0">
                        {luxurySpecs.map((spec, i) => (
                            <li key={i} className="flex justify-between py-2 border-b border-black/10 text-xs items-center group hover:bg-black/5 px-2 -mx-2 transition-colors">
                                <span className="uppercase tracking-wider text-neutral-500 text-[10px]">{spec.label}</span>
                                <span className="font-mono font-medium text-[#1a1512] text-right">{spec.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* --- RIGHT COLUMN: IMMERSIVE VISUAL (Col-Span-7) --- */}
            <div className="relative z-10 md:col-span-7 h-[50vh] md:h-full order-1 md:order-2 min-h-[400px]">
                <div className="w-full h-full relative bg-white p-2 shadow-2xl shadow-black/5 rotate-1 md:rotate-0 transition-transform duration-700 hover:rotate-0">
                    <div className="w-full h-full relative overflow-hidden bg-neutral-100 transition-all duration-1000 ease-out">
                        <img
                            src={mainImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none mix-blend-multiply"></div>
                    </div>

                    {/* Image Caption/Badge */}
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-3 py-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#1a1512]">Scale 1:1</span>
                    </div>
                </div>

                {/* GIANT PAGE NUMBER */}
                <span className="absolute -bottom-16 -right-16 text-[200px] font-serif font-bold text-black/5 leading-none select-none pointer-events-none md:block hidden">
                    {pageNum}
                </span>
            </div>

            {/* --- MOBILE FOOTER --- */}
            <div className="md:hidden mt-8 pt-4 border-t border-black/10 flex justify-between text-[10px] text-neutral-400 order-3">
                <span>UrbanClay Monograph</span>
                <span>Page {pageNum}</span>
            </div>

        </div>
    );
}
