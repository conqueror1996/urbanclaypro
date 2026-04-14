'use client'; // Trigger deployment after reconnect

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PRODUCT_CATEGORIES = [
    {
        title: 'Flexible Brick Tiles',
        subtitle: 'Ultra-Thin Cladding',
        href: '/flexible-brick-tiles',
        color: 'from-[#b45a3c]/80 to-[#96472d]/80',
        image: '/images/megamenu/menu_flexible_brick_1775251589486.png'
    },
    {
        title: 'Terracotta Panels',
        subtitle: 'Rainscreen Facades',
        href: '/terracotta-panels',
        color: 'from-[#8c7b70] to-[#5d554f]',
        image: '/images/megamenu/menu_terracotta_panel_1775251606050.png'
    },
    {
        title: 'Exposed Bricks',
        subtitle: 'Authentic Masonry',
        href: '/exposed-brick',
        color: 'from-[#d6cbb8] to-[#bfae96]',
        image: '/images/megamenu/menu_exposed_brick_smooth_1775251795568.png'
    },
    {
        title: 'Handmade Cladding',
        subtitle: 'Artisanal Brick Tiles',
        href: '/handmade-brick-tiles',
        color: 'from-[#EBE5E0] to-[#d6cbb8]',
        image: '/images/megamenu/menu_handmade_brick_1775251638671.png'
    },
    {
        title: 'Terracotta Jaali',
        subtitle: 'Breathable Screens',
        href: '/terracotta-jali',
        color: 'from-[#2A1E16] to-[#1a1512]',
        image: '/images/megamenu/menu_terracotta_jaali_1775251656687.png'
    }
];

interface MegaMenuProps {
    onClose: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

export default function MegaMenu({ onClose, onMouseEnter, onMouseLeave }: MegaMenuProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="hidden md:block absolute top-full left-0 right-0 bg-[var(--sand)] border-t border-[var(--line)] shadow-2xl z-40 overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-12 gap-12">
                    {/* Intro Column */}
                    <div className="col-span-3">
                        <h3 className="font-serif text-2xl text-[var(--ink)] mb-3">Refined Earth</h3>
                        <p className="text-sm text-[var(--ink)]/60 leading-relaxed mb-6">
                            Explore our curated collection of handcrafted terracotta and clay products designed for modern architecture.
                        </p>
                        <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta)] hover:text-[var(--ink)] transition-colors flex items-center gap-2">
                            View Full Catalog
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>

                    {/* Visual Categories Grid */}
                    <div className="col-span-9 grid grid-cols-5 gap-4">
                        {PRODUCT_CATEGORIES.map((cat, idx) => (
                            <Link
                                key={idx}
                                href={cat.href}
                                className="group block relative rounded-xl overflow-hidden aspect-[3/4] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 transform-gpu"
                                onClick={onClose}
                            >
                                {/* Background Image with Fallback Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} z-0`} />
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    unoptimized={process.env.NODE_ENV === 'development'}
                                    priority
                                    className="object-cover opacity-50 group-hover:scale-110 group-hover:opacity-60 transition-all duration-700 z-[1] transform-gpu"
                                />

                                {/* Overlay Content */}
                                <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none">
                                    <p className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-90 !text-white transform-gpu">
                                        {cat.subtitle}
                                    </p>
                                    <h4 className="font-serif text-lg leading-tight !text-white group-hover:underline decoration-1 underline-offset-4 transform-gpu">
                                        {cat.title}
                                    </h4>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
