'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Thermometer, Box, Zap } from 'lucide-react';

const FEATURES = [
    {
        title: 'Zero Warpage',
        description: 'Computer-controlled firing ensures perfect dimensional stability for seamless, high-precision installation.',
        icon: Box,
    },
    {
        title: 'Architectural Grade',
        description: 'Natural clay refined to industrial tolerances. Each piece is tested for density and load-bearing strength.',
        icon: Shield,
    },
    {
        title: 'Thermal Efficiency',
        description: 'High thermal mass naturally regulates indoor temperatures, reducing cooling loads in Indian climates.',
        icon: Thermometer,
    },
    {
        title: 'Efflorescence Control',
        description: 'Proprietary de-airing and processing minimizes salt migration, ensuring your facade stays clean for decades.',
        icon: Zap,
    }
];

export default function TechnicalEdge() {
    return (
        <section className="py-24 md:py-32 bg-[var(--ink)] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                            The Technical Edge
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif leading-tight mb-8">
                            High-Precision <br /> Clay Engineering.
                        </h2>
                        <p className="text-white/60 text-lg font-light leading-relaxed max-w-md mb-12">
                            We bridge the gap between organic material and industrial precision, providing architects with the reliability they demand.
                        </p>

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
                        {/* Floating Metric */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="absolute -bottom-8 -right-8 md:-left-8 bg-[var(--terracotta)] p-8 rounded-2xl shadow-2xl z-20"
                        >
                            <span className="block text-4xl md:text-5xl font-serif text-white mb-1 tracking-tight">1150°C</span>
                            <span className="text-[10px] uppercase tracking-wider text-white/80 font-bold leading-tight">
                                High-Fire Maturation<br />for Surface Density
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
