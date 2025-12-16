import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogGrid from '@/components/journal/BlogGrid';
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

export default function JournalPage() {
    return (
        <div className="bg-[#FAF7F3] min-h-screen">
            <Header />
            <div className="pt-24 pb-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-block px-4 py-1 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-xs font-bold uppercase tracking-widest mb-6">
                        Resources & Inspiration
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl text-[#2A1E16] mb-6">
                        The Clay Journal
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-500 text-lg">
                        Deep dives into the world of sustainable materials, modern craftsmanship, and better building practices for the Indian sub-continent.
                    </p>
                </div>
            </div>
            <BlogGrid />
            <Footer />
        </div>
    );
}
