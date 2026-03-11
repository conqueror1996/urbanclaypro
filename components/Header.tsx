'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSampleBox } from '@/context/SampleContext'; // Use context to show badge
import dynamic from 'next/dynamic';

const MegaMenu = dynamic(() => import('./header/MegaMenu'), { ssr: false });
const MobileMenu = dynamic(() => import('./header/MobileMenu'), { ssr: false });

// --- PREMIUM MEGA MENU CONFIGURATION ---
const PRODUCT_CATEGORIES = [
    {
        title: 'Flexible Brick Tiles',
        subtitle: 'Ultra-Thin Cladding',
        href: '/flexible-brick-tile',
        color: 'from-[#b45a3c] to-[#96472d]',
        image: '/images/flexible-brick-showcase.png'
    },
    {
        title: 'Terracotta Panels',
        subtitle: 'Rainscreen Facades',
        href: '/terracotta-panels',
        color: 'from-[#8c7b70] to-[#5d554f]',
        image: '/images/premium-terracotta-facade.png'
    },
    {
        title: 'Exposed Bricks',
        subtitle: 'Authentic Masonry',
        href: '/exposed-brick',
        color: 'from-[#d6cbb8] to-[#bfae96]',
        image: '/images/exposed-brick-guide.png'
    },
    {
        title: 'Handmade Brick Tiles',
        subtitle: 'Artisanal Beauty',
        href: '/handmade-brick-tiles',
        color: 'from-[#EBE5E0] to-[#d6cbb8]',
        image: '/images/raw-brick.jpg'
    },
    {
        title: 'Terracotta Jaali',
        subtitle: 'Breathable Screens',
        href: '/terracotta-jali',
        color: 'from-[#2A1E16] to-[#1a1512]',
        image: '/images/breeze-block-interior.png'
    }
];


type NavLink = {
    href: string;
    label: string;
    hasDropdown?: boolean;
    isSpecial?: boolean;
};

const navLinks: NavLink[] = [
    { href: '/products', label: 'Products', hasDropdown: true },

    { href: '/projects', label: 'Projects' },
    { href: '/guide', label: 'Selection Guide' },
    { href: '/architects', label: 'For Architects' },
    { href: '/contact', label: 'Contact' }
];



