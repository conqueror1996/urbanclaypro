import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import Tools from '@/components/Tools';
import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ArchitectsCorner from '@/components/ArchitectsCorner';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
    title: 'Resources & Tools | UrbanClay',
    description: 'Calculators, installation guides, and technical downloads for architects and builders.',
};

export default function ResourcesPage() {
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
            {
                '@type': 'Question',
                name: 'Recoating & maintenance?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Water-repellent coat every 8–10 years, mild detergent cleaning.',
                },
            },
        ],
    };

    return (
        <main className="min-h-screen bg-[var(--sand)] pt-24 pb-20">
            <JsonLd data={jsonLd} />

            <Header />

            {/* HEADER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <ScrollReveal>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#2A1E16] mb-4">Resources & Tools</h1>
                    <p className="text-[#5d554f] max-w-2xl text-lg">
                        Everything you need to plan, specify, and install UrbanClay products.
                        From coverage calculators to detailed method statements.
                    </p>
                </ScrollReveal>
            </div>

            {/* TOOLS SECTION */}
            <ScrollReveal className="py-10 border-y border-[var(--line)] bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-2 block">Plan Your Project</span>
                    <h2 className="text-2xl font-semibold text-[#2A1E16]">Tools & Calculators</h2>
                </div>
                <Tools />
            </ScrollReveal>

            {/* INSTALLATION GUIDES SECTION */}
            <ScrollReveal className="py-16 bg-[var(--sand)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-2 block">Technical Support</span>
                    <h2 className="text-3xl font-serif text-[#2A1E16] mb-10">Installation Guides</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Guide 1: Brick Cladding */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--line)] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-[#f4f1ee] rounded-xl flex items-center justify-center text-[var(--terracotta)] mb-6 group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">Brick Cladding</h3>
                            <p className="text-sm text-[#5d554f] mb-6 leading-relaxed">
                                Comprehensive guide for installing wirecut and antique brick tiles on various substrates.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Surface Preparation
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Adhesive Selection
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Grouting Techniques
                                </li>
                            </ul>
                            <a href="/downloads/guide-brick-cladding.pdf" className="w-full py-3 rounded-lg border border-[var(--line)] text-[#2A1E16] font-medium hover:bg-[#2A1E16] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </a>
                        </div>

                        {/* Guide 2: Terracotta Jaali */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--line)] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-[#f4f1ee] rounded-xl flex items-center justify-center text-[var(--terracotta)] mb-6 group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">Terracotta Jaali</h3>
                            <p className="text-sm text-[#5d554f] mb-6 leading-relaxed">
                                Structural and aesthetic installation methods for Camp and Four-Petal jaali blocks.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Metal Framing
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Mortar Mix Ratio
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Vertical Stacking
                                </li>
                            </ul>
                            <a href="/downloads/guide-jaali-installation.pdf" className="w-full py-3 rounded-lg border border-[var(--line)] text-[#2A1E16] font-medium hover:bg-[#2A1E16] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </a>
                        </div>

                        {/* Guide 3: Facade Panels */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--line)] hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-[#f4f1ee] rounded-xl flex items-center justify-center text-[var(--terracotta)] mb-6 group-hover:bg-[var(--terracotta)] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#2A1E16] mb-3">Ventilated Facades</h3>
                            <p className="text-sm text-[#5d554f] mb-6 leading-relaxed">
                                Dry-cladding systems for large-format terracotta panels using aluminum clips.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Sub-structure Layout
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Clip Fixing Details
                                </li>
                                <li className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Corner Treatments
                                </li>
                            </ul>
                            <a href="/downloads/guide-facade-systems.pdf" className="w-full py-3 rounded-lg border border-[var(--line)] text-[#2A1E16] font-medium hover:bg-[#2A1E16] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download PDF
                            </a>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* DOWNLOADS SECTION */}
            <ScrollReveal className="py-16 bg-white border-y border-[var(--line)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-semibold text-[#2A1E16] mb-8">General Downloads</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Product Brochure 2024', type: 'PDF', size: '12 MB', href: '/downloads/brochure.pdf' },
                            { title: 'Technical Data Sheets', type: 'PDF', size: '4 MB', href: '/downloads/tds.pdf' },
                            { title: 'Installation Guide', type: 'PDF', size: '2.5 MB', href: '/downloads/install-guide.pdf' },
                            { title: 'Maintenance Manual', type: 'PDF', size: '1.8 MB', href: '/downloads/maintenance.pdf' },
                            { title: 'Warranty Information', type: 'PDF', size: '0.5 MB', href: '/downloads/warranty.pdf' },
                            { title: 'Sustainability Report', type: 'PDF', size: '5 MB', href: '/downloads/sustainability.pdf' },
                        ].map((item, i) => (
                            <a
                                key={i}
                                href={item.href}
                                download
                                className="group p-6 rounded-xl border border-[var(--line)] hover:border-[var(--terracotta)] transition-colors cursor-pointer bg-[var(--sand)]/20 block"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white rounded-lg shadow-sm text-[var(--terracotta)]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </div>
                                    <span className="text-xs font-medium text-[#5d554f] bg-white px-2 py-1 rounded border border-[var(--line)]">
                                        {item.type} • {item.size}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-lg group-hover:text-[var(--terracotta)] transition-colors">{item.title}</h3>
                                <p className="text-sm text-[#5d554f] mt-2">Download for offline reference.</p>
                            </a>
                        ))}
                    </div>
                </div>
            </ScrollReveal>

            {/* ARCHITECT'S CORNER */}
            <ArchitectsCorner />

            {/* FAQ SECTION */}
            <ScrollReveal className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-semibold text-[#2A1E16] text-center mb-10">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: "What is the lead time for large orders?", a: "Standard lead time is 7-10 days for in-stock items. Custom orders or large quantities (>5000 sq.ft) may require 3-4 weeks." },
                        { q: "Do you ship pan-India?", a: "Yes, we have a robust logistics network covering all major cities and remote locations across India. All shipments are insured." },
                        { q: "Can I use these products for exterior cladding?", a: "Absolutely. Our clay products are fired at high temperatures (>1100°C), making them weather-resistant, frost-proof, and color-fast for decades." },
                        { q: "How do I maintain exposed brick walls?", a: "We recommend applying a clear, breathable water-repellent coat every 5-8 years. Regular cleaning can be done with mild soap and water." },
                        { q: "Do you provide installation services?", a: "We supply the material and can recommend certified installers in major cities. We also provide detailed installation guides for your contractor." }
                    ].map((faq, i) => (
                        <details key={i} className="group bg-white p-6 rounded-xl border border-[var(--line)] cursor-pointer">
                            <summary className="flex justify-between items-center font-medium list-none">
                                {faq.q}
                                <span className="transform group-open:rotate-180 transition-transform text-[var(--terracotta)]">▼</span>
                            </summary>
                            <p className="mt-4 text-[#5d554f] leading-relaxed">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </ScrollReveal>

            <Footer />
        </main>
    );
}
