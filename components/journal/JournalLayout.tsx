'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { JournalPost } from '@/lib/journal';
import PremiumImage from '@/components/PremiumImage';

interface JournalLayoutProps {
    featured: JournalPost | null;
    posts: JournalPost[];
}

export default function JournalLayout({ featured, posts }: JournalLayoutProps) {
    const [filter, setFilter] = useState('All');

    // Updated Categories based on Strategy
    const categories = ['All', 'Facade Engineering', 'Design Narratives', 'Sustainable Practice', 'Material Innovation'];

    // For demo purposes, we map existing generic categories if necessary, 
    // or rely on what's available. 
    const filteredPosts = filter === 'All'
        ? posts
        : posts.filter(p => {
            // Simplified filter logic since we don't have the new tags in backend yet
            // This is a placeholder for the logic.
            return p.category === filter || (filter === 'Design Narratives' && (p.category === 'Architecture' || p.category === 'Design'));
        });

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 py-16">
            {/* FEATURED STORY - Editorial Split */}
            {featured && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-32 group cursor-pointer"
                >
                    <Link href={`/journal/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                        {/* Image takes 7 columns */}
                        <div className="lg:col-span-7 relative aspect-[16/9] lg:aspect-[3/2] overflow-hidden rounded-sm">
                            <PremiumImage
                                src={featured.mainImage || '/placeholder-journal.jpg'}
                                alt={featured.title}
                                className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                                width={1200}
                                height={800}
                                priority
                            />
                        </div>

                        {/* Text takes 5 columns */}
                        <div className="lg:col-span-5 flex flex-col justify-center lg:pr-12 mt-8 lg:mt-0">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-[var(--terracotta)] font-bold uppercase tracking-[0.2em] text-[10px]">
                                    Featured Analysis
                                </span>
                                <span className="h-px w-8 bg-gray-300"></span>
                                <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                    {featured.category || 'Material Innovation'}
                                </span>
                            </div>

                            <h2 className="font-serif text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-[#1a1512] mb-8 font-medium">
                                {featured.title}
                            </h2>

                            <p className="text-[#555] text-lg font-light leading-relaxed mb-10 line-clamp-3 max-w-lg">
                                {featured.excerpt}
                            </p>

                            <div className="group-hover:translate-x-2 transition-transform duration-500 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1512]">
                                Read Full Story <span className="text-[var(--terracotta)]">→</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* REFINED FILTERS */}
            <div className="flex justify-start md:justify-center mb-20 overflow-x-auto no-scrollbar pl-4 md:pl-0">
                <div className="flex gap-12 pb-4 border-b border-[#1a1512]/10 min-w-max">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${filter === cat
                                ? 'text-[var(--terracotta)]'
                                : 'text-gray-400 hover:text-[#1a1512]'
                                }`}
                        >
                            {cat}
                            {filter === cat && (
                                <motion.div
                                    layoutId="activeFilter"
                                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--terracotta)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* EDITORIAL GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
                {filteredPosts.map((post, i) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                    >
                        <Link href={`/journal/${post.slug}`} className="group block flex flex-col h-full">
                            {/* Image Container - Aspect 4:3 for a more classic feel */}
                            <div className="relative aspect-[4/3] overflow-hidden mb-8 bg-[#f0f0f0]">
                                <PremiumImage
                                    src={post.mainImage || '/placeholder-journal.jpg'}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 grayscale-[10%] group-hover:grayscale-0"
                                    width={800}
                                    height={600}
                                />
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-4 border-t border-gray-200 pt-4">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--terracotta)]">
                                        {post.category || 'Article'}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        {post.readTime}
                                    </span>
                                </div>

                                <h3 className="font-serif text-3xl text-[#1a1512] leading-[1.1] mb-4 group-hover:text-[var(--terracotta)] transition-colors duration-300">
                                    {post.title}
                                </h3>

                                <p className="text-[#666] text-sm font-light leading-relaxed line-clamp-3 mb-6">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredPosts.length === 0 && (
                <div className="py-32 text-center border-t border-gray-100 mt-12">
                    <p className="font-serif text-3xl text-gray-300 italic mb-4">No stories found.</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1a1512]">Check back for updates in this category.</p>
                </div>
            )}
        </div>
    );
}
