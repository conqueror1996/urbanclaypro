import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import ArchitectsCorner from '@/components/ArchitectsCorner';
import ScrollReveal from '@/components/ScrollReveal';
import MaterialCalculator from '@/components/resources/MaterialCalculator';



export const metadata: Metadata = {
    title: 'Resources & Tools | UrbanClay',
    description: 'Calculators, installation guides, and technical documentation for architects and builders.',
};

import { getResources, getTextures } from '@/lib/products';

export default async function ResourcesPage() {
    const resources = await getResources();
    const textures = await getTextures();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Which adhesive do you recommend?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Kerakoll H14/H40 depending on substrate; see install guide.',
                },
            },
            {
                '@type': 'Question',
                name: 'Lead time & logistics?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Typically 7–10 days; Pan-India shipping with moisture-safe packing.',
                },
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[#1a1512] text-[#EBE5E0]">
            <JsonLd data={jsonLd} />
            <Header />

            {/* HERO SECTION */}
            <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1800px] mx-auto relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--terracotta)]/10 via-transparent to-transparent pointer-events-none" />

                <ScrollReveal>
                    <div className="max-w-4xl">
                        <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                            Technical Suite
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1]">
                            Resources <br /> <span className="opacity-50">&amp; Tools</span>
                        </h1>
                        <p className="text-white/60 max-w-xl text-lg md:text-xl font-light leading-relaxed">
                            A curated collection of digital tools, installation guides, and technical documentation to support your design process.
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* SECTION 1: MATERIAL CALCULATOR (New Feature) */}
            <ScrollReveal className="py-12 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <MaterialCalculator />
            </ScrollReveal>




            {/* SECTION 2: TECHNICAL DOWNLOADS */}
            <ScrollReveal className="py-24 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-3 block">Documentation</span>
                        <h2 className="text-3xl md:text-4xl font-serif text-white">Installation & Technical</h2>
                    </div>
                    {/* Link to the Digital Monograph Page we just built */}
                    <a href="/catalogue" target="_blank" className="px-6 py-3 border border-white/20 hover:border-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 text-white rounded-full text-xs font-bold uppercase tracking-widest transition-all">
                        View Digital Monograph 2025
                    </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render Real Sanity Resources */}
                    {resources.length > 0 ? (
                        resources.map((item) => (
                            <a
                                key={item._id}
                                href={item.url ? `${item.url}?dl=` : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group p-8 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent"
                            >
                                <div className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-white/40 group-hover:text-[var(--terracotta)] group-hover:bg-white/10 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[var(--terracotta)] transition-colors">{item.title}</h3>
                                    <p className="text-sm text-white/60 mb-6 line-clamp-2">{item.description}</p>
                                    <span className="text-[10px] font-mono text-white/30 border border-white/10 px-2 py-1 rounded uppercase">
                                        {item.type} {item.size ? `• ${item.size}` : ''}
                                    </span>
                                </div>
                            </a>
                        ))
                    ) : (
                        // Fallback/Empty State if nothing in Sanity yet
                        <div className="col-span-full py-12 text-center text-white/40 italic font-light">
                            No technical documents uploaded yet. Access the Digital Monograph above.
                        </div>
                    )}
                </div>
            </ScrollReveal>

            {/* SECTION 3: ARCHITECTS SECTION */}
            <div className="border-y border-white/5">
                <ArchitectsCorner />
            </div>

            {/* FAQ SECTION */}
            <ScrollReveal className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-3 block">Support</span>
                    <h2 className="text-3xl font-serif text-white">Common Questions</h2>
                </div>
                <div className="space-y-4">
                    {[
                        { q: "What is the recommended adhesive?", a: "For exterior cladding, we strictly recommend high-polymer modified thin-set adhesives like Kerakoll H40 or Laticrete 335. Standard cement mortar is not recommended for heights above 10ft." },
                        { q: "Do these bricks require sealing?", a: "While our high-fired clay is naturally resistant, we recommend a breathable siloxane-based water repellent for exterior facades to prevent efflorescence and staining in high-pollution areas." },
                        { q: "Can I order custom shapes?", a: "Yes, for projects exceeding 5,000 sq.ft, we can develop custom molds for corner pieces, sills, or unique jaali profiles. Lead time for custom dies is typically 4 weeks." },
                        { q: "What is the breakage policy?", a: "We account for 2-3% breakage in transit, which is industry standard. Any damage exceeding this during shipping is fully covered by our transit insurance and replaced immediately." }
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white/5 open:bg-white/10 p-6 rounded-2xl border border-white/5 cursor-pointer transition-colors hover:border-white/10">
                            <summary className="flex justify-between items-center font-medium list-none text-white/90">
                                {faq.q}
                                <span className="transform group-open:rotate-180 transition-transform text-[var(--terracotta)]">▼</span>
                            </summary>
                            <p className="mt-4 text-white/60 leading-relaxed font-light">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </ScrollReveal>

            <Footer />
        </main>
    );
}
