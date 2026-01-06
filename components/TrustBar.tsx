'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DEFAULT_LOGOS = [
    { name: 'Morphogenesis' },
    { name: 'Sanjay Puri' },
    { name: 'Studio Lotus' },
    { name: 'Abin Design Studio' },
    { name: 'Malik Architecture' },
];

interface TrustBarProps {
    firms?: { name: string }[];
}

export default function TrustBar({ firms }: TrustBarProps) {
    const displayFirms = (firms && firms.length > 0) ? firms : DEFAULT_LOGOS;

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
                        {[...displayFirms, ...displayFirms].map((firm, idx) => (
                            <div key={`${firm.name}-${idx}`} className="flex-shrink-0 grayscale opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                                <span className="text-2xl md:text-3xl font-serif italic text-[var(--ink)] tracking-tight">{firm.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
