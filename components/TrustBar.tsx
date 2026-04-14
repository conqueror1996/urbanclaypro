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
        <section className="section-padding border-y border-[var(--line)] overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center mb-10 md:mb-16">
                    <span className="text-[var(--terracotta)] font-black tracking-[0.3em] uppercase text-[10px] mb-4">Masterpiece Portfolio</span>
                    <h2 className="text-center text-3xl md:text-5xl font-serif text-[var(--ink)] tracking-tight mb-4">
                        The National Specification <br /> <span className="italic opacity-60">Standard.</span>
                    </h2>
                    <p className="text-center text-[10px] uppercase tracking-[0.2em] md:tracking-[0.2em] text-[#777] font-semibold max-w-lg mx-auto leading-relaxed">
                        Preferred by India&apos;s leading AD100 Firms <br className="hidden md:block" /> for high-precision architectural facades.
                    </p>
                </div>

                <div className="md:hidden overflow-hidden -mx-6">
                    <motion.div
                        animate={{
                            x: [0, -1000],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30,
                                ease: "linear",
                            },
                        }}
                        className="flex items-center gap-12 whitespace-nowrap pl-6"
                    >
                        {[...displayFirms, ...displayFirms, ...displayFirms].map((firm, idx) => (
                            <div
                                key={`${firm.name}-${idx}`}
                                className="flex-shrink-0 grayscale opacity-40"
                            >
                                <span className="text-lg font-serif italic text-[#777] tracking-tight font-normal">
                                    {firm.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="hidden md:flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:gap-x-24">
                    {displayFirms.map((firm, idx) => (
                        <div
                            key={`${firm.name}-${idx}`}
                            className="flex-shrink-0 grayscale opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-default"
                        >
                            <span className="text-lg md:text-xl font-serif italic text-[#777] tracking-tight font-normal">
                                {firm.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
