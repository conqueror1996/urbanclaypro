'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PRODUCT_CATEGORIES = [
    {
        title: 'Flexible Brick Tiles',
        subtitle: 'Ultra-Thin Cladding',
        href: '/flexible-brick-tile',
        color: 'from-[#b45a3c] to-[#96472d]',
        image: '/images/menu-exposed.jpg'
    },
    {
        title: 'Terracotta Panels',
        subtitle: 'Rainscreen Facades',
        href: '/terracotta-panels',
        color: 'from-[#8c7b70] to-[#5d554f]',
        image: '/images/menu-cladding.jpg'
    },
    {
        title: 'Exposed Bricks',
        subtitle: 'Authentic Masonry',
        href: '/exposed-brick',
        color: 'from-[#d6cbb8] to-[#bfae96]',
        image: '/images/menu-jaali.jpg'
    },
    {
        title: 'Handmade Brick Tiles',
        subtitle: 'Artisanal Beauty',
        href: '/handmade-brick-tiles',
        color: 'from-[#EBE5E0] to-[#d6cbb8]',
        image: '/images/menu-floor.jpg'
    },
    {
        title: 'Terracotta Jaali',
        subtitle: 'Breathable Screens',
        href: '/terracotta-jali',
        color: 'from-[#2A1E16] to-[#1a1512]',
        image: '/images/menu-roof.jpg'
    }
];

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    pathname: string;
    searchParams: any;
    navLinks: any[];
    boxLength: number;
    setBoxOpen: (open: boolean) => void;
}

export default function MobileMenu({
    isOpen,
    onClose,
    pathname,
    searchParams,
    navLinks,
    boxLength,
    setBoxOpen
}: MobileMenuProps) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
                style={{ top: '0' }}
            />
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[var(--background)] shadow-2xl md:hidden z-[60] overflow-y-auto overscroll-contain border-r border-[var(--line)]"
                data-lenis-prevent
            >
                <div className="p-6 flex flex-col gap-6">
                    {/* Header in Menu */}
                    <div className="flex items-center justify-between mb-2">
                        <Link href="/" onClick={onClose}>
                            <Image
                                src="/urbanclay-logo.png"
                                alt="UrbanClay"
                                width={120}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </Link>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <div className="py-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">Products</h4>
                            <div className="pl-2 flex flex-col gap-2 border-l-2 border-gray-100">
                                {PRODUCT_CATEGORIES.map((cat, idx) => {
                                    const isActive = pathname === cat.href || (cat.href.includes('?') && pathname === cat.href.split('?')[0] && searchParams.toString() === cat.href.split('?')[1]);
                                    return (
                                        <Link
                                            key={idx}
                                            href={cat.href}
                                            onClick={onClose}
                                            className={`min-h-[48px] py-3 flex items-center justify-between group active:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 ${isActive ? 'bg-gray-50' : ''}`}
                                        >
                                            <span className={`text-base font-serif transition-colors ${isActive ? 'text-[var(--terracotta)] font-bold' : 'text-[#2A1E16] group-hover:text-[var(--terracotta)]'}`}>
                                                {cat.title}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider text-gray-600">{cat.subtitle}</span>
                                        </Link>
                                    );
                                })}
                                <Link
                                    href="/products"
                                    onClick={onClose}
                                    className="mt-2 min-h-[44px] py-3 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] flex items-center gap-2"
                                >
                                    View All Products →
                                </Link>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100 my-2" />

                        {navLinks.filter(l => l.label !== 'Products').map((link) => {
                            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={onClose}
                                    className={`min-h-[52px] py-4 text-lg font-serif font-medium flex justify-between items-center border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 ${isActive ? 'text-[var(--terracotta)] font-bold bg-gray-50' : 'text-[#2A1E16]'}`}
                                >
                                    {link.label}
                                    <svg className={`w-4 h-4 ${isActive ? 'text-[var(--terracotta)]' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto pt-8 space-y-4">
                        <button
                            onClick={() => {
                                setBoxOpen(true);
                                onClose();
                            }}
                            className="w-full min-h-[52px] py-4 bg-[var(--terracotta)] text-white font-bold rounded-xl uppercase tracking-wider text-sm shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            aria-label={boxLength > 0 ? `Get samples, ${boxLength} items in tray` : "Get samples"}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                            Get Samples {boxLength > 0 && <span className="bg-white text-[var(--terracotta)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{boxLength}</span>}
                        </button>
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-600 mb-2">Need help?</p>
                            <a href="tel:+918080081951" className="text-base font-medium text-[#2A1E16] block min-h-[44px] flex items-center justify-center hover:text-[var(--terracotta)] transition-colors">+91 80800 81951</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
