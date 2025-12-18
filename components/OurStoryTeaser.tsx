'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OurStoryTeaserProps {
    data?: {
        ourStoryImageUrl?: string;
    } | null;
}

export default function OurStoryTeaser({ data }: OurStoryTeaserProps) {
    // Use Sanity image if available, otherwise fallback to user uploaded texture image
    const imageUrl = data?.ourStoryImageUrl || '/images/our-philosophy-texture.jpg';

    return (
        <section className="py-20 md:py-32 bg-[var(--sand)] border-y border-[var(--line)] relative overflow-hidden">
            {/* Subtle Background Animation */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[#b45a3c]/10 blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#2f2a26]/5 blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 40, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.8,
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className="py-10"
                    >
                        <motion.span variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-4 block">Our Philosophy</motion.span>
                        <motion.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-4xl md:text-5xl font-serif text-[#2A1E16] mb-8 leading-tight">
                            Crafting Earth into <br />
                            <span className="italic text-[var(--terracotta)]">Timeless Legacies</span>
                        </motion.h2>
                        <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-lg text-[#5d554f] mb-8 leading-relaxed font-light">
                            UrbanClay wasn't just built to sell tiles; it was born from a reverence for the earth.
                            For over 17 years, we have been partnering with visionary architects to transform humble clay into facades that breathe, age gracefully, and tell a story.
                        </motion.p>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-3 gap-8 mb-10 border-t border-[var(--line)] pt-8">
                            <div>
                                <div className="text-4xl md:text-5xl font-serif font-bold text-[#2A1E16] mb-1">17+</div>
                                <div className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-widest">Years</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-serif font-bold text-[#2A1E16] mb-1">700+</div>
                                <div className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-widest">Projects</div>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-serif font-bold text-[#2A1E16] mb-1">10k+</div>
                                <div className="text-xs font-bold text-[var(--terracotta)] uppercase tracking-widest">Trees</div>
                            </div>
                        </motion.div>

                        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                            <Link
                                href="/our-story"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#2A1E16] text-white rounded-full text-sm font-medium hover:bg-[#4a3e36] transition-all shadow-lg hover:shadow-xl group"
                            >
                                Read Our Full Story
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Image - Replace the src with your actual image path */}
                        <Image
                            src={imageUrl}
                            alt="Artisan crafting clay products"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                        {/* Optional overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
