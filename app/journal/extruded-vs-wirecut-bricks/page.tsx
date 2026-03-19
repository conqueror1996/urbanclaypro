import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SEO_KEYWORDS } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Extruded vs Wirecut vs Handmade Bricks | The Architect's Specification Guide",
    description: "Understand the technical difference between extruded (wirecut) bricks and handmade bricks. Compare compressive strength, water absorption, and cost for Indian projects.",
    keywords: [
        "Extruded bricks India",
        "Wirecut vs Handmade bricks",
        "Brick manufacturing process",
        "High strength clay bricks",
        "Exposed brick cost comparison",
        ...SEO_KEYWORDS
    ],
    openGraph: {
        title: "Extruded vs Wirecut vs Handmade Bricks",
        description: "Which brick should you specify? A technical breakdown of manufacturing and performance.",
        type: 'article',
        authors: ['UrbanClay Technical Team'],
        publishedTime: new Date().toISOString(),
    }
};

const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: "Extruded vs Wirecut vs Handmade: The Definitive Comparison",
    image: [
        "https://claytile.in/images/brick-types-hero.jpg" // Placeholder
    ],
    author: {
        '@type': 'Organization',
        name: 'UrbanClay'
    },
    publisher: {
        '@type': 'Organization',
        name: 'UrbanClay'
    },
    datePublished: new Date().toISOString(),
    description: "Technical comparison of clay brick manufacturing methods and their impact on facade longevity.",
    articleBody: "When specifying exposed masonry, the term 'Wirecut' is often used interchangeably with 'Extruded', but what does it mean for your building's lifespan?...",
};

export default function ExtrudedVsWirecutPage() {
    return (
        <div className="bg-[#fcfbf9] min-h-screen text-[#2A1E16]">
            <JsonLd data={articleJsonLd} />
            <Header />

            {/* 1. Hero Section */}
            <header className="pt-32 pb-16 px-6 max-w-4xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 border border-[#2A1E16]/20 text-[#2A1E16]/60 text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                    Specification Guide
                </span>
                <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-8">
                    Extruded vs. Handmade. <br /> <span className="italic text-gray-600">What are you really buying?</span>
                </h1>
                <p className="text-xl text-gray-500 font-light leading-relaxed">
                    The method of shaping clay determines 90% of a brick's technical properties.
                    <br className="hidden md:block" />
                    Here is why modern architects are shifting to vacuum-extrusion.
                </p>
            </header>

            {/* 2. Main Content */}
            <article className="max-w-4xl mx-auto px-6 mb-32">

                {/* Comparison Visual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-serif text-2xl mb-2 text-[var(--terracotta)]">01. The Extruded (Wirecut) Process</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            <strong>Mechanism:</strong> Low-moisture clay is pushed through a steel die under high vacuum pressure (de-airing). A wire cutter slices the continuous column into bricks.
                        </p>
                        <ul className="text-sm space-y-2 text-gray-500">
                            <li>• <strong>Density:</strong> Extremely High (&gt; 2.2 g/cc)</li>
                            <li>• <strong>Pores:</strong> Closed structure (Low absorption)</li>
                            <li>• <strong>Edges:</strong> Sharp, precise, mechanical</li>
                            <li>• <strong>Use:</strong> High-rise facades, Load bearing</li>
                        </ul>
                    </div>

                    <div className="bg-[#FAF7F3] p-8 rounded-2xl border border-gray-100">
                        <h3 className="font-serif text-2xl mb-2 text-[#2A1E16]">02. The Handmade Process</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            <strong>Mechanism:</strong> Soft, wet clay is thrown by hand into a wooden mold. Sand acts as a release agent.
                        </p>
                        <ul className="text-sm space-y-2 text-gray-500">
                            <li>• <strong>Density:</strong> Low to Moderate</li>
                            <li>• <strong>Pores:</strong> Open structure (High absorption)</li>
                            <li>• <strong>Edges:</strong> Soft, crumpled, "smiling"</li>
                            <li>• <strong>Use:</strong> Restoration, Rustic interiors, Garden walls</li>
                        </ul>
                    </div>
                </div>

                <div className="prose prose-lg prose-stone max-w-none">
                    <h2 className="font-serif text-3xl text-[#2A1E16]">Why "Wirecut" implies quality</h2>
                    <p>
                        The term "Wirecut" is actually a byproduct of the <strong>Extrusion</strong> process.
                        Because the clay column is so stiff and dense coming out of the machine, it cannot be cut by a knife.
                        It requires a high-tension steel wire to slice through it—hence the name.
                    </p>
                    <p>
                        This density is the secret. By removing air pockets (vacuum de-airing), extruded bricks achieve compressive strengths
                        of <strong>35 N/mm² to 80 N/mm²</strong>. Compare this to handmade bricks which hover around 5-15 N/mm².
                    </p>

                    <h3 className="font-serif text-2xl text-[#2A1E16] mt-10">The Cost-Benefit Paradox</h3>
                    <p>
                        Counter-intuitively, <strong>Extruded bricks are often cheaper</strong> than genuine Handmade bricks.
                        Automation allows mainly manufacturers (like us) to produce millions of units with consistent firing.
                        Handmade bricks require skilled artisans and slow drying times, driving up labor costs.
                    </p>
                    <p>
                        <strong>The Verdict:</strong> Unless you are restoring a 100-year-old heritage structure that demands a specific
                        rustic imperfection, Extruded (Wirecut) bricks offer superior technical performance at a better price point.
                    </p>
                </div>

                <div className="my-12 p-8 bg-[var(--sand)] rounded-2xl not-prose flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="font-serif text-2xl mb-2 text-[#2A1E16]">Explore our Wirecut Range</h3>
                        <p className="text-[var(--ink)]/60 text-sm">
                            Available in 8 colors and 3 textures.
                        </p>
                    </div>
                    <Link href="/products/exposed-bricks" className="bg-[#2A1E16] text-white px-6 py-3 rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-black transition-all whitespace-nowrap">
                        View Products
                    </Link>
                </div>

            </article>

            <Footer />
        </div>
    );
}
