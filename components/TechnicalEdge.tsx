'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface TechnicalEdgeProps {
    imageUrl?: string;
}

export default function TechnicalEdge({ imageUrl }: TechnicalEdgeProps) {
    return (
        <section className="py-16 md:py-24 text-[var(--foreground)] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] text-[11px] md:text-xs font-black tracking-[0.3em] uppercase mb-4 block">
                            THE TECHNICAL EDGE
                        </span>
                        <h2 className="text-[var(--foreground)] leading-tight mb-4 md:mb-6 text-3xl md:text-5xl font-serif">
                            The Science of <br className="hidden md:block" /> Perfect Facades
                        </h2>
                        <p className="text-[var(--foreground)]/60 text-sm md:text-lg leading-relaxed max-w-lg mb-8 md:mb-12 font-normal">
                            We bridge the gap between architectural vision and material reality. By replacing traditional masonry with industrialized precision, we ensure your facade remains pristine for generations.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-12">
                            {[
                                { label: "0.2mm Precision", desc: "Industrial-grade tolerance" },
                                { label: "1150°C Kiln Firing", desc: "Full vitrification" },
                                { label: "Salt-Free Clay Processing", desc: "Zero efflorescence" },
                                { label: "30% HVAC Efficiency", desc: "Thermal buffer technology" }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] shrink-0" />
                                        <span className="font-bold text-base md:text-lg text-[var(--foreground)]">{feature.label}</span>
                                    </div>
                                    <span className="text-xs text-[var(--foreground)]/50 ml-4.5 uppercase tracking-widest font-semibold">{feature.desc}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                            <Link href="/contact" className="inline-flex items-center justify-center h-[56px] px-10 bg-[var(--terracotta)] hover:bg-[#c25e3b] text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-all shadow-lg active:scale-95 text-center flex-1 md:flex-none">
                                Request Spec Kit
                            </Link>
                            <Link href="/products" className="inline-flex items-center justify-center h-[56px] px-10 bg-transparent border border-[var(--line)] hover:bg-[var(--sand)] text-[var(--foreground)] text-xs font-semibold uppercase tracking-widest rounded-full transition-all active:scale-95 text-center flex-1 md:flex-none shadow-sm">
                                Explore Systems
                            </Link>
                        </div>
                    </div>

                    <div className="relative mt-4 lg:mt-0 group/tech">
                        <div className="aspect-[4/3] lg:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center border border-[var(--line)]">
                            <img
                                src={imageUrl || "/images/technical-detail.png"}
                                alt="Technical clay drafting and precision alignment"
                                className="w-full h-full object-contain transition-all duration-[1.5s] ease-in-out scale-105 group-hover/tech:scale-100"
                            />
                        </div>
                        {/* Material Longevity Badge - Responsive Positioning */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mt-6 lg:mt-0 lg:absolute lg:bottom-4 lg:right-4 md:lg:-bottom-8 md:lg:-right-8 bg-[var(--background)] p-6 md:p-8 rounded-2xl shadow-2xl z-20 border border-[var(--line)]"
                        >
                            <span className="block text-[32px] md:text-[40px] font-serif text-[var(--foreground)] mb-1 tracking-tight">1000y+</span>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--foreground)]/50 font-extrabold leading-tight">
                                Material Longevity<br />100% Circular
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
