'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    readTime: string;
    category: string;
}

const RELATED_ARTICLES: BlogPost[] = [
    {
        slug: 'best-terracotta-tiles-indian-homes-2025',
        title: 'Best Terracotta Tiles for Indian Homes in 2025',
        excerpt: 'Discover the best terracotta tiles for Indian homes. Compare wirecut, handmade & pressed options with expert recommendations.',
        readTime: '8 min read',
        category: 'Buying Guide'
    },
    {
        slug: 'terracotta-vs-ceramic-tiles-comparison',
        title: 'Terracotta vs Ceramic Tiles: Which is Better?',
        excerpt: 'Complete comparison of terracotta and ceramic tiles. Compare price, durability, and maintenance for Indian homes.',
        readTime: '7 min read',
        category: 'Comparison Guide'
    },
    {
        slug: 'how-to-choose-clay-tiles-architects-guide',
        title: 'How to Choose Clay Tiles: Architect\'s Guide',
        excerpt: 'Expert guide on selecting clay tiles. Learn about specifications, quality checks, and installation for your project.',
        readTime: '9 min read',
        category: 'Technical Guide'
    }
];

export default function RelatedArticles() {
    return (
        <section className="bg-[#FAF7F3] py-20">
            <div className="max-w-[1800px] mx-auto px-4 md:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-xs font-bold uppercase tracking-widest mb-4">
                        Learn More
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#2A1E16] mb-4">
                        Related Articles
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Expert guides to help you make the right choice for your project
                    </p>
                </div>

                {/* Articles Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {RELATED_ARTICLES.map((article, idx) => (
                        <motion.div
                            key={article.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link
                                href={`/journal/${article.slug}`}
                                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full"
                            >
                                {/* Category Badge */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--terracotta)]">
                                            {article.category}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {article.readTime}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-serif text-[#2A1E16] mb-3 group-hover:text-[var(--terracotta)] transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    {/* Read More Link */}
                                    <div className="flex items-center gap-2 text-sm font-bold text-[var(--terracotta)] group-hover:gap-3 transition-all">
                                        <span>Read Article</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-12">
                    <Link
                        href="/journal"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#2A1E16] text-white rounded-full font-bold uppercase tracking-wider text-sm hover:bg-[var(--terracotta)] transition-all"
                    >
                        <span>View All Articles</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
