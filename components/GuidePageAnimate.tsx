'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function GuidePageAnimate() {
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 150]);
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.4]);

    const spectrumItems = [
        {
            title: 'Wirecut',
            subtitle: 'Precision & Modernity',
            description: 'Extruded through a die and cut by wire. These bricks offer sharp edges, uniform dimensions, and a sleek, contemporary aesthetic perfect for modern facades.',
            image: '/images/products/wirecut-texture.jpg',
            features: ['Sharp, crisp edges', 'High density', 'Smooth finish'],
            bestFor: 'Modern Residential & Commercial',
            link: '/products?category=Exposed%20Brick'
        },
        {
            title: 'Handmade',
            subtitle: 'Heritage & Soul',
            description: 'Thrown into molds by skilled artisans. Each brick is unique, bearing the thumbprints of its maker. Ideal for restoration projects or spaces needing rustic warmth.',
            image: '/images/products/handmade-texture.jpg',
            features: ['Organic texture', 'Rustic charm', 'Unique variations'],
            bestFor: 'Heritage, Farmhouses, Interiors',
            link: '/products?category=Exposed%20Brick'
        },
        {
            title: 'Pressed',
            subtitle: 'Durability & Strength',
            description: 'Compressed under immense pressure before firing. These are the workhorses of the clay world—extremely dense, low-absorption, and built to last centuries.',
            image: '/images/products/pressed-texture.jpg',
            features: ['Extreme durability', 'Low absorption', 'Load bearing'],
            bestFor: 'High-Traffic Flooring, Paving',
            link: '/products?category=Floor%20Tiles'
        }
    ];

    const glossaryItems = [
        { term: 'Efflorescence', def: 'A white powdery deposit of salts on the surface. Our "low-efflorescence" treatment minimizes this significantly.' },
        { term: 'Water Absorption', def: 'Percentage of water absorbed by weight. Lower (<10%) is better for exteriors to prevent dampness.' },
        { term: 'Thermal Mass', def: 'The ability of a material to absorb and store heat energy. Clay naturally regulates indoor temperature.' },
        { term: 'Compressive Strength', def: 'The capacity to withstand loads. Important for structural walls, less so for decorative cladding.' },
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
                        src="/images/guide-hero-dark.png"
                        alt="Clay Nuance - Sphere and Rock"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a1512]/30 via-transparent to-[#1a1512]" />
                </motion.div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex justify-center mb-6 opacity-60">
                            <Breadcrumbs />
                        </div>
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
                            Curator's Guide
                        </span>
                        <h1 className="text-5xl md:text-8xl font-serif text-[#EBE5E0] mb-8 leading-tight">
                            The nuance of <br /><span className="italic font-light text-white/50">Clay</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
                            Understanding the texture, origin, and technical properties to make an informed specification for your masterpiece.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- THE SPECTRUM (Horizontal Scroll / Sticky) --- */}
            <section className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6 mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif mb-4">The Spectrum</h2>
                    <p className="text-white/40 max-w-lg">Three distinct manufacturing processes, three unique personalities.</p>
                </div>

                <div className="space-y-32 max-w-7xl mx-auto px-6">
                    {spectrumItems.map((item, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row gap-12 md:gap-24 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 relative aspect-[4/5] w-full md:w-auto rounded-none overflow-hidden group">
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

                                <ul className="grid grid-cols-2 gap-4">
                                    {item.features.map(f => (
                                        <li key={f} className="text-sm text-white/40 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-white/40 rounded-full" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                <Link href={item.link} className="inline-block border-b border-white/30 pb-1 text-sm hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors">
                                    View Collection
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- COMPARISON & GLOSSARY (Editorial Specs) --- */}
            <section className="bg-[#e2dad3] text-[#1a1512] py-32 rounded-t-[3rem] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.1] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-24">

                        {/* Comparison Matrix - Reimagined as "Specs Sheet" */}
                        <div>
                            <h2 className="text-3xl font-serif mb-12 flex items-center gap-4">
                                Technical Matrix
                                <span className="text-xs font-sans font-bold uppercase tracking-widest opacity-40 px-3 py-1 border border-black/10 rounded-full">Compare</span>
                            </h2>

                            <div className="bg-white p-8 rounded-xl shadow-xl border border-black/5">
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

                            <div className="mt-12 bg-black/5 rounded-xl p-8 border border-black/5 text-center">
                                <p className="text-[#5d554f] italic mb-6">"Still unsure? Our material experts are just a message away."</p>
                                <a
                                    href="https://wa.me/918080081951"
                                    target="_blank"
                                    className="inline-block px-8 py-3 bg-[#1a1512] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[var(--terracotta)] transition-colors"
                                >
                                    Consult an Expert
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
