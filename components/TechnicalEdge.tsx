'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Thermometer, Box, Zap } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
    {
        id: 'zero-warpage',
        title: '0.2mm Tolerance',
        description: 'Computer-controlled firing ensures perfect dimensional stability and zero warpage for high-precision facade alignment.',
        icon: Box,
    },
    {
        id: 'architectural-grade',
        title: 'DIN Standards',
        description: 'Natural clay refined to industrial tolerances. Each piece is tested for density, frost resistance, and load-bearing strength.',
        icon: Shield,
    },
    {
        id: 'thermal-efficiency',
        title: 'Thermal Regulation',
        description: 'Naturally regulates indoor temperatures, reducing HVAC cooling loads by up to 30% in Indian climates.',
        icon: Thermometer,
    },
    {
        id: 'efflorescence-control',
        title: 'Salt-Free Processing',
        description: 'Proprietary de-airing and high-fire maturation (1150°C) eliminates salt migration, ensuring a permanent clean finish.',
        icon: Zap,
    }
];

export default function TechnicalEdge() {
    return (
        <section className="py-20 md:py-32 bg-[var(--ink)] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            The Technical Edge
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
                            Engineering a <br /> Failure-Free Facade.
                        </h2>
                        <p className="text-white/60 text-lg font-light leading-relaxed max-w-md mb-8">
                            We eliminate the risks architects hate most. UrbanClay systems are engineered to solve for salt migration, dimensional warpage, and maintenance failures typical of generic clay products.
                        </p>
                        <div className="mb-12">
                            <Link href="/resources/technical-data" className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-widest border-b border-[var(--terracotta)] pb-1 hover:text-white hover:border-white transition-all">
                                Download Technical Data →
                            </Link>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            {FEATURES.map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <feature.icon className="w-5 h-5 text-[var(--terracotta)]" />
                                        </div>
                                        <h3 className="font-medium text-lg">{feature.title}</h3>
                                    </div>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
                            <img
                                src="/images/technical-detail.png"
                                alt="Technical clay drafting and precision alignment"
                                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                            />
                        </div>
                        {/* Material Longevity Badge (Merging Sustainability here) */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-8 -right-8 md:-left-8 bg-[var(--terracotta)] p-8 rounded-2xl shadow-2xl z-20"
                        >
                            <span className="block text-4xl md:text-5xl font-serif text-white mb-1 tracking-tight">1000y+</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 font-bold leading-tight">
                                Material Longevity<br />100% Circular & Bio-Degradable
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
