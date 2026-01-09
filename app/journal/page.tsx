
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JournalLayout from '@/components/journal/JournalLayout';
import { getJournalPosts } from '@/lib/journal';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Clay Journal | Architectural Insights by UrbanClay',
    description: 'Expert guides on sustainable architecture, exposed brick construction, facade design trends, and passive cooling techniques for Indian homes.',
    keywords: ['architecture blog india', 'exposed brick guide', 'sustainable construction blog', 'facade design trends'],
    openGraph: {
        title: 'The Clay Journal | UrbanClay',
        description: 'Read our latest insights on modern masonry and sustainable design.',
        url: 'https://claytile.in/journal',
        type: 'website',
    }
};

export default async function JournalPage() {
    // Fetch all posts, sorted by date (newest first)
    const allPosts = await getJournalPosts();

    // Split into Featured (1st) and Grid (Rest)
    const featured = allPosts.length > 0 ? allPosts[0] : null;
    const gridPosts = allPosts.length > 0 ? allPosts.slice(1) : [];

    return (
        <div className="bg-[#FAF7F3] min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-32 md:pt-40">
                {/* Visual Header */}
                <div className="text-center mb-16 px-4 fade-in-up">
                    <span className="inline-block px-4 py-1 mb-6 border-b border-[var(--terracotta)] text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-[0.25em]">
                        The Clay Journal
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#2A1E16] mb-6 tracking-tight">
                        Material & Context
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-light leading-relaxed">
                        A curated dialogue on sustainable masonry, facade engineering, and the future of Indian architecture.
                    </p>
                </div>

                {/* Spotlight Guide */}
                <div className="max-w-[1600px] mx-auto px-4 md:px-12 mb-20 fade-in-up delay-100">
                    <Link href="/journal/architects-guide-terracotta-cladding-bricks" className="group block relative rounded-2xl overflow-hidden bg-[#2A1E16] text-white aspect-[21/9] md:aspect-[2.5/1]">
                        <div className="absolute inset-0 opacity-60 mix-blend-overlay">
                            {/* Use a high-res pattern or generic texture if exact image not available */}
                            <img src="/images/wirecut-texture.jpg" alt="" className="w-full h-full object-cover grayscale transition-transform duration-[1.5s] group-hover:scale-105" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2A1E16] via-[#2A1E16]/80 to-transparent"></div>

                        <div className="relative h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl">
                            <span className="inline-block px-3 py-1 border border-white/30 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6 w-fit">
                                The 2026 Handbook
                            </span>
                            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-none mb-6 group-hover:text-[#ff9d76] transition-colors duration-500">
                                The Architect's Guide to <br /> Clay & Cladding.
                            </h2>
                            <p className="text-lg md:text-xl text-white/60 font-light mb-10 max-w-xl leading-relaxed">
                                A definitive resource on specifying wirecut bricks, ventilated facades, and jaalis for sustainable modern architecture.
                            </p>
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                <span className="w-10 h-10 rounded-full bg-white text-[#2a1e16] flex items-center justify-center">→</span>
                                <span>Read the Guide</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Content Layout */}
                <JournalLayout featured={featured} posts={gridPosts} />
            </main>

            <Footer />
        </div>
    );
}
