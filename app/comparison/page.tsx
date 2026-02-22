import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
    title: 'UrbanClay vs Conventional Clay | The Technical Edge',
    description: 'Compare UrbanClay industrial-grade terracotta systems against conventional clay products. See the difference in tolerance, firing temperature, and failure rates.',
};

export default function ComparisonPage() {
    return (
        <main className="min-h-screen bg-[var(--sand)] text-[var(--ink)]">
            <Header />

            <section className="pt-32 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <ScrollReveal>
                    <div className="text-center mb-16 md:mb-24">
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                            The Technical Edge
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6">
                            UrbanClay® vs. <br />Conventional Market
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-[#5d554f] leading-relaxed">
                            Why leading architects switch to industrial-grade systems. A transparent comparison of performance metrics that matter.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <ComparisonTable />
                </ScrollReveal>

                <div className="mt-16 text-center">
                    <p className="text-sm text-[var(--ink)]/50 italic">
                        *Data based on standard industry averages for local wirecut bricks vs. UrbanClay technical data sheets.
                    </p>
                </div>
            </section>

            <section className="bg-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif text-[#2A1E16] mb-8">Ready to eliminate site failures?</h2>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="/products" className="btn-terracotta">
                            Explore High-Performance Systems
                        </a>
                        <a href="/contact" className="px-8 py-4 rounded-full border border-[var(--ink)]/10 hover:bg-[var(--sand)] transition-colors text-[var(--ink)] font-medium">
                            Request Technical Data Sheets
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
