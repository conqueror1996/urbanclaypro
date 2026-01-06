'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Sustainability() {
    return (
        <section className="py-24 md:py-32 bg-[var(--sand)] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            Our Responsibility
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif text-[var(--ink)] leading-tight mb-8">
                            100% Natural. <br />
                            1000 Years of Durability.
                        </h2>
                        <p className="text-[var(--ink)]/60 text-lg md:text-xl font-light leading-relaxed mb-12">
                            Clay is the ultimate circular material. Sourced from the earth, fired by hand, and designed to outlast the structures it protects. No toxic binders, no microplastics, just timeless geology.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-10">
                            <div>
                                <span className="block text-3xl font-serif text-[var(--ink)] mb-1">Low</span>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]/40 font-bold">Carbon Footprint</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-serif text-[var(--ink)] mb-1">Bio</span>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]/40 font-bold">Degradable</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-serif text-[var(--ink)] mb-1">High</span>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]/40 font-bold">Recyclability</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-serif text-[var(--ink)] mb-1">0%</span>
                                <span className="text-[10px] uppercase tracking-wider text-[var(--ink)]/40 font-bold">Chemical Waste</span>
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
                        <div className="absolute top-0 right-0 p-4 bg-white rounded-full shadow-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
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
