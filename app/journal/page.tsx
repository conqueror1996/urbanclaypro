
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
        url: 'https://urbanclay.in/journal',
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

                {/* Content Layout */}
                <JournalLayout featured={featured} posts={gridPosts} />
            </main>

            <Footer />
        </div>
    );
}
