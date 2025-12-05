'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import TextReveal from './TextReveal';
import HeroVisual from './HeroVisual';
import { useSampleBox } from '@/context/SampleContext';

interface HeroProps {
    data?: {
        heroImageUrl?: string;
        heroHeading?: string;
        heroSubheading?: string;
    } | null;
}

export default function Hero({ data }: HeroProps) {
    const { setBoxOpen } = useSampleBox();
    const [isHoveringText, setIsHoveringText] = useState(false);

    return (
        <>
            <section className="relative overflow-hidden">
                {/* Animated Background - Kiln Glow (Removed KilnDistort) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)] to-white opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 md:pt-40 md:pb-16 lg:pt-52 lg:pb-24 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div
                                onMouseEnter={() => setIsHoveringText(true)}
                                onMouseLeave={() => setIsHoveringText(false)}
                                className="cursor-default"
                            >
                                <h1 className="sr-only">Premium Terracotta for Facades & Interiors</h1>
                                <TextReveal
                                    text={data?.heroHeading || 'Premium Terracotta for Facades & Interiors'}
                                    className="text-3xl sm:text-5xl lg:text-[64px] font-serif font-medium leading-[1.05] text-[#2A1E16] tracking-tight"
                                />
                            </div>

                            <motion.p
                                className="mt-6 md:mt-8 text-base md:text-xl text-[#5d554f] font-light leading-relaxed max-w-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                {data?.heroSubheading || 'Crafted for timeless spaces, engineered for performance.'}
                            </motion.p>

                            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4">
                                <motion.button
                                    onClick={() => setBoxOpen(true)}
                                    className="btn-terracotta min-h-[48px] md:min-h-[56px]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Samples
                                </motion.button>
                            </div>

                            <div className="mt-8 flex items-center gap-3 text-sm font-medium text-[#5d554f]">
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>
                                    Low Efflorescence
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>
                                    Batch Consistency
                                </span>
                                <span className="text-gray-300">•</span>
                                <span className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)]"></span>
                                    Pan-India Delivery
                                </span>
                            </div>
                        </motion.div>

                        {/* Right Column: Visual with Heat Haze & Embers */}
                        <div
                            className="relative h-full min-h-[400px] lg:min-h-[600px] w-full"
                        >
                            <HeroVisual imageUrl={data?.heroImageUrl} />
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#2A1E16]/30 hidden md:flex flex-col items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                >
                    <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </motion.div>
            </section >
        </>
    );
}
