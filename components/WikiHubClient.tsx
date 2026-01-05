'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Article {
    title: string;
    slug: string;
    category: string;
    difficulty: string;
    summary: string;
}

interface WikiHubClientProps {
    initialArticles: Article[];
    categories: string[];
}

export default function WikiHubClient({ initialArticles, categories }: WikiHubClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const iconMap: Record<string, string> = {
        installation: '🔨',
        technical: '📐',
        maintenance: '🧹',
        science: '🔬',
        history: '🏛️'
    };

    const labelMap: Record<string, string> = {
        installation: 'Installation Guides',
        technical: 'Technical Specs',
        maintenance: 'Maintenance & Care',
        science: 'Material Science',
        history: 'Architectural History'
    };

    // Filter Logic
    const filteredArticles = useMemo(() => {
        return initialArticles.filter(article => {
            const matchesSearch =
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.summary?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = activeCategory === 'All' || article.category === activeCategory;

            return matchesSearch && matchesCategory;
        });
    }, [initialArticles, searchTerm, activeCategory]);

    // Grouping for "All" view
    const grouped = useMemo(() => {
        if (activeCategory !== 'All') return { [activeCategory]: filteredArticles };

        return categories.reduce((acc, cat) => {
            const catArticles = filteredArticles.filter(a => a.category === cat);
            if (catArticles.length > 0) acc[cat] = catArticles;
            return acc;
        }, {} as Record<string, Article[]>);
    }, [activeCategory, filteredArticles, categories]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Hero Search Section */}
            <div className="text-center mb-16">
                <p className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4">The Clay Encyclopedia</p>
                <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6">
                    Master the Art of Clay.
                </h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    Deep-dive technical resources for architects, contractors, and homeowners.
                </p>

                {/* Search Input */}
                <div className="max-w-xl mx-auto relative z-10">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search for 'Efflorescence', 'Bonding Patterns'..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] outline-none shadow-lg text-lg transition-all"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${activeCategory === 'All'
                                ? 'bg-[var(--terracotta)] text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        All Topics
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${activeCategory === cat
                                    ? 'bg-[var(--terracotta)] text-white'
                                    : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {labelMap[cat] || cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* If active category is ALL, we map through groups. If specific, we show just that group but maybe in a grid? 
                    Actually the current structure maps categories to cards. Let's keep that card structure for categories.
                    But if searching, we might wants a flat list? 
                    Let's stick to the grouped card view for now as it organizes things well.
                */}

                {Object.keys(grouped).length > 0 ? (
                    Object.keys(grouped).map(cat => (
                        <div key={cat} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[var(--sand)] flex items-center justify-center text-xl">
                                    {iconMap[cat] || '📄'}
                                </div>
                                <h2 className="text-xl font-serif text-[#2A1E16]">{labelMap[cat] || cat}</h2>
                            </div>
                            <ul className="space-y-4 flex-1">
                                {grouped[cat].map((article) => (
                                    <li key={article.slug}>
                                        <Link href={`/wiki/${article.slug}`} className="group block">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-medium text-gray-900 group-hover:text-[var(--terracotta)] transition-colors leading-snug">
                                                    {article.title}
                                                </h3>
                                                {/* Difficulty Badge */}
                                                {article.difficulty && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider shrink-0 mt-0.5
                                                        ${article.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                                            article.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {article.difficulty.substring(0, 3)}
                                                    </span>
                                                )}
                                            </div>
                                            {article.summary && (
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                                    {article.summary}
                                                </p>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                                <span>{grouped[cat].length} Articles</span>
                                <Link
                                    href={`/wiki/category/${cat}`}
                                    className="font-bold text-[var(--terracotta)] uppercase tracking-wider hover:opacity-80"
                                >
                                    View All →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-400 text-lg">No articles found matching "{searchTerm}"</p>
                        <button
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="mt-4 text-[var(--terracotta)] font-bold underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