export default function Header({ hideAnnouncement = false }: { hideAnnouncement?: boolean }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { box, setBoxOpen } = useSampleBox();
    const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const [isMounted, setIsMounted] = useState(false);

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
        }, 150);
    };

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Pages that should have white header when not scrolled
    const whiteHeaderPages = ['/architects', '/projects', '/guide', '/journal', '/products'];
    const shouldShowWhiteHeader = whiteHeaderPages.some(page => pathname?.startsWith(page));

    return (
        <header
            suppressHydrationWarning
            className={`fixed top-0 left-0 right-0 z-[100] flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isScrolled || mobileMenuOpen || activeDropdown || (isMounted && shouldShowWhiteHeader)
                ? 'bg-[var(--background)] border-b border-[var(--line)] shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] pb-4'
                : 'bg-transparent border-transparent pb-6'
                }`}
            onMouseLeave={handleMouseLeave}
        >
            {/* ANNOUNCEMENT BANNER - Structural stability for Hydration */}
            {!hideAnnouncement && (
                <div className="w-full h-auto overflow-hidden">
                    <AnimatePresence>
                        {isMounted && (
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
                                className="w-full"
                            >
                                <Link href="/flexible-brick-tile" className="group relative w-full block bg-[var(--background)] hover:bg-[var(--line)] transition-colors duration-500 z-50 overflow-hidden mb-2 shadow-sm border-b border-[var(--line)]">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-2.5 flex items-center justify-center relative z-10">
                                        <span className="text-[var(--foreground)] text-[9px] sm:text-[10px] md:text-xs font-medium tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.2em] text-center flex items-center justify-center gap-1 sm:gap-1.5 uppercase px-2">
                                            <span className="animate-pulse origin-bottom group-hover:animate-bounce">🚀</span>
                                            <span className="opacity-90 font-bold ml-1 text-[var(--terracotta)] transition-colors hidden sm:inline">NOW TESTING:</span>
                                            <span className="font-semibold tracking-[0.2em] ml-1">Flexible Brick Tile</span>
                                            <span className="opacity-70 hidden md:inline ml-1 font-normal">– Ultra Thin 3mm Clay System</span>
                                            <span className="ml-1 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:inline">→</span>
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                                        <div className="absolute inset-0 w-[200%] h-full animate-slide-shimmer bg-gradient-to-r from-transparent via-[var(--line)] to-transparent skew-x-12" />
                                    </div>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative pt-1 md:pt-2">
                <Link href="/" className="flex items-center group relative z-50">
                    <Image
                        src="/urbanclay-logo.png"
                        alt="UrbanClay Logo"
                        width={240}
                        height={120}
                        className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto group-hover:opacity-80 transition-opacity duration-300"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10 h-full">
                    {navLinks.map((link) => {
                        const isSpecial = link.isSpecial;
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <div
                                key={link.href}
                                className="relative h-full flex items-center"
                                onMouseEnter={() => link.hasDropdown ? handleMouseEnter('products') : handleMouseLeave()}
                            >
                                <Link
                                    href={link.href}
                                    aria-label={link.label}
                                    className={`text-[13px] uppercase tracking-[0.05em] font-medium transition-colors duration-300 py-4 ${isActive || (activeDropdown === 'products' && link.hasDropdown)
                                        ? 'text-[var(--terracotta)]'
                                        : 'text-[#5d554f] hover:text-[#2A1E16]'
                                        } ${isSpecial ? 'bg-gradient-to-r from-[var(--terracotta)] to-blue-600 bg-clip-text text-transparent font-bold' : ''}`}
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
                        onClick={() => setBoxOpen(true)}
                        className={`
                            px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 
                            shadow-lg hover:shadow-orange-900/10 transform hover:-translate-y-0.5 relative overflow-hidden group
                            ${isScrolled || activeDropdown ? 'bg-[var(--ink)] text-white hover:bg-[var(--terracotta)]' : 'bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--line)]'}
                        `}
                        aria-label={box.length > 0 ? `Order samples, ${box.length} items in tray` : "Order samples"}
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

                {/* Mobile Navigation Actions */}
                <div className="flex md:hidden items-center gap-2 relative z-50">
                    {/* Sample Tray Shortcut */}
                    <button
                        onClick={() => setBoxOpen(true)}
                        className={`p-3 rounded-xl transition-colors relative flex items-center justify-center active:scale-95 ${isScrolled || mobileMenuOpen || pathname === '/' ? 'text-[#2A1E16] hover:bg-black/5' : 'text-white hover:bg-white/10'}`}
                        aria-label="View samples"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {box.length > 0 && (
                            <span className="absolute top-2 right-2 bg-[var(--terracotta)] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border border-white font-bold">
                                {box.length}
                            </span>
                        )}
                    </button>

                    {/* Hamburger Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-3 -mr-2 rounded-xl transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center active:scale-95 ${isScrolled || mobileMenuOpen || pathname === '/' ? 'text-[#2A1E16] hover:bg-black/5' : 'text-white hover:bg-white/10'}`}
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        <div className="w-6 h-5 flex flex-col justify-between relative">
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 transform origin-center ${mobileMenuOpen ? 'rotate-45 absolute top-1/2 -translate-y-1/2' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                            <span className={`w-full h-0.5 bg-current transition-all duration-300 transform origin-center ${mobileMenuOpen ? '-rotate-45 absolute top-1/2 -translate-y-1/2' : ''}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* MEGA MENU DROPDOWN */}
            <AnimatePresence>
                {activeDropdown === 'products' && (
                    <MegaMenu
                        onClose={() => setActiveDropdown(null)}
                        onMouseEnter={() => {
                            if (closeTimeoutRef.current) {
                                clearTimeout(closeTimeoutRef.current);
                                closeTimeoutRef.current = null;
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                    />
                )}
            </AnimatePresence>

            {/* MOBILE MENU */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <MobileMenu
                        isOpen={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        pathname={pathname || ''}
                        searchParams={searchParams}
                        navLinks={navLinks}
                        boxLength={box.length}
                        setBoxOpen={setBoxOpen}
                    />
                )}
            </AnimatePresence>
        </header>
    );
}
