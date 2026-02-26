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

interface TechnicalEdgeProps {
    imageUrl?: string;
}

export default function TechnicalEdge({ imageUrl }: TechnicalEdgeProps) {
    return (
        <section className="py-16 md:py-32 bg-[var(--ink)] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            The Technical Edge
                        </span>
                        <h2 className="text-3xl md:text-6xl font-serif leading-tight mb-6">
                            Engineering a <br /> Failure-Free Facade.
                        </h2>
                        <p className="text-white/60 text-base md:text-lg font-light leading-relaxed max-w-md mb-8">
                            UrbanClay systems eliminate risks architects hate most: efflorescence, dimensional warpage, and maintenance failures through advanced precision firing.
                        </p>

                        <div className="mb-10 flex flex-wrap items-center gap-4">
                            <Link href="/comparison" className="inline-flex items-center justify-center px-5 py-2.5 bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg transition-all">
                                Comparison
                            </Link>
                            <Link href="/resources/technical-data" className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold uppercase tracking-widest border-b border-[var(--terracotta)] pb-1 hover:text-white hover:border-white transition-all">
                                Technical Data →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                            {FEATURES.map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <feature.icon className="w-4 h-4 text-[var(--terracotta)] shrink-0" />
                                        <h3 className="font-medium text-sm md:text-lg">{feature.title}</h3>
                                    </div>
                                    <p className="text-white/40 text-[10px] md:text-sm leading-tight md:leading-relaxed">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mt-8 lg:mt-0">
                        <div className="aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-white flex items-center justify-center">
                            <img
                                src={imageUrl || "/images/technical-detail.png"}
                                alt="Technical clay drafting and precision alignment"
                                className="w-full h-full object-contain transition-all duration-1000 ease-in-out scale-105 hover:scale-100"
                            />
                        </div>
                        {/* Material Longevity Badge */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="absolute -bottom-6 -right-6 bg-[var(--terracotta)] p-5 md:p-8 rounded-2xl shadow-2xl z-20"
                        >
                            <span className="block text-3xl md:text-5xl font-serif text-white mb-1 tracking-tight">1000y+</span>
                            <span className="text-[9px] uppercase tracking-wider text-white/80 font-bold leading-tight">
                                Material Longevity<br />100% Circular
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
