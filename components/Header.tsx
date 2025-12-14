'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SampleModal from './SampleModal';
import { useSampleBox } from '@/context/SampleContext'; // Use context to show badge

// ... imports remain the same

// --- PREMIUM MEGA MENU CONFIGURATION ---
const PRODUCT_CATEGORIES = [
    {
        title: 'Exposed Bricks',
        subtitle: 'Authentic Masonry',
        href: '/products?category=Exposed%20Brick',
        // In a real app, use real asset URLs. Using colors/gradients for abstract premium feel if images missing.
        color: 'from-[#b45a3c] to-[#96472d]',
        image: '/images/menu-exposed.jpg'
    },
    {
        title: 'Brick Tiles',
        subtitle: 'Cladding Veneers',
        href: '/products?category=Brick%20Tiles',
        color: 'from-[#8c7b70] to-[#5d554f]',
        image: '/images/menu-cladding.jpg'
    },
    {
        title: 'Terracotta Jaali',
        subtitle: 'Breathable Screens',
        href: '/products?category=Jaali',
        color: 'from-[#d6cbb8] to-[#bfae96]',
        image: '/images/menu-jaali.jpg'
    },
    {
        title: 'Floor Tiles',
        subtitle: 'Earthy Grounding',
        href: '/products?category=Floor%20Tiles',
        color: 'from-[#EBE5E0] to-[#d6cbb8]',
        textColor: 'text-[#2A1E16]',
        image: '/images/menu-floor.jpg'
    },
    {
        title: 'Roof Tiles',
        subtitle: 'Heritage Roofing',
        href: '/products?category=Roof%20Tiles',
        color: 'from-[#2A1E16] to-[#1a1512]',
        image: '/images/menu-roof.jpg'
    }
];

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sampleModalOpen, setSampleModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { box } = useSampleBox();
    const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (dropdown: string) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setActiveDropdown(dropdown);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 150); // 150ms delay to bridge gaps
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/products', label: 'Products', hasDropdown: true },
        { href: '/projects', label: 'Projects' },
        { href: '/guide', label: 'Selection Guide' },
        { href: '/architects', label: 'For Architects' },
        { href: '/#quote', label: 'Contact' }
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isScrolled || mobileMenuOpen || activeDropdown
                ? 'bg-white border-b border-[#e9e2da]/50 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] py-4'
                : 'bg-transparent border-transparent py-6'
                }`}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => {
                if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current);
                    closeTimeoutRef.current = null;
                }
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
                <Link href="/" className="flex items-center group relative z-50">
                    <Image
                        src="/urbanclay-logo.png"
                        alt="UrbanClay Logo"
                        width={140}
                        height={40}
                        className="h-9 md:h-11 w-auto group-hover:opacity-80 transition-opacity duration-300"
                        style={{ width: 'auto', height: 'auto' }}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10 h-full">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <div
                                key={link.href}
                                className="relative h-full flex items-center"

                                onMouseEnter={() => link.hasDropdown ? handleMouseEnter('products') : handleMouseLeave()}
                            >
                                <Link
                                    href={link.href}
                                    className={`text-[13px] uppercase tracking-[0.05em] font-medium transition-colors duration-300 py-4 ${isActive || activeDropdown === 'products' && link.hasDropdown
                                        ? 'text-[var(--terracotta)] font-bold'
                                        : 'text-[#5d554f] hover:text-[#2A1E16]'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4 relative z-50">
                    <button
                        onClick={() => setSampleModalOpen(true)}
                        className={`
                            px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 
                            shadow-lg hover:shadow-orange-900/10 transform hover:-translate-y-0.5 relative overflow-hidden group
                            ${isScrolled || activeDropdown ? 'bg-[#2A1E16] text-white hover:bg-[#4a3e36]' : 'bg-white text-[#2A1E16] hover:bg-[#FAF8F6]'}
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <span>Order Samples</span>
                            {box.length > 0 && (
                                <span className="bg-[var(--terracotta)] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                                    {box.length}
                                </span>
                            )}
                        </span>
                    </button>
                </div>

                {/* Mobile Menu Button - THUMB OPTIMIZED */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-3 -mr-2 text-[#2A1E16] hover:bg-black/5 rounded-xl transition-colors z-50 min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-95"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <div className="w-6 h-5 flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
                    </div>
                </button>
            </div>

            {/* MEGA MENU DROPDOWN */}
            <AnimatePresence>
                {activeDropdown === 'products' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="hidden md:block absolute top-full left-0 right-0 bg-white border-t border-[var(--line)] shadow-2xl z-40 overflow-hidden"
                        onMouseEnter={() => {
                            if (closeTimeoutRef.current) {
                                clearTimeout(closeTimeoutRef.current);
                                closeTimeoutRef.current = null;
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="max-w-7xl mx-auto px-8 py-12">
                            <div className="grid grid-cols-12 gap-12">
                                {/* Intro Column */}
                                <div className="col-span-3">
                                    <h3 className="font-serif text-2xl text-[#2A1E16] mb-3">Refined Earth</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                        Explore our curated collection of handcrafted terracotta and clay products designed for modern architecture.
                                    </p>
                                    <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta)] hover:text-[#2A1E16] transition-colors flex items-center gap-2">
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
                                            className="group block relative rounded-xl overflow-hidden aspect-[3/4] hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                            onClick={() => setActiveDropdown(null)}
                                        >
                                            {/* Background / Placeholder Image */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} transition-transform duration-700 group-hover:scale-110`} />
                                            {/* Here we would put <Image /> if we had real assets, falling back to gradient for now which looks clean */}

                                            {/* Overlay Content */}
                                            <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black/40 via-transparent to-transparent">
                                                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80 ${cat.textColor || 'text-white'}`}>
                                                    {cat.subtitle}
                                                </p>
                                                <h4 className={`font-serif text-lg leading-tight ${cat.textColor || 'text-white'} group-hover:underline decoration-1 underline-offset-4`}>
                                                    {cat.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE MENU (Existing logic with improved easing) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
                            style={{ top: '0' }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl md:hidden z-[60] overflow-y-auto overscroll-contain"
                            data-lenis-prevent
                        >
                            <div className="p-6 flex flex-col gap-6">
                                {/* Header in Menu */}
                                <div className="flex items-center justify-between mb-2">
                                    <Image
                                        src="/urbanclay-logo.png"
                                        alt="UrbanClay"
                                        width={120}
                                        height={32}
                                        className="h-8 w-auto"
                                    />
                                    {/* Redundant close button removed, using main header toggle instead */}
                                </div>

                                <nav className="flex flex-col gap-2">
                                    {/* Products Dropdown (Expanded by default or accordion) */}
                                    <div className="py-2">
                                        <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Products</h4>
                                        <div className="pl-2 flex flex-col gap-2 border-l-2 border-gray-100">
                                            {PRODUCT_CATEGORIES.map((cat, idx) => (
                                                <Link
                                                    key={idx}
                                                    href={cat.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="min-h-[48px] py-3 flex items-center justify-between group active:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
                                                >
                                                    <span className="text-base font-serif text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">
                                                        {cat.title}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{cat.subtitle}</span>
                                                </Link>
                                            ))}
                                            <Link
                                                href="/products"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="mt-2 min-h-[44px] py-3 text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] flex items-center gap-2"
                                            >
                                                View All Products →
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100 my-2" />

                                    {/* Other Links - THUMB OPTIMIZED */}
                                    {navLinks.filter(l => l.label !== 'Products').map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="min-h-[52px] py-4 text-lg font-serif font-medium text-[#2A1E16] flex justify-between items-center border-b border-gray-50 last:border-0 active:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
                                        >
                                            {link.label}
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </Link>
                                    ))}
                                </nav>

                                <div className="mt-auto pt-8 space-y-4">
                                    <button
                                        onClick={() => {
                                            setSampleModalOpen(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full min-h-[52px] py-4 bg-[var(--terracotta)] text-white font-bold rounded-xl uppercase tracking-wider text-sm shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                                        aria-label="Get samples"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                        Get Samples {box.length > 0 && <span className="bg-white text-[var(--terracotta)] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">{box.length}</span>}
                                    </button>
                                    <div className="text-center pt-2">
                                        <p className="text-xs text-gray-400 mb-2">Need help?</p>
                                        <a href="tel:+918080081951" className="text-base font-medium text-[#2A1E16] block min-h-[44px] flex items-center justify-center hover:text-[var(--terracotta)] transition-colors">+91 80800 81951</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SampleModal isOpen={sampleModalOpen} onClose={() => setSampleModalOpen(false)} />
        </header>
    );
}
