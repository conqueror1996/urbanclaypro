'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Variant {
    name: string;
    imageUrl?: string;
    slug: string;
    categorySlug?: string;
    priceRange?: string;
    badge?: string;
}

interface CollectionVariantsProps {
    variants: Variant[];
    title?: string;
}

export default function CollectionVariants({ variants, title }: CollectionVariantsProps) {
    if (!variants || variants.length === 0) return null;

    return (
        <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                <div>
                    <span className="text-[var(--terracotta)] text-xs font-bold tracking-widest uppercase mb-3 block">
                        Collection
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16]">
                        {title || "More Options"}
                    </h2>
                </div>
                <Link href="/products" className="text-sm font-bold uppercase tracking-wider border-b border-[#2A1E16] pb-1 hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors self-center md:self-end">
                    View Entire Catalog
                </Link>
            </div>

            {/* Horizontal Scrollable Row */}
            <div className="relative -mx-4 md:mx-0">
                <div className="flex gap-6 overflow-x-auto pb-4 px-4 md:px-0 snap-x snap-mandatory scrollbar-hide">
                    {variants.map((variant, index) => (
                        <motion.div
                            key={`${variant.slug}-${index}`}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="flex-shrink-0 w-64 snap-start"
                        >
                            <Link
                                href={`/products/${variant.categorySlug || 'products'}/${variant.slug}`}
                                className="group block"
                            >
                                <div className="aspect-[3/4] relative bg-[#f4f1ee] overflow-hidden rounded-2xl mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    {variant.imageUrl ? (
                                        <Image
                                            src={variant.imageUrl}
                                            alt={variant.name}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#2A1E16]/20">
                                            <span className="text-xs font-bold uppercase">No Image</span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="bg-white text-[#2A1E16] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                            View
                                        </span>
                                    </div>

                                    {variant.badge && (
                                        <div className={`absolute top-2 left-2 px-2 py-1 text-[9px] font-bold uppercase text-white rounded shadow-sm ${variant.badge === 'Hot' ? 'bg-red-600' : 'bg-[var(--terracotta)]'}`}>
                                            {variant.badge}
                                        </div>
                                    )}
                                </div>

                                <div className="text-center px-2">
                                    <h3 className="text-lg font-serif text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors line-clamp-2">
                                        {variant.name}
                                    </h3>
                                    {variant.priceRange && (
                                        <p className="text-xs text-gray-400 font-medium mt-1">
                                            {variant.priceRange.split('/')[0]} / sq.ft
                                        </p>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Scroll Indicator (optional) */}
                {variants.length > 4 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white via-white to-transparent w-20 h-full pointer-events-none hidden md:block" />
                )}
            </div>
        </section>
    );
}
