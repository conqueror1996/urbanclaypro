'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SampleModal from './SampleModal';
export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sampleModalOpen, setSampleModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/products', label: 'Products' },
        { href: '/projects', label: 'Projects' },
        { href: '/visualizer', label: 'Visualizer' },
        { href: '/guide', label: 'Selection Guide' },
        { href: '/architects', label: 'For Architects' },
        { href: '/#quote', label: 'Contact' }
    ];

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || mobileMenuOpen ? 'bg-white border-b border-[#e9e2da]/50 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.03)] py-3 md:pt-5 md:pb-3' : 'bg-transparent border-transparent py-4 md:pt-7 md:pb-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link href="/" className="flex items-center group">
                    <Image
                        src="/urbanclay-logo.png"
                        alt="UrbanClay Logo"
                        width={120}
                        height={40}
                        className="h-8 md:h-12 w-auto group-hover:scale-105 transition-transform duration-300"
                        style={{ width: 'auto', height: 'auto' }}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[13px] uppercase tracking-[0.05em] font-medium transition-all duration-300 relative group ${isActive ? 'text-[var(--terracotta)]' : 'text-[#5d554f] hover:text-[#2A1E16]'}`}
                            >
                                {link.label}
                                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-[var(--terracotta)] transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">


                    <button
                        onClick={() => setSampleModalOpen(true)}
                        className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isScrolled ? 'bg-[var(--ink)] text-white hover:bg-[#4a3e36]' : 'bg-white text-[var(--ink)] hover:bg-[#f4f1ee]'}`}
                    >
                        Get Samples
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-3 -mr-3 text-[#2A1E16] hover:bg-black/5 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <svg
                        className="w-7 h-7"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {mobileMenuOpen ? (
                            <path d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path d="M4 8h16M4 16h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                            style={{ top: '64px' }}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-16 bottom-0 w-64 bg-white border-l border-[var(--line)] shadow-xl md:hidden z-50"
                        >
                            <nav className="flex flex-col p-6 gap-3">
                                {navLinks.map((link, index) => {
                                    const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                                    return (
                                        <motion.a
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`px-5 py-4 rounded-lg transition-colors text-lg font-medium min-h-[48px] flex items-center ${isActive ? 'bg-[var(--sand)] text-[var(--terracotta)] font-bold' : 'text-[#2A1E16] hover:bg-[var(--sand)] active:bg-[var(--sand)]'}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                        >
                                            {link.label}
                                        </motion.a>
                                    );
                                })}
                                <motion.button
                                    onClick={() => {
                                        setSampleModalOpen(true);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="mt-6 px-5 py-4 text-center rounded-full bg-[var(--ink)] text-white font-semibold hover:opacity-90 active:opacity-80 transition-opacity w-full min-h-[52px] text-base"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + navLinks.length * 0.05 }}
                                >
                                    Get Samples
                                </motion.button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SampleModal isOpen={sampleModalOpen} onClose={() => setSampleModalOpen(false)} />
        </header>
    );
}
