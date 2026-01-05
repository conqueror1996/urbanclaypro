import React from 'react';
import Link from 'next/link';

export default function HomeSEOContent() {
    return (
        <section className="py-24 bg-[#Fbf9f7] text-[#1a1512] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">

                {/* --- HEADER SECTION --- */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <span className="text-[var(--terracotta)] text-xs font-bold tracking-[0.25em] uppercase mb-6 block">
                        The Authority in Clay
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif leading-[1.1] text-[#1a1512] mb-8">
                        India's Premier Destination for <br className="hidden md:block" />
                        <span className="italic text-[#5d554f]">Terracotta & Clay Products</span>
                    </h2>
                    <div className="w-px h-16 bg-[#1a1512]/10 mx-auto"></div>
                </div>

                {/* --- EDITORIAL GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 border-t border-[#1a1512]/10 pt-16">

                    {/* LEFT: INTRO NARRATIVE */}
                    <div className="lg:col-span-5">
                        <p className="text-xl md:text-2xl font-serif leading-relaxed text-[#1a1512]">
                            Welcome to <strong>UrbanClay®</strong>. We are the architects of earth, manufacturing high-precision <Link href="/products" className="text-[var(--terracotta)] hover:underline decoration-1 underline-offset-4">terracotta tiles</Link> and cladding systems for the modern Indian landscape.
                        </p>
                        <p className="mt-6 text-[#5d554f] leading-loose">
                            From heritage restorations to contemporary facades, we specialize in transforming spaces with natural, sustainable materials that blend timeless aesthetics with modern engineering.
                        </p>
                    </div>

                    {/* RIGHT: DETAILS GRID */}
                    <div className="lg:col-span-7 grid md:grid-cols-2 gap-12">

                        {/* Column 1: Core Offerings */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--terracotta)]">Our Core Products</h3>
                            <ul className="space-y-6">
                                <li className="group">
                                    <strong className="block text-lg font-serif mb-1 group-hover:text-[var(--terracotta)] transition-colors">Clay Floor Tiles</strong>
                                    <span className="text-sm text-[#5d554f] leading-relaxed">Durable, earthy flooring for patios, homes, and heritage sites.</span>
                                </li>
                                <li className="group">
                                    <strong className="block text-lg font-serif mb-1 group-hover:text-[var(--terracotta)] transition-colors">Terracotta Wall Tiles</strong>
                                    <span className="text-sm text-[#5d554f] leading-relaxed">Breathable, low-efflorescence cladding for facades and interiors.</span>
                                </li>
                                <li className="group">
                                    <strong className="block text-lg font-serif mb-1 group-hover:text-[var(--terracotta)] transition-colors">Exposed Brick Cladding</strong>
                                    <span className="text-sm text-[#5d554f] leading-relaxed">Authentic wirecut and handmade brick veneers.</span>
                                </li>
                                <li className="group">
                                    <strong className="block text-lg font-serif mb-1 group-hover:text-[var(--terracotta)] transition-colors">Decorative Jaali</strong>
                                    <span className="text-sm text-[#5d554f] leading-relaxed">Ventilated terracotta screens for light and air flow.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Why Choose Us */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-[var(--terracotta)]">The UrbanClay Promise</h3>
                            <ul className="space-y-6">
                                <li className="border-b border-[#1a1512]/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[var(--terracotta)] text-xs">01</span>
                                        <strong className="text-base font-bold">Pan-India Delivery</strong>
                                    </div>
                                    <p className="text-sm text-[#5d554f]">Shipping to Mumbai, Delhi, Bangalore, Hyderabad, and 100+ cities.</p>
                                </li>
                                <li className="border-b border-[#1a1512]/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[var(--terracotta)] text-xs">02</span>
                                        <strong className="text-base font-bold">100% Sustainable</strong>
                                    </div>
                                    <p className="text-sm text-[#5d554f]">Pure natural clay, eco-friendly manufacturing, and fully recyclable.</p>
                                </li>
                                <li className="border-b border-[#1a1512]/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[var(--terracotta)] text-xs">03</span>
                                        <strong className="text-base font-bold">Architect Preferred</strong>
                                    </div>
                                    <p className="text-sm text-[#5d554f]">High precision batching and custom sizes for specification.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* --- FOOTER NOTE --- */}
                <div className="mt-20 pt-10 border-t border-[#1a1512]/10 text-center">
                    <p className="text-sm text-[#5d554f] max-w-2xl mx-auto italic">
                        "Experience the warmth of earth with our curated collection of kiln-fired products. Whether designing a sustainable facade or a warm home interior, we provide the technical expertise you need."
                    </p>
                </div>

            </div>
        </section>
    );
}
