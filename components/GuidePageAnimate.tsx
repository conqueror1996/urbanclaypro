'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';

interface GuidePageAnimateProps {
    heroImage?: string | null;
}

export default function GuidePageAnimate({ heroImage }: GuidePageAnimateProps) {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    const defaultHeroImage = "/images/guide-hero-dark.png";

    const spectrumItems = [
        {
            title: 'Wirecut',
            subtitle: 'Best for Modern Facades & Clean Architecture',
            description: 'Machine-extruded and precision cut, wirecut bricks offer uniform size, sharp edges, and a clean finish — ideal for contemporary buildings and large-scale projects.',
            image: '/images/products/wirecut-texture.jpg',
            features: ['You want a modern look', 'You need consistency across large areas', 'Budget matters'],
            link: '/products?category=Exposed%20Brick'
        },
        {
            title: 'Handmade',
            subtitle: 'Best for Luxury, Heritage & Statement Spaces',
            description: 'Crafted by artisans, each piece carries natural variation and texture — creating depth, warmth, and a timeless character impossible to replicate with machines.',
            image: '/images/terracotta-texture.png',
            features: ['You want a premium, unique finish', 'Designing villas, resorts, or feature walls', 'Restoration or heritage projects'],
            link: '/products?category=Exposed%20Brick'
        },
        {
            title: 'Pressed',
            subtitle: 'Best for Durability, Flooring & High-Performance Areas',
            description: 'High-pressure manufacturing creates dense, low-absorption clay units — built for strength, longevity, and harsh environmental conditions.',
            image: '/images/products/pressed-texture.jpg',
            features: ['Flooring or heavy traffic areas', 'Exterior in extreme climates', 'Long-term durability is priority'],
            link: '/products?category=Floor%20Tiles'
        }
    ];

    const glossaryItems = [
        { term: 'Efflorescence', def: 'White marks on surface — mostly aesthetic. Our treatment minimizes this.' },
        { term: 'Water Absorption', def: 'Lower = better for exterior use. Prevents dampness & damage.' },
        { term: 'Thermal Mass', def: 'Keeps interiors cooler in summer, warmer in winter.' },
        { term: 'Strength', def: 'Important only if load-bearing. Not critical for wall cladding.' },
    ];

    return (
        <main className="bg-[#1a1512] text-[#EBE5E0] min-h-screen selection:bg-[var(--terracotta)] selection:text-white">

            {/* --- HERO SECTION --- */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src={heroImage || defaultHeroImage}
                        alt="Selection Guide Hero"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/30 via-transparent to-[#1a1512]" />
                </motion.div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex justify-center mb-6 opacity-60">
                            <Breadcrumbs items={[{ name: 'Selection Guide', href: '/guide' }]} />
                        </div>
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                            Curator's Guide
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-tight drop-shadow-md">
                            Choose the Right Clay Material <br /><span className="italic font-light text-white">Without Guesswork</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white max-w-2xl mx-auto leading-relaxed font-light mb-12 drop-shadow-md">
                            Whether you're designing a modern facade, restoring heritage, or building for durability — this guide helps you select the right clay system based on performance, aesthetics, and use-case.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-sans">
                            <Link href="#comparison" className="px-8 py-4 flex items-center justify-center bg-[var(--terracotta)] text-white rounded-full font-bold tracking-[0.1em] uppercase text-sm hover:bg-[#a85638] transition-colors w-full sm:w-auto shadow-[0_4px_14px_0_rgba(202,80,45,0.39)] hover:shadow-[0_6px_20px_rgba(202,80,45,0.23)]">
                                Compare Materials
                            </Link>
                            <a href="https://wa.me/918080081951" target="_blank" rel="noopener noreferrer" className="px-8 py-4 flex items-center justify-center gap-2 border border-white/30 text-white rounded-full font-bold tracking-[0.1em] uppercase text-sm hover:bg-white/10 transition-colors w-full sm:w-auto backdrop-blur-sm">
                                Talk to an Expert
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- HOW TO CHOOSE SECTION (NEW) --- */}
            <section className="py-16 md:py-24 bg-[#14100e] relative z-10 border-t border-white/5 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">How to Choose</h2>
                        <p className="text-white max-w-2xl mx-auto text-lg leading-relaxed font-light">
                            Not all clay products are the same. Your selection should depend on 3 things:
                        </p>
                    </div>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 md:gap-8 pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        {/* 1. Application */}
                        <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-[#1a1512] p-6 md:p-8 border border-white/10 group hover:border-[var(--terracotta)]/50 transition-colors rounded-2xl shadow-xl flex flex-col">
                            <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-white/5">
                                <span className="text-[var(--terracotta)] font-serif text-3xl md:text-4xl block leading-none">01</span>
                                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-[var(--terracotta)] transition-colors m-0">Application</h3>
                            </div>
                            <ul className="space-y-4 md:space-y-6 flex-1">
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Exterior facade</span>
                                    Low absorption, high durability
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Interior feature wall</span>
                                    Texture & aesthetics
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Flooring</span>
                                    Strength & wear resistance
                                </li>
                            </ul>
                        </div>

                        {/* 2. Design Intent */}
                        <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-[#1a1512] p-6 md:p-8 border border-white/10 group hover:border-[var(--terracotta)]/50 transition-colors rounded-2xl shadow-xl flex flex-col">
                            <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-white/5">
                                <span className="text-[var(--terracotta)] font-serif text-3xl md:text-4xl block leading-none">02</span>
                                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-[var(--terracotta)] transition-colors m-0">Design Intent</h3>
                            </div>
                            <ul className="space-y-4 md:space-y-6 flex-1">
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Modern</span>
                                    Wirecut
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Rustic / Heritage</span>
                                    Handmade
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Minimal / Industrial</span>
                                    Pressed
                                </li>
                            </ul>
                        </div>

                        {/* 3. Performance Needs */}
                        <div className="min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center shrink-0 md:shrink bg-[#1a1512] p-6 md:p-8 border border-white/10 group hover:border-[var(--terracotta)]/50 transition-colors rounded-2xl shadow-xl flex flex-col">
                            <div className="flex items-center gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-white/5">
                                <span className="text-[var(--terracotta)] font-serif text-3xl md:text-4xl block leading-none">03</span>
                                <h3 className="text-xl md:text-2xl font-serif text-white group-hover:text-[var(--terracotta)] transition-colors m-0">Performance Needs</h3>
                            </div>
                            <ul className="space-y-4 md:space-y-6 flex-1">
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">High rainfall</span>
                                    Pressed
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Budget-sensitive</span>
                                    Wirecut
                                </li>
                                <li className="text-sm font-light text-white">
                                    <span className="block text-white font-medium mb-1">Premium look</span>
                                    Handmade
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE SPECTRUM (Horizontal Scroll / Sticky) --- */}
            <section className="py-16 md:py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-20 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">Material Types</h2>
                    <p className="text-white/40 max-w-lg mx-auto">Three distinct manufacturing processes, three unique personalities.</p>
                </div>

                <div className="space-y-24 md:space-y-32 max-w-7xl mx-auto px-4 md:px-6">
                    {spectrumItems.map((item, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row gap-8 md:gap-24 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 relative aspect-[4/5] w-full md:w-auto rounded-[2rem] overflow-hidden group shadow-2xl">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>

                            <div className="flex-1 space-y-8">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-[var(--terracotta)] font-serif text-5xl">0{idx + 1}</span>
                                        <div className="h-px w-24 bg-white/10" />
                                    </div>
                                    <h3 className="text-4xl font-serif mb-2">{item.title}</h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--terracotta)]">{item.subtitle}</p>
                                </div>

                                <p className="text-white/60 leading-loose text-lg font-light border-l border-[var(--terracotta)] pl-6">
                                    {item.description}
                                </p>

                                <div className="space-y-4">
                                    <h4 className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-[0.2em]">Use it when:</h4>
                                    <ul className="space-y-3 font-sans">
                                        {item.features.map(f => (
                                            <li key={f} className="text-sm text-white/80 flex items-start gap-3">
                                                <span className="text-[var(--terracotta)] mt-[3px] text-lg font-bold leading-none shrink-0">&bull;</span>
                                                <span className="leading-relaxed">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Link href={item.link} className="inline-block border-b border-white/30 pb-1 text-sm hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors">
                                    View Collection
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- COMPARISON & GLOSSARY (Editorial Specs) --- */}
            <section className="bg-[#e2dad3] text-[#1a1512] py-16 md:py-32 rounded-t-[2rem] md:rounded-t-[3rem] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

                        {/* Comparison Matrix - Reimagined as "Specs Sheet" */}
                        <div id="comparison" className="scroll-mt-24">
                            <h2 className="text-3xl font-serif mb-4 flex items-center gap-4">
                                Technical Matrix
                                <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] opacity-40 px-3 py-1 border border-black/10 rounded-full">Compare</span>
                            </h2>
                            <p className="text-[#5d554f] mb-8 font-medium">Quick Comparison — Choose based on performance, not just looks</p>

                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-black/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-black/10">
                                                <th className="py-4 font-serif text-lg font-medium w-1/4">Property</th>
                                                <th className="py-4 font-bold text-[var(--terracotta)] w-1/4">Wirecut</th>
                                                <th className="py-4 font-bold text-[#1a1512]/60 w-1/4">Handmade</th>
                                                <th className="py-4 font-bold text-[#1a1512]/60 w-1/4">Pressed</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-[#5d554f]">
                                            <tr className="border-b border-black/5">
                                                <td className="py-4 font-medium">Absorption</td>
                                                <td className="py-4">10-12%</td>
                                                <td className="py-4">12-15%</td>
                                                <td className="py-4 text-green-700 font-bold">6-8%</td>
                                            </tr>
                                            <tr className="border-b border-black/5">
                                                <td className="py-4 font-medium">Strength</td>
                                                <td className="py-4">High</td>
                                                <td className="py-4">Moderate</td>
                                                <td className="py-4 font-bold text-[#1a1512]">Very High</td>
                                            </tr>
                                            <tr className="border-b border-black/5">
                                                <td className="py-4 font-medium">Texture</td>
                                                <td className="py-4">Smooth</td>
                                                <td className="py-4">Rustic</td>
                                                <td className="py-4">Matte</td>
                                            </tr>
                                            <tr>
                                                <td className="py-4 font-medium">Variation</td>
                                                <td className="py-4">Low</td>
                                                <td className="py-4">High</td>
                                                <td className="py-4">Uniform</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Glossary - Editorial List */}
                        <div>
                            <h2 className="text-3xl font-serif mb-12 flex items-center gap-4">
                                Lexicon
                                <span className="text-xs font-sans font-bold uppercase tracking-widest opacity-40 px-3 py-1 border border-black/10 rounded-full">Learn</span>
                            </h2>

                            <div className="space-y-8">
                                {glossaryItems.map((item, i) => (
                                    <div key={i} className="group cursor-default">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <h4 className="font-bold text-[#1a1512] text-lg group-hover:text-[var(--terracotta)] transition-colors">{item.term}</h4>
                                            <div className="h-px flex-1 bg-black/10 group-hover:bg-[var(--terracotta)]/30 transition-colors" />
                                        </div>
                                        <p className="text-[#5d554f] leading-relaxed text-sm">
                                            {item.def}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-black/5 rounded-xl p-6 md:p-8 border border-black/5 text-center">
                                <p className="text-[#5d554f] font-medium mb-8">Still unsure? Don't risk a wrong material choice.</p>
                                <div className="flex flex-col gap-4 font-sans">
                                    <Link href="/project-lab" className="px-6 py-4 flex items-center justify-center bg-[#1a1512] text-white rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-[var(--terracotta)] transition-colors w-full">
                                        Get Sample Kit
                                    </Link>
                                    <a
                                        href="https://wa.me/918080081951"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-4 flex items-center justify-center border border-[#1a1512] text-[#1a1512] rounded-full font-bold text-sm uppercase tracking-[0.1em] hover:bg-black/5 transition-colors w-full"
                                    >
                                        Talk to a Material Expert
                                    </a>
                                </div>
                                <div className="mt-6">
                                    <Link href="/products" className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--terracotta)] hover:underline">
                                        View Full Collection
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
