'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { JournalPost } from '@/lib/journal';

interface JournalLayoutProps {
    featured: JournalPost | null;
    posts: JournalPost[];
}

export default function JournalLayout({ featured, posts }: JournalLayoutProps) {
    const [filter, setFilter] = useState('All');
    const categories = ['All', 'Architecture', 'Sustainability', 'Design', 'Product Guide'];

    const filteredPosts = filter === 'All'
        ? posts
        : posts.filter(p => p.category === filter);

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            {/* FEATURED STORY - Editorial Split */}
            {featured && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="mb-32 group cursor-pointer"
                >
                    <Link href={`/journal/${featured.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 relative aspect-[4/3] overflow-hidden">
                            <motion.img
                                src={featured.mainImage || '/placeholder-journal.jpg'}
                                alt={featured.title}
                                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
                            />
                        </div>
                        <div className="order-1 lg:order-2 flex flex-col justify-center lg:pr-12">
                            <span className="text-[var(--terracotta)] font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                                Featured Story • {featured.category}
                            </span>
                            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#1a1512] mb-8 font-medium">
                                {featured.title}
                            </h2>
                            <p className="text-[#555] text-lg font-light leading-relaxed mb-8 line-clamp-3">
                                {featured.excerpt}
                            </p>
                            <div className="group-hover:translate-x-2 transition-transform duration-500 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1512]">
                                Read Full Story <span className="text-[var(--terracotta)]">→</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            )}

            {/* MINIMAL FILTERS */}
            <div className="flex justify-center mb-24">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-4 border-b border-[#1a1512]/10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300 ${filter === cat
                                    ? 'text-[var(--terracotta)]'
                                    : 'text-gray-400 hover:text-[#1a1512]'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* EDITORIAL GRID - Pure Image + Typography */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
                {filteredPosts.map((post, i) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                    >
                        <Link href={`/journal/${post.slug}`} className="group block flex flex-col h-full">
                            {/* Image Container */}
                            <div className="relative aspect-[3/2] overflow-hidden mb-6 bg-[#EBE5DE]">
                                <img
                                    src={post.mainImage || '/placeholder-journal.jpg'}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[#1a1512]/0 group-hover:bg-[#1a1512]/5 transition-colors duration-500" />
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--terracotta)]">
                                        {post.category || 'Article'}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400">
                                        {post.readTime}
                                    </span>
                                </div>

                                <h3 className="font-serif text-2xl md:text-3xl text-[#1a1512] leading-[1.15] mb-4 group-hover:text-[var(--terracotta)] transition-colors duration-300">
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
                <div className="py-32 text-center">
                    <p className="font-serif text-2xl text-gray-400 italic">No stories found in this collection.</p>
                </div>
            )}
        </div>
    );
}
