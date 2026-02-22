import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
    title: 'Terracotta Tiles Exporter India | Global Shipping | UrbanClay®',
    description: 'Leading exporter of terracotta wall tiles, clay facades, and wirecut bricks from India. Serving USA, UK, UAE, and Australia with international shipping standards.',
    keywords: [
        'Terracotta Tiles Exporter India',
        'Clay Brick Export India',
        'Terracotta Jali Export',
        'Architectural Ceramics Exporter',
        'Buy Terracotta from India',
        'International Facade Shipping',
        'Clay Tiles Supplier UAE',
        'Terracotta Cladding Supplier UK'
    ],
    openGraph: {
        title: 'Terracotta Tiles & Facade Exporter | UrbanClay Global',
        description: 'Premium Indian clay products, engineered for the world. ASTM & EN certified. Global shipping available.',
        images: ['/images/export-hero.jpg'],
    }
};

export default function ExportPage() {
    return (
        <div className="bg-white min-h-screen text-[#2A1E16]">
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-[#2A1E16] text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block px-4 py-1.5 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                            UrbanClay® Global
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl leading-none mb-6">
                            From India <br /> <span className="text-[var(--terracotta)]">to the World.</span>
                        </h1>
                        <p className="text-xl text-white/60 font-light leading-relaxed mb-8 max-w-lg">
                            We export premium architectural terracotta to 12+ countries. ASTM certified quality, sea-worthy pallet packaging, and end-to-end logistics support.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a href="#inquiry" className="bg-white text-[#2A1E16] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
                                Get Export Quote
                            </a>
                            <a href="/catalogue/export-catalogue.pdf" className="border border-white/30 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                                Download Catalog
                            </a>
                        </div>
                    </div>
                    <div className="relative h-[500px] w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                        {/* World Map or Logistics Image Placeholder */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                            <svg className="w-32 h-32 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            <p className="uppercase tracking-widest text-xs font-bold">Global Logistics Network</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BADGES */}
            <section className="py-12 border-b border-gray-100 bg-[#FAF7F3]">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Logos for Certification */}
                    <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold text-xs text-black/50">ASTM Certified</div>
                    <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold text-xs text-black/50">ISO 9001:2015</div>
                    <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold text-xs text-black/50">CE Marking</div>
                    <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold text-xs text-black/50">Green Building</div>
                </div>
            </section>

            {/* CONTENT: WHY SOURCE FROM INDIA */}
            <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
                <div>
                    <h2 className="font-serif text-4xl mb-6">Why source Terracotta from India?</h2>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        India possesses some of the world's finest clay reserves. However, traditional manufacturing lacked precision.
                        UrbanClay bridges this gap by combining <strong>Indian raw material advantage</strong> with <strong>European vacuum-extrusion technology</strong>.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">✓</span>
                            <div>
                                <strong className="block text-sm uppercase tracking-wider mb-1">Cost Advantage</strong>
                                <p className="text-sm text-gray-500">30-40% more cost-effective than European alternatives (NBK/Moeding) without compromising technical specs.</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs">✓</span>
                            <div>
                                <strong className="block text-sm uppercase tracking-wider mb-1">Production Scale</strong>
                                <p className="text-sm text-gray-500">Capacity of 50,000 sq.ft per month ensures timely delivery for large commercial projects.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="bg-gray-100 rounded-2xl p-8">
                    <h3 className="font-serif text-2xl mb-6">Shipping & Logistics</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">🚢</div>
                            <div>
                                <h4 className="font-bold text-sm uppercase">FOB / CIF Terms</h4>
                                <p className="text-sm text-gray-500">We ship from Mundra / Nhava Sheva Ports. Flexible Incoterms available.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">📦</div>
                            <div>
                                <h4 className="font-bold text-sm uppercase">Export Packaging</h4>
                                <p className="text-sm text-gray-500">ISPM-15 Heat Treated Pallets with shrink wrap and edge protection.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">📄</div>
                            <div>
                                <h4 className="font-bold text-sm uppercase">Documentation provided</h4>
                                <p className="text-sm text-gray-500">Commercial Invoice, Packing List, BL, Certificate of Origin, Test Reports.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INQUIRY FORM */}
            <section id="inquiry" className="py-24 bg-[#FAF7F3]">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-4xl mb-4 text-[#2A1E16]">International Inquiry</h2>
                        <p className="text-gray-500">Direct channel to our Export Division.</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-xl">
                        {/* We reuse the QuoteForm but maybe pass a prop or context to indicate export? 
                            For now, reusing standard form is fine as it captures project details. 
                        */}
                        <QuoteForm />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
