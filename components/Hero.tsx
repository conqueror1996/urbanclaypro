'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import SampleModal from './SampleModal';
import Image from 'next/image';
import TextReveal from './TextReveal';
import HeroVisual from './HeroVisual';



interface HeroProps {
    data?: {
        heroImageUrl?: string;
        heroHeading?: string;
        heroSubheading?: string;
    } | null;
}

export default function Hero({ data }: HeroProps) {
    const [sampleModalOpen, setSampleModalOpen] = useState(false);
    const [isHoveringText, setIsHoveringText] = useState(false);

    return (
        <>
            <section className="relative overflow-hidden">
                {/* Animated Background - Kiln Glow (Removed KilnDistort) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sand)] to-white opacity-50 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16 lg:pt-52 lg:pb-24 relative z-10">
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
                                    className="text-[42px] sm:text-5xl lg:text-[64px] font-serif font-medium leading-[1.05] text-[#2A1E16] tracking-tight"
                                />
                            </div>

                            <motion.p
                                className="mt-8 text-lg md:text-xl text-[#5d554f] font-light leading-relaxed max-w-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                {data?.heroSubheading || 'Crafted for timeless spaces, engineered for performance.'}
                            </motion.p>

                            <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
                                <motion.button
                                    onClick={() => setSampleModalOpen(true)}
                                    className="btn-terracotta min-h-[56px]"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Samples
                                </motion.button>
                                <Link href="/visualizer">
                                    <motion.button
                                        className="btn-secondary min-h-[56px] gap-2 group"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <svg className="w-5 h-5 text-[var(--terracotta)] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        See in Your Space
                                    </motion.button>
                                </Link>
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
                        <motion.div
                            className="relative h-full min-h-[400px] lg:min-h-[600px] w-full"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <HeroVisual imageUrl={data?.heroImageUrl} />
                        </motion.div>
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

            <SampleModal isOpen={sampleModalOpen} onClose={() => setSampleModalOpen(false)} />
        </>
    );
}
