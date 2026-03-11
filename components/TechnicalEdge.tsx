'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, Flame, ShieldCheck, Thermometer, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface TechnicalEdgeProps {
    imageUrl?: string;
}

export default function TechnicalEdge({ imageUrl }: TechnicalEdgeProps) {
    const features = [
        {
            icon: <Ruler className="w-4 h-4" />,
            label: "0.2mm Precision",
            desc: "Industrial-grade joins."
        },
        {
            icon: <Flame className="w-4 h-4" />,
            label: "Vitrified",
            desc: "Zero water absorption."
        },
        {
            icon: <ShieldCheck className="w-4 h-4" />,
            label: "Salt-Free",
            desc: "No white staining."
        },
        {
            icon: <Thermometer className="w-4 h-4" />,
            label: "Thermal",
            desc: "30% HVAC efficiency."
        }
    ];

    return (
        <section className="py-16 md:py-20 bg-[#F9F8F6] text-[var(--ink)] overflow-hidden relative border-y border-[var(--line)]/50">
            {/* Background Engineering Grid - Subtle contrast for light theme */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(var(--ink) 1px, transparent 0)', backgroundSize: '60px 60px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

                    {/* Left Side: Scaled down Content */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-flex items-center gap-2 text-[var(--terracotta)] text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
                                <span className="w-6 h-px bg-[var(--terracotta)]" />
                                Engineering
                            </span>

                            <h2 className="text-3xl md:text-5xl font-serif leading-[1] mb-6 tracking-tighter text-[var(--ink)]">
                                The Physics of <br />
                                <span className="text-[var(--ink)]/40 italic">Perfect Facades.</span>
                            </h2>

                            {/* Feature Grid - More compact 2-column layout */}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-10">
                                {features.map((feature, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-[var(--line)] flex items-center justify-center text-[var(--terracotta)] group-hover:bg-[var(--terracotta)] group-hover:text-white transition-all duration-300 shadow-sm shrink-0">
                                                {feature.icon}
                                            </div>
                                            <h4 className="text-sm font-bold uppercase tracking-tight text-[var(--ink)] group-hover:text-[var(--terracotta)] transition-colors">
                                                {feature.label}
                                            </h4>
                                        </div>
                                        <p className="text-[11px] text-[var(--ink)]/50 leading-tight pl-1">
                                            {feature.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/contact"
                                    className="group inline-flex items-center gap-2.5 bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-[var(--terracotta)]/20"
                                >
                                    Technical Catalog
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Vibrant Image with tighter overlays */}
                    <div className="lg:col-span-7 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-video lg:aspect-[16/10] rounded-2xl overflow-hidden border border-[var(--line)] group/img shadow-xl"
                        >
                            <img
                                src={imageUrl || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80"}
                                alt="Technical detail"
                                className="w-full h-full object-cover transition-all duration-[2s] group-hover/img:scale-105"
                            // Removed grayscale and opacity filters
                            />

                            {/* Subtler Scanning Line */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--terracotta)]/5 to-transparent h-1 w-full animate-technical-scan z-20 pointer-events-none" />

                            {/* Compact Overlays */}
                            <div className="absolute top-4 right-4 pointer-events-none">
                                <div className="p-3 bg-white/90 backdrop-blur-md rounded-lg border border-[var(--line)] text-[8px] uppercase tracking-widest font-mono text-[var(--ink)]/40 shadow-sm leading-tight text-right">
                                    ASTM: C1088-20 <br />
                                    ISO: 10545
                                </div>
                            </div>
                        </motion.div>

                        {/* Tighter Floating Performance Badge */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="mt-6 lg:mt-0 lg:absolute lg:bottom-4 lg:-left-6 bg-[var(--ink)] p-6 rounded-xl shadow-xl z-20 border border-white/10 text-white"
                        >
                            <div className="flex items-center gap-5">
                                <div>
                                    <span className="block text-3xl font-serif text-white mb-0.5 tracking-tighter">1000y<span className="text-[var(--terracotta)]">+</span></span>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-black leading-none block border-t border-white/5 pt-2">
                                        Longevity Grade
                                    </span>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <div>
                                    <span className="block text-lg font-serif text-white">A1</span>
                                    <span className="text-[9px] uppercase tracking-widest text-white/40">Fire Rated</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
