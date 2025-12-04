import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyBar from '@/components/StickyBar';
import { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import GuideContent from '@/components/GuideContent';
import { getGuideData } from '@/lib/products';

export const metadata: Metadata = {
    title: 'Selection Guide | UrbanClay',
    description: 'Learn how to choose the right terracotta tiles and jaali panels for your project.',
};

export const revalidate = 60;

export default async function SelectionGuide() {
    const guideData = await getGuideData();

    return (
        <div className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <StickyBar />
            <Header />
            <div className="pt-20">
                <div className="relative bg-gradient-to-b from-[#E7ECEF] to-[#f4f1ee] py-24 px-4 text-center overflow-hidden">
                    {/* Subtle Background Wash */}
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--terracotta)]/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex justify-center">
                        <Breadcrumbs />
                    </div>
                    <h1 className="relative z-10 text-5xl md:text-7xl font-serif font-bold text-[#2A1E16] mb-8 tracking-tight">
                        Selection Guide
                    </h1>
                    <p className="relative z-10 text-xl md:text-2xl text-[#5d554f] max-w-3xl mx-auto font-light leading-relaxed">
                        Understanding the nuances of clay to make an informed decision.
                    </p>
                </div>
                <div className="bg-[#f4f1ee]">
                    <GuideContent data={guideData} />
                </div>
            </div>
            <Footer />
        </div>
    );
}
