import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteForm from '@/components/QuoteForm';

export const metadata: Metadata = {
    title: 'Commercial Cladding & Bulk Brick Supplier | UrbanClay B2B',
    description: 'Direct-from-factory pricing for large scale commercial projects. Supply of terracotta facades, parking tiles, and brick cladding for developers and contractors.',
    keywords: [
        'Bulk Brick Supplier India',
        'Commercial Facade Cladding',
        'Wholesale Terracotta Tiles',
        'Project Supplies Construction',
        'Builder Floor Tiles Wholesale',
        'Institutional Architecture Materials'
    ],
    openGraph: {
        title: 'Commercial & Institutional Supply | UrbanClay B2B',
        description: 'Volume pricing and technical support for large-scale developments.',
        images: ['/images/commercial-hero.jpg'], // Placeholder
    }
};

export default function CommercialPage() {
    return (
        <div className="bg-white min-h-screen text-[#2A1E16]">
            <Header />

            {/* HERO */}
            <section className="pt-32 pb-20 px-6 bg-[#f4f4f4] border-b border-gray-200">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold uppercase tracking-widest text-xs mb-4 block">
                            UrbanClay® B2B
                        </span>
                        <h1 className="font-serif text-5xl md:text-6xl text-[#2A1E16] mb-6 leading-tight">
                            Scale your vision. <br /> optimize your costs.
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 max-w-md font-light">
                            Dedicated support for Developers, Contractors, and Institutional Projects.
                            Direct-factory pricing on volume orders &gt; 5,000 sq.ft.
                        </p>
                        <div className="flex gap-4">
                            <a href="#partner" className="bg-[#2A1E16] text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-black transition-all">
                                Partner with us
                            </a>
                            <a href="/products" className="bg-white border border-gray-300 text-[#2A1E16] px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-all">
                                View Catalogue
                            </a>
                        </div>
                    </div>
                    <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-gray-300">
                        {/* Placeholder for High-Rise Building Image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
                            Commercial High-Rise Showcase
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUE PROPS */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all">
                        <h3 className="font-serif text-2xl mb-4">Volume Discounts</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Tiered pricing structure for residential townships, commercial complexes, and institutional campuses. Get up to 25% off on bulk commitments.
                        </p>
                    </div>
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all">
                        <h3 className="font-serif text-2xl mb-4">Technical Supervision</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Our site engineers visit your project ensuring correct dry-cladding installation or wet-fixing methodology, reducing wastage.
                        </p>
                    </div>
                    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-lg transition-all">
                        <h3 className="font-serif text-2xl mb-4">Custom Production</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Need a specific size or a custom color match for branding? We can modify our extrusion dies for orders exceeding 10,000 sq.ft.
                        </p>
                    </div>
                </div>
            </section>

            {/* SEGMENTS */}
            <section className="py-20 bg-[#2A1E16] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-serif mb-12 text-center">Industry Solutions</h2>
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold uppercase tracking-wider mb-2">Hospitality</h4>
                            <p className="text-xs text-white/50">Hotels & Resorts</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold uppercase tracking-wider mb-2">Healthcare</h4>
                            <p className="text-xs text-white/50">Hospitals & Clinics</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold uppercase tracking-wider mb-2">Education</h4>
                            <p className="text-xs text-white/50">University Campuses</p>
                        </div>
                        <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                            <h4 className="font-bold uppercase tracking-wider mb-2">Residential</h4>
                            <p className="text-xs text-white/50">High-Rise Townships</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT FORM */}
            <section id="partner" className="py-24 max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif text-[#2A1E16] mb-4">Project Inquiry</h2>
                    <p className="text-gray-500">Submit your BOQ or Requirements.</p>
                </div>
                <QuoteForm isEmbedded={true} />
            </section>

            <Footer />
        </div>
    );
}
