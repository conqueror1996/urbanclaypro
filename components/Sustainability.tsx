'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Sustainability() {
    return (
        <section className="section-padding bg-[var(--sand)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <span className="text-[var(--terracotta)] font-semibold tracking-widest uppercase text-[10px] md:text-xs mb-2 block">
                            Our Responsibility
                        </span>
                        <h2 className="mb-6 md:mb-8 font-extrabold text-[var(--ink)]">
                            100% Natural. <br />
                            1000 Years of Durability.
                        </h2>
                        <p className="text-[var(--ink)]/80 text-lg md:text-xl leading-relaxed mb-12 font-normal">
                            Clay is the ultimate circular material. Sourced from the earth and refined by fire, it is designed to outlast the structures it protects. No toxic binders, no plastics—just pure, timeless geology.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <span className="block text-2xl md:text-3xl font-serif text-[var(--ink)] mb-2">Low</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--ink)]/60 font-semibold">Carbon Footprint</span>
                            </div>
                            <div>
                                <span className="block text-2xl md:text-3xl font-serif text-[var(--ink)] mb-2">Bio</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--ink)]/60 font-semibold">Degradable</span>
                            </div>
                            <div>
                                <span className="block text-2xl md:text-3xl font-serif text-[var(--ink)] mb-2">High</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--ink)]/60 font-semibold">Recyclability</span>
                            </div>
                            <div>
                                <span className="block text-2xl md:text-3xl font-serif text-[var(--ink)] mb-2">0%</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--ink)]/60 font-semibold">Chemical Waste</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-full overflow-hidden border-[16px] border-white/50 shadow-2xl">
                            <img
                                src="/images/sustainability-abstract.png"
                                alt="Sustainable clay cycles"
                                className="w-full h-full object-cover scale-110"
                            />
                        </div>
                        {/* Decorative Leaf */}
                        <div className="absolute top-0 right-0 p-4 bg-[var(--background)] rounded-full shadow-lg">
                            <svg className="w-6 h-6 text-[var(--terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Artistic Background Element */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 aspect-square bg-[var(--terracotta)]/5 rounded-full blur-[120px] pointer-events-none" />
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none"
            >
                <img src="/logo-icon.svg" alt="" className="w-96 h-96" />
            </motion.div>
        </section>
    );
}
