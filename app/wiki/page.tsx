
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

import WikiHubClient from '@/components/WikiHubClient';

export default async function WikiHub() {
    const { articles } = await getWikiData();
    const categories = ['installation', 'technical', 'maintenance', 'science', 'history'];

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Header />
            <main className="pt-32 pb-20">
                <WikiHubClient initialArticles={articles} categories={categories} />
            </main>
            <Footer />
        </div>
    );
}
