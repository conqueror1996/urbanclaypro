'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import TextReveal from './TextReveal';
import HeroVisual from './HeroVisual';
import { ShieldCheck, Clock, Zap } from 'lucide-react';
import { useSampleBox } from '@/context/SampleContext';


interface HeroProps {
    data?: {
        heroImageUrl?: string;
        heroHeading?: string;
        heroSubheading?: string;
    } | null;
    injectedKeyword?: string | null;
}

export default function Hero({ data, injectedKeyword }: HeroProps) {



    const { setBoxOpen } = useSampleBox();

    return (
        <>
            <section className="relative overflow-hidden">
                {/* Animated Background - Kiln Glow (Removed KilnDistort) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)] to-[var(--sand)] opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 pt-[140px] pb-16 md:pt-[192px] lg:pt-[246px] lg:pb-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col justify-center"
                        >

                            {injectedKeyword && (
                                <div
                                    data-testid="keyword-badge"
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-sm font-semibold border border-[var(--terracotta)]/20 backdrop-blur-sm animate-fade-in self-start max-w-full"
                                >
                                    <span className="relative flex h-2 w-2 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--terracotta)] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--terracotta)]"></span>
                                    </span>
                                    <span className="truncate">Viewing Options for "{injectedKeyword}"</span>
                                </div>
                            )}

                            <div className="cursor-default">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="h-[1px] w-8 bg-[var(--terracotta)]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--terracotta)]">Global Specification Grade</span>
                                </div>
                                <h1 className="font-serif leading-[1] text-[#111] tracking-tighter flex flex-col mb-8">
                                    <span className="text-4xl md:text-8xl font-extrabold text-balance">
                                        India&apos;s #1 <br className="hidden md:block" />
                                        <span className="text-[var(--terracotta)] italic">Engineered</span> <br className="hidden md:block" />
                                        Facade Systems.
                                    </span>
                                </h1>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-10">
                                {[
                                    { text: "A1 Fire Rated", icon: ShieldCheck },
                                    { text: "1000y+ Life", icon: Clock },
                                    { text: "Non-Combustible", icon: Zap }
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-md border border-[var(--line)] rounded-full shadow-sm">
                                        <badge.icon className="w-3 h-3 text-[var(--terracotta)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--ink)]/60">{badge.text}</span>
                                    </div>
                                ))}
                            </div>

                            <motion.p
                                className="text-lg md:text-[22px] font-light text-[#555] leading-snug max-w-lg mb-12"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                            >
                                Purpose-built for the Indian climate. Zero efflorescence, zero maintenance, <span className="font-bold text-[var(--ink)]">infinite durability.</span>
                            </motion.p>

                            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
                                <Link href="/products" className="contents">
                                    <motion.button
                                        className="bg-[var(--terracotta)] text-white h-[60px] px-12 rounded-full font-semibold text-base tracking-[0.3px] shadow-lg hover:shadow-xl hover:bg-[#a85638] transition-all active:scale-95 flex items-center justify-center font-serif italic"
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        aria-label="Explore products"
                                    >
                                        Explore products
                                    </motion.button>
                                </Link>
                                <motion.button
                                    onClick={() => {
                                        const { toast } = require('sonner');
                                        if (window.innerWidth < 1024) {
                                            toast.loading('Starting Specification Desk...');
                                            window.dispatchEvent(new CustomEvent('openSpecDesk'));
                                        } else {
                                            toast.info('Navigating to Specification Desk');
                                            const el = document.getElementById('specify') || document.getElementById('facade-specification-desk');
                                            if (el) {
                                                el.scrollIntoView({ behavior: 'smooth' });
                                            } else {
                                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                            }
                                        }
                                    }}
                                    className="bg-transparent text-[#222] h-[60px] px-12 rounded-full border border-[#222]/20 font-semibold text-base hover:bg-[#222]/5 transition-all active:scale-95 flex items-center justify-center font-serif italic"
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    aria-label="Request Quote"
                                >
                                    Request Quote
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Right Column: Visual with Heat Haze & Embers */}
                        <div
                            className="relative h-full min-h-[300px] md:min-h-[400px] lg:min-h-[600px] w-full mt-6 flex lg:block"
                        >
                            <HeroVisual
                                imageUrl={data?.heroImageUrl}
                                alt={data?.heroHeading ? `${data.heroHeading} - UrbanClay India` : undefined}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator Removed for Premium Minimalism */}
            </section >
        </>
    );
}
