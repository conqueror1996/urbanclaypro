import React from 'react';
import { Product } from '@/lib/products';

interface CatalogueGridProps {
    products: Product[];
    index: number;
    title: string;
}

export default function CatalogueGrid({ products, index, title }: CatalogueGridProps) {
    // If no products, skip
    if (!products || products.length === 0) return null;

    const pageNum = index.toString().padStart(3, '0');

    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] relative flex flex-col p-12 font-sans overflow-hidden">
            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

            {/* HEADER */}
            <div className="relative z-10 flex items-baseline justify-between mb-12 border-b border-black pb-4">
                <div>
                    <h1 className="text-3xl font-serif font-medium text-[#1a1512]">{title}</h1>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">UrbanClay Architectural Collection</p>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">PAGE {pageNum}</span>
            </div>

            {/* ARTISTIC GRID */}
            <div className="relative z-10 flex-grow grid grid-cols-2 gap-x-8 gap-y-12 content-start">

                {products.map((p, idx) => {
                    let imgUrl =
                        p.imageUrl ||
                        (p.images && p.images[0]) ||
                        (p.variants && p.variants[0] && p.variants[0].imageUrl) ||
                        '/images/menu-cladding.jpg';

                    if (imgUrl.startsWith('http') && !imgUrl.includes('placeholder')) {
                        imgUrl = imgUrl.includes('?') ? `${imgUrl}&w=800&q=85&auto=format` : `${imgUrl}?w=800&q=85&auto=format`;
                    }

                    return (
                        <div key={p._id} className="flex flex-col gap-3 group break-inside-avoid">
                            {/* Image Container */}
                            <div className="aspect-[4/3] w-full bg-neutral-100 overflow-hidden relative shadow-sm">
                                <img
                                    src={imgUrl}
                                    alt={p.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                {p.price && (
                                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-[9px] font-bold">
                                        ₹{p.price}/sq.ft
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col">
                                <h3 className="text-lg font-serif leading-tight mb-1 group-hover:text-[var(--terracotta)] transition-colors">
                                    {p.title.replace('The ', '')}
                                </h3>
                                <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-wide">
                                    {p.specs?.size || 'Standard Module'}
                                </p>
                                {/* Variant Chips if multiple */}
                                {p.variants && p.variants.length > 1 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {p.variants.slice(0, 5).map(v => (
                                            <span key={v._key} className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: v.color || '#ccc' }} title={v.name}></span>
                                        ))}
                                        {p.variants.length > 5 && <span className="text-[9px] text-gray-400">+</span>}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

            </div>

            {/* FOOTER */}
            <div className="relative z-10 mt-auto pt-6 border-t border-black/10 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-[#1a1512]">Fired Earth • Timeless Architecture</span>
                <span className="text-[9px] font-mono text-neutral-400">100+ Years Lifespan</span>
            </div>
        </div>
    );
}
