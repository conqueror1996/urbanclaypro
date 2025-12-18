"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GuideData } from '@/lib/products';

interface GuideContentProps {
    data?: GuideData | null;
}

export default function GuideContent({ data }: GuideContentProps) {
    // Fallback data if Sanity data is not available
    const spectrumItems = data?.spectrumItems || [
        {
            title: 'Wirecut',
            imageUrl: '/images/products/wirecut-texture.jpg',
            description: 'Precision-cut by wire. Sharp edges, uniform shape, and a modern, clean aesthetic.',
            features: ['Sharp, crisp edges', 'Uniform consistency', 'Modern aesthetic'],
            bestFor: 'Modern Facades',
            link: '/products/exposed-bricks?variant=wirecut'
        },
        {
            title: 'Pressed',
            imageUrl: '/images/products/pressed-texture.jpg',
            description: 'Compressed under high pressure. Extremely dense, consistent, and durable.',
            features: ['High density', 'Extreme durability', 'Smooth matte finish'],
            bestFor: 'Heavy Traffic Flooring',
            link: '/products/exposed-bricks?variant=pressed'
        },
        {
            title: 'Handmade',
            imageUrl: '/images/products/handmade-texture.jpg',
            description: 'Molded by hand. Each piece is unique with rustic imperfections and character.',
            features: ['Unique variations', 'Rustic charm', 'Organic texture'],
            bestFor: 'Heritage / Rustic Look',
            link: '/products/exposed-bricks?variant=handmade'
        }
    ];

    const comparisonCards = [
        {
            title: 'Wirecut',
            description: 'Precision & Uniformity',
            href: '/products/exposed-bricks',
            icon: (
                <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
            ),
            costLevel: 2, // Moderate
            specs: [
                { label: 'Water Absorption', value: '10-12%' },
                { label: 'Compressive Strength', value: 'High' },
                { label: 'Color Variation', value: 'Low' }
            ]
        },
        {
            title: 'Pressed',
            description: 'Density & Durability',
            href: '/products/exposed-bricks',
            icon: (
                <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            costLevel: 3, // High
            specs: [
                { label: 'Water Absorption', value: '6-8%' },
                { label: 'Compressive Strength', value: 'Very High' },
                { label: 'Color Variation', value: 'Very Low' }
            ]
        },
        {
            title: 'Handmade',
            description: 'Character & Charm',
            href: '/products/exposed-bricks',
            icon: (
                <svg className="w-8 h-8 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
            ),
            costLevel: 4, // Premium
            specs: [
                { label: 'Water Absorption', value: '12-15%' },
                { label: 'Compressive Strength', value: 'Moderate' },
                { label: 'Color Variation', value: 'High' }
            ]
        }
    ];

    const glossaryItems = data?.glossaryItems || [
        {
            term: 'Water Absorption',
            definition: 'The percentage of water a brick absorbs by weight. Lower absorption (6-10%) is better for exterior facades in high-rainfall areas to prevent dampness and algae growth.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            )
        },
        {
            term: 'Compressive Strength',
            definition: 'The load-bearing capacity of the brick. Measured in kg/cm². For load-bearing walls, look for >75 kg/cm². For cladding/partition, >35 kg/cm² is sufficient.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            )
        },
        {
            term: 'Efflorescence',
            definition: 'A white powdery deposit on the surface caused by salts. Our bricks are "low efflorescence," meaning they are treated to minimize this common issue.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )
        },
        {
            term: 'Thermal Mass',
            definition: 'Clay\'s ability to absorb and store heat. High thermal mass helps keep interiors cool in summer and warm in winter, reducing AC costs.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )
        }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* SECTION 1: THE CLAY SPECTRUM */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-serif font-bold text-[#2A1E16] mb-16 text-center">The Clay Spectrum</h2>
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {spectrumItems.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden border border-[var(--terracotta)]/20 shadow-[0_10px_40px_-10px_rgba(42,30,22,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(42,30,22,0.15)] transition-all duration-300 group flex flex-col h-full">
                            {/* Large Texture Image */}
                            <div className="h-64 bg-[#d4c5b9] relative overflow-hidden">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={`${item.title} Texture`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#e7dbd1] flex items-center justify-center">No Image</div>
                                )}
                                {/* Badge - No overlay */}
                                <div className="absolute bottom-4 left-4 z-10">
                                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--terracotta)] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                        {item.bestFor}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-3xl font-serif font-bold text-[#2A1E16] mb-3">{item.title}</h3>
                                <p className="text-[#5d554f] mb-6 leading-relaxed">{item.description}</p>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {item.features && item.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[#5d554f] font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] mt-2 flex-shrink-0"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href={item.link || '/products'}
                                    className="w-full py-4 flex items-center justify-center gap-2 bg-[#F5EEE7] text-[var(--terracotta)] rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-[var(--terracotta)] hover:text-white transition-all group-hover:shadow-md"
                                >
                                    Explore {item.title}
                                    <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 2: COMPARISON MATRIX */}
            <section className="py-24 bg-[#faf7f3] relative overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2A1E16] mb-6">Quick Comparison</h2>
                        <p className="text-[#5d554f] max-w-2xl mx-auto text-xl font-light">Compare technical specifications to find the perfect match for your architectural needs.</p>
                    </motion.div>

                    {/* Mobile Scroll Container */}
                    <div className="relative">
                        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-12 -mx-4 px-4 gap-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 lg:gap-12">
                            {comparisonCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex-shrink-0 w-[85vw] md:w-auto snap-center bg-[#F6F1EB] rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(42,30,22,0.08)] transition-all duration-300 overflow-hidden group border border-[#E6DED5] flex flex-col"
                                >
                                    {/* Header */}
                                    <div className="p-6 md:p-8 border-b border-[#E6DED5] bg-white/50 backdrop-blur-sm">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#EFE7DF] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                                {React.cloneElement(card.icon as React.ReactElement<any>, { className: "w-5 h-5 md:w-8 md:h-8 text-[var(--terracotta)]" })}
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-serif text-[#2A1E16]">{card.title}</h3>
                                                <p className="text-xs md:text-sm text-[#7a6f66] font-medium">{card.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="p-6 md:p-8 space-y-5 flex-grow">
                                        {/* Cost Row */}
                                        <div className="flex items-center justify-between pb-4 border-b border-[#E6DED5]/60">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-[#a89f99]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                <span className="text-[#5d554f] font-semibold text-sm md:text-base">Cost</span>
                                            </div>
                                            <div className="flex gap-1.5">
                                                {[1, 2, 3, 4].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`w-5 h-1.5 md:w-6 md:h-2 rounded-full ${level <= card.costLevel
                                                            ? card.costLevel === 4 ? 'bg-[var(--terracotta)]' : card.costLevel === 3 ? 'bg-orange-400' : 'bg-yellow-400'
                                                            : 'bg-[#dcd5ce]'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Specs Rows */}
                                        {card.specs.map((spec, i) => (
                                            <div key={i} className={`flex items-center justify-between ${i !== card.specs.length - 1 ? 'pb-4 border-b border-[#E6DED5]/60' : ''}`}>
                                                <div className="flex items-center gap-2">
                                                    {spec.label === 'Water Absorption' && (
                                                        <svg className="w-4 h-4 text-[#a89f99]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                                    )}
                                                    {spec.label === 'Compressive Strength' && (
                                                        <svg className="w-4 h-4 text-[#a89f99]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                    )}
                                                    {spec.label === 'Color Variation' && (
                                                        <svg className="w-4 h-4 text-[#a89f99]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                                    )}
                                                    <span className="text-[#5d554f] font-medium text-sm md:text-base">{spec.label}</span>
                                                </div>
                                                <span className="text-[#6B6258] text-sm md:text-base">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="p-6 md:p-8 pt-0 mt-auto">
                                        <Link href={card.href} className="block w-full py-3 text-center border border-[var(--terracotta)] text-[var(--terracotta)] rounded-lg font-medium hover:bg-[var(--terracotta)] hover:text-white transition-all text-sm uppercase tracking-wider">
                                            View Collection
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile Pagination Dots (Visual Only) */}
                        <div className="flex md:hidden justify-center gap-2 mt-4 absolute bottom-4 left-0 right-0">
                            {[0, 1, 2].map((dot) => (
                                <div key={dot} className="w-2 h-2 rounded-full bg-[#dcd5ce]" />
                            ))}
                            <div className="absolute text-[10px] text-[#a89f99] -bottom-5">Swipe to compare</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: TECHNICAL GLOSSARY */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-serif font-bold text-[#2A1E16] mb-16 text-center">Technical Glossary</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {glossaryItems.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl border border-[var(--line)] hover:border-[var(--terracotta)]/30 hover:shadow-lg transition-all duration-300 flex gap-6 items-start group">
                            <div className="w-12 h-12 rounded-xl bg-[var(--sand)] flex items-center justify-center text-[var(--terracotta)] flex-shrink-0 group-hover:scale-110 transition-transform">
                                {item.icon ? (
                                    React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-6 h-6" })
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                )}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-[#2A1E16] mb-3 group-hover:text-[var(--terracotta)] transition-colors">{item.term}</h4>
                                <p className="text-[#5d554f] leading-relaxed">
                                    {item.definition}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[var(--ink)] text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Still not sure?</h2>
                    <p className="text-white/80 mb-8">
                        Our experts can help you choose the perfect product for your specific site conditions.
                    </p>
                    <a
                        href="https://wa.me/918080081951?text=Hi%20UrbanClay,%20I%20need%20expert%20advice%20on%20selecting%20the%20right%20clay%20product."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-[var(--terracotta)] text-white rounded-full font-semibold hover:bg-[#a85638] transition-colors"
                    >
                        Talk to an Expert
                    </a>
                </div>
            </section>
        </motion.div>
    );
}
