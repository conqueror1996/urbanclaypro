'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    readTime: string;
    category: string;
    image?: string;
}

const RELATED_ARTICLES: BlogPost[] = [
    {
        slug: 'best-terracotta-tiles-indian-homes-2025',
        title: 'Best Terracotta Tiles for Indian Homes in 2025',
        excerpt: 'Discover the best terracotta tiles for Indian homes. Compare wirecut, handmade & pressed options with expert recommendations.',
        readTime: '8 min read',
        category: 'Buying Guide',
        image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?q=80&w=800&auto=format&fit=crop' // Terracotta/Brick texture
    },
    {
        slug: 'terracotta-vs-ceramic-tiles-comparison',
        title: 'Terracotta vs Ceramic Tiles: Which is Better?',
        excerpt: 'Complete comparison of terracotta and ceramic tiles. Compare price, durability, and maintenance for Indian homes.',
        readTime: '7 min read',
        category: 'Comparison Guide',
        image: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop' // Modern clean interior
    },
    {
        slug: 'how-to-choose-clay-tiles-architects-guide',
        title: 'How to Choose Clay Tiles: Architect\'s Guide',
        excerpt: 'Expert guide on selecting clay tiles. Learn about specifications, quality checks, and installation for your project.',
        readTime: '9 min read',
        category: 'Technical Guide',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop' // Architect planning/detail
    }
];

export default function RelatedArticles() {
    return (
        <section className="bg-[#FAF7F3] py-24 border-t border-[#e9e2da]">
            <div className="max-w-[1800px] mx-auto px-6 md:px-12">
                {/* Minimal Header */}
                <div className="flex items-end justify-between mb-16 px-2">
                    <div>
                        <span className="block text-xs font-mono uppercase tracking-[0.3em] text-gray-400 mb-4">
                            The Journal
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16] leading-tight">
                            Design & <br /> Architecture
                        </h2>
                    </div>
                    <Link
                        href="/journal"
                        className="hidden md:flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-[#2A1E16] hover:text-[var(--terracotta)] transition-colors group"
                    >
                        View All
                        <span className="w-8 h-[1px] bg-[#2A1E16] group-hover:bg-[var(--terracotta)] transition-colors"></span>
                    </Link>
                </div>

                {/* Editorial Grid / Mobile Carousel */}
                <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {RELATED_ARTICLES.map((article, idx) => (
                        <motion.div
                            key={article.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="group cursor-pointer flex-shrink-0 w-[85vw] md:w-auto snap-center"
                        >
                            <Link href={`/journal/${article.slug}`} className="block">
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 mb-8">
                                    <div className="absolute inset-0 bg-[#2A1E16]/0 group-hover:bg-[#2A1E16]/10 transition-colors duration-500 z-10" />
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>

                                {/* Content */}
                                <div className="space-y-4 px-2">
                                    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                                        <span className="text-[var(--terracotta)]">{article.category}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span>{article.readTime}</span>
                                    </div>

                                    <h3 className="text-2xl font-serif text-[#2A1E16] leading-snug group-hover:text-[#a85638] transition-colors duration-300">
                                        {article.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-gray-500 line-clamp-2 max-w-sm">
                                        {article.excerpt}
                                    </p>

                                    <div className="pt-4">
                                        <span className="inline-block border-b border-[#2A1E16]/20 py-1 text-xs font-bold uppercase tracking-widest text-[#2A1E16] group-hover:border-[#2A1E16] transition-all">
                                            Read Story
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile View All */}
                <div className="md:hidden mt-12 text-center">
                    <Link
                        href="/journal"
                        className="inline-block border-b border-[#2A1E16]/20 py-2 text-xs font-bold uppercase tracking-widest text-[#2A1E16]"
                    >
                        View All Stories
                    </Link>
                </div>
            </div>
        </section>
    );
}
