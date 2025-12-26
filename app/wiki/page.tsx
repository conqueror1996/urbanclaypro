
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { client } from '@/sanity/lib/client';

export const metadata: Metadata = {
    title: 'Technical Knowledge Base | UrbanClay',
    description: 'The complete encyclopedia of terracotta, clay tiles, and architectural ceramics. Installation guides, technical specifications, and maintenance manuals.',
};

export const revalidate = 3600;

async function getWikiData() {
    return client.fetch(`{
        "articles": *[_type == "wikiArticle"] | order(title asc) {
            title,
            "slug": slug.current,
            category,
            difficulty,
            summary
        },
        "categories": *[_type == "wikiArticle"] | order(category asc).category
    }`);
}

export default async function WikiHub() {
    const { articles } = await getWikiData();

    // Group articles by category
    const categories = ['installation', 'technical', 'maintenance', 'science', 'history'];
    const grouped = categories.reduce((acc, cat) => {
        acc[cat] = articles.filter((a: any) => a.category === cat);
        return acc;
    }, {} as Record<string, any[]>);

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

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Header />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-16">
                    <p className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4">The Clay Encyclopedia</p>
                    <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6">
                        Master the Art of Clay.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Deep-dive technical resources for architects, contractors, and homeowners.
                        Everything from thermal properties to installation best practices.
                    </p>

                    {/* Search Placeholder */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for 'Efflorescence', 'Bonding Patterns'..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:border-[var(--terracotta)] focus:ring-1 focus:ring-[var(--terracotta)] outline-none shadow-sm"
                        />
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map(cat => (
                        grouped[cat]?.length > 0 && (
                            <div key={cat} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-[var(--sand)] flex items-center justify-center text-xl">
                                        {iconMap[cat]}
                                    </div>
                                    <h2 className="text-xl font-serif text-[#2A1E16]">{labelMap[cat]}</h2>
                                </div>
                                <ul className="space-y-4">
                                    {grouped[cat].map((article: any) => (
                                        <li key={article.slug}>
                                            <Link href={`/wiki/${article.slug}`} className="group block">
                                                <h3 className="font-medium text-gray-900 group-hover:text-[var(--terracotta)] transition-colors">
                                                    {article.title}
                                                </h3>
                                                {article.summary && (
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {article.summary}
                                                    </p>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`/wiki/category/${cat}`} className="inline-block mt-6 text-xs font-bold text-[var(--terracotta)] uppercase tracking-wider hover:opacity-80">
                                    View All →
                                </Link>
                            </div>
                        )
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
