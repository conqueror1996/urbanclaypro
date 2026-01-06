'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
    { name: 'Morphogenesis', logo: '/logos/morphogenesis.svg' },
    { name: 'Sanjay Puri', logo: '/logos/sanjay-puri.svg' },
    { name: 'Studio Lotus', logo: '/logos/studio-lotus.svg' },
    { name: 'Abin Design Studio', logo: '/logos/abin.svg' },
    { name: 'Malik Architecture', logo: '/logos/malik.svg' },
    // Repeat for continuous scroll if needed or use a set
];

export default function TrustBar() {
    return (
        <section className="py-12 bg-white border-y border-[var(--line)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-[10px] uppercase tracking-[0.3em] text-[var(--ink)]/40 font-bold mb-10">
                    Trusted by India&apos;s leading Architectural Firms
                </p>

                <div className="relative">
                    {/* Gradient Masks */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                    <motion.div
                        className="flex items-center gap-20 whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        {/* Double the logos for seamless loop */}
                        {[...LOGOS, ...LOGOS].map((logo, idx) => (
                            <div key={`${logo.name}-${idx}`} className="flex-shrink-0 grayscale opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                                <span className="text-2xl md:text-3xl font-serif italic text-[var(--ink)] tracking-tight">{logo.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
