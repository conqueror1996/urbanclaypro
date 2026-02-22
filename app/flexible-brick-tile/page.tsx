'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FlexibleBrickLaunch() {
    const { scrollYProgress } = useScroll();

    // Parallax and scale effects for scrolling
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
    const secondSectionY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
    const secondSectionOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        // Ensure smooth scrolling is enabled globally
        document.documentElement.style.scrollBehavior = 'smooth';
    }, []);

    return (
        <main className="bg-[var(--sand)] min-h-[300vh] text-[var(--ink)] selection:bg-[var(--terracotta)] selection:text-white font-sans relative overflow-x-hidden">

            {/* Global Header Navigation for this mini-site */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-[var(--sand)]/80 backdrop-blur-md border-b border-[var(--line)]"
            >
                <Link href="/" className="text-[var(--ink)] hover:opacity-70 transition-opacity font-serif italic text-xl md:text-2xl">
                    UrbanClay
                </Link>
                <Link href="/" className="group flex items-center gap-2 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-[var(--ink)]/60 hover:text-[var(--ink)] transition-colors duration-300">
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Back to Main Site
                </Link>
            </motion.header>

            {/* SECTION 1: THE HERO (Editorial Hook) */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
            >
                <div className="z-10 text-center px-4 w-full max-w-5xl absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full border border-[var(--terracotta)]/20 bg-[var(--terracotta)]/[0.03] text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8 md:mb-12">
                            Material Innovation
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-serif leading-[0.9] text-[var(--ink)] tracking-tight"
                    >
                        Flexible<br />Form.
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="absolute -bottom-32 md:-bottom-48 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                    >
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/40">Scroll to Explore</span>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--ink)]/20 to-transparent" />
                    </motion.div>
                </div>
            </motion.section>

            {/* SECTION 2: THE PRODUCT REVEAL (Clean, Minimalist Showcase) */}
            <motion.section
                style={{ y: secondSectionY, opacity: secondSectionOpacity }}
                className="relative z-20 min-h-screen w-full flex flex-col lg:flex-row items-center justify-center px-6 sm:px-12 lg:px-24 py-24 gap-12 lg:gap-24 bg-[var(--sand)]"
            >
                {/* Photorealistic Flexible Tile Showcased */}
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative items-center min-h-[50vh] md:min-h-[400px] py-10 lg:py-0">
                    <div className="relative w-full max-w-[500px] aspect-square lg:aspect-[4/5] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-[var(--line)] overflow-hidden flex items-center justify-center group pointer-events-none">

                        {/* Soft background grid pattern for scale/technical feel */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e9e2da_1px,transparent_1px),linear-gradient(to_bottom,#e9e2da_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative w-full h-[120%] -rotate-6 group-hover:rotate-0 transition-transform duration-1000 ease-out"
                        >
                            {/* The ultra-realistic generated Flexible Thin Brick */}
                            <Image
                                src="/images/flexible_thin_brick.png"
                                alt="Flexible Ultra-Thin Brick Tile"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain drop-shadow-[0_20px_40px_rgba(47,42,38,0.2)] mix-blend-multiply"
                                style={{ filter: 'contrast(1.05) brightness(1.05)' }}
                            />
                        </motion.div>
                    </div>

                    {/* Technical detail callouts */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                        className="absolute top-[20%] right-[-10%] md:right-[-5%] bg-white/80 backdrop-blur-md border border-[var(--line)] px-4 py-2 rounded-lg shadow-sm hidden md:block"
                    >
                        <span className="block text-[10px] tracking-widest text-[var(--ink)]/50 uppercase font-medium mb-1">Thickness</span>
                        <span className="block text-[var(--terracotta)] font-bold text-sm">3mm Measured</span>
                    </motion.div>
                </div>

                {/* The Technical Copy */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl">
                    <h2 className="text-4xl text-[var(--ink)] font-serif leading-tight mb-6">
                        Authentic clay texture. <br />
                        <span className="text-[var(--terracotta)] italic">Zero rigidity.</span>
                    </h2>

                    <div className="space-y-6 text-base text-[var(--ink)]/70 font-light leading-relaxed">
                        <p>
                            We have engineered the timeless aesthetic of traditional masonry down to a microscopic <strong className="text-[var(--ink)] font-medium">3mm profile</strong>. By integrating advanced modified clay polymers, we've achieved a genuine terracotta surface with authentic wire-cut texture that seamlessly shapes around columns and corners.
                        </p>
                        <p>
                            It possesses the exact tactile grain, thermal resistance, and architectural warmth of traditional brick—but weighs <strong className="text-[var(--ink)] font-medium">90% less</strong>, allowing for unprecedented design applications.
                        </p>
                    </div>

                    {/* Stat Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 pt-10 border-t border-[var(--line)]">
                        <div>
                            <div className="text-3xl font-serif text-[var(--ink)] mb-2">3<span className="text-sm text-[var(--ink)]/50">mm</span></div>
                            <div className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink)]/50 font-medium">Ultra-Thin Profile</div>
                        </div>
                        <div>
                            <div className="text-3xl font-serif text-[var(--ink)] mb-2">4<span className="text-sm text-[var(--ink)]/50">kg/m²</span></div>
                            <div className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink)]/50 font-medium">Featherweight</div>
                        </div>
                        <div>
                            <div className="text-3xl font-serif text-[var(--ink)] mb-2">360<span className="text-sm text-[var(--ink)]/50">°</span></div>
                            <div className="text-[10px] tracking-[0.1em] uppercase text-[var(--ink)]/50 font-medium">Application Radius</div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* SECTION 3: THE CALL TO ACTION (Elegant Soft Ask) */}
            <section className="relative w-full flex flex-col items-center justify-center px-6 py-32 z-20 bg-white border-t border-[var(--line)]">

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[var(--ink)] leading-[1.1] mb-6">
                        Design without boundaries.
                    </h2>
                    <p className="text-lg text-[var(--ink)]/60 font-light mb-12 max-w-xl mx-auto">
                        The Flexible Brick Tile is currently in exclusive closed-beta testing for select architectural projects prior to our public launch.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/contact?subject=Flexible-Brick-Beta"
                            className="w-full sm:w-auto px-8 py-4 bg-[var(--terracotta)] text-white font-bold text-[10px] sm:text-xs tracking-[0.15em] uppercase rounded-full hover:bg-[#96472d] transition-colors duration-300 shadow-md"
                        >
                            Request Architecture Kit
                        </Link>
                        <Link
                            href="/products"
                            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-[var(--ink)]/20 text-[var(--ink)] font-bold text-[10px] sm:text-xs tracking-[0.15em] uppercase rounded-full hover:bg-[var(--ink)]/5 transition-colors duration-300"
                        >
                            View Standard Catalog
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
