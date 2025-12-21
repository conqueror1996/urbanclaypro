
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

            <main className="flex-grow pt-28">
                {/* Visual Header */}
                <div className="text-center mb-10 px-4">
                    <span className="inline-block px-3 py-1 mb-4 border border-[var(--terracotta)]/20 text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                        Thought Leadership
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-[#2A1E16] mb-4">
                        The Clay Journal
                    </h1>
                    <p className="max-w-xl mx-auto text-gray-400 text-sm md:text-base font-light">
                        Curated stories on sustainable living, architectural innovation, and the timeless beauty of terracotta.
                    </p>
                </div>

                {/* Content Layout */}
                <JournalLayout featured={featured} posts={gridPosts} />
            </main>

            <Footer />
        </div>
    );
}
