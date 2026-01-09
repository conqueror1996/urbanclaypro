import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SocialShare from '@/components/SocialShare';
import JsonLd from '@/components/JsonLd';
import { SEO_KEYWORDS } from '@/lib/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "The Architect's Guide to Terracotta Cladding & Wirecut Bricks | UrbanClay",
    description: "A comprehensive handbook for architects on specifying architectural clay products. Detailed comparisons of cladding systems, wirecut vs handmade bricks, and passive cooling with jaalis.",
    keywords: [
        "Architectural Terracotta",
        "Clay Cladding Systems",
        "Wirecut Bricks India",
        "Terracotta Jaali Design",
        "Sustainable Facades",
        ...SEO_KEYWORDS
    ],
    openGraph: {
        title: "The Architect's Guide to Terracotta Cladding & Wirecut Bricks",
        description: "The definitive guide to specifying modern clay products for sustainable facades.",
        images: ['https://claytile.in/og-guide.jpg'],
        type: 'article',
        authors: ['UrbanClay'],
        publishedTime: '2024-01-15T00:00:00.000Z',
        modifiedTime: new Date().toISOString(),
    }
};

const guideJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: "The Architect's Guide to Terracotta Cladding & Wirecut Bricks",
    image: [
        "https://claytile.in/images/architect-guide-hero.png",
        "https://claytile.in/og-guide.jpg"
    ],
    author: {
        '@type': 'Organization',
        name: 'UrbanClay'
    },
    publisher: {
        '@type': 'Organization',
        name: 'UrbanClay',
        logo: {
            '@type': 'ImageObject',
            url: 'https://claytile.in/urbanclay-logo.png'
        }
    },
    datePublished: "2024-01-15T08:00:00+08:00",
    dateModified: new Date().toISOString(),
    description: "A comprehensive handbook for architects on specifying architectural clay products. Detailed comparisons of cladding systems, wall cladding bricks, wirecut vs handmade bricks.",
    articleBody: "In an era dominated by glass and steel, clay is making a sophisticated comeback...",
    about: [
        { '@type': 'Thing', name: 'Terracotta Cladding' },
        { '@type': 'Thing', name: 'Wirecut Bricks' },
        { '@type': 'Thing', name: 'Sustainable Architecture' }
    ]
};

export default function PillarPage() {
    return (
        <div className="bg-[#fcfbf9] min-h-screen text-[#2A1E16]">
            <JsonLd data={guideJsonLd} />
            <Header />

            {/* 1. Hero Section */}
            <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <span className="inline-block px-4 py-1.5 border border-[var(--terracotta)] text-[var(--terracotta)] text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-8">
                        The Architect's Handbook
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8">
                        Mastering <br /> <span className="text-[var(--terracotta)]">Architectural Clay.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl">
                        From high-performance generic cladding systems to the humble wirecut brick—everything you need to specify clay with confidence.
                    </p>
                </div>
            </header>

            {/* 2. Featured Image */}
            <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mb-24">
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl bg-[#EBE5E0]">
                    <Image
                        src="/images/architect-guide-hero.png"
                        alt="Architectural Terracotta Facade"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-white">
                        <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Section 01</p>
                        <h3 className="font-serif text-3xl md:text-5xl">The Material Renaissance</h3>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Container */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">

                {/* Sidebar: Table of Contents */}
                <aside className="lg:col-span-3 hidden lg:block">
                    <div className="sticky top-32 space-y-2 text-sm">
                        <p className="font-bold uppercase tracking-widest text-gray-400 mb-6">Contents</p>
                        <nav className="space-y-4 border-l-2 border-gray-100 pl-4">
                            <a href="#why-clay" className="block text-gray-500 hover:text-[var(--terracotta)] hover:pl-2 transition-all">1. Why Clay Returns</a>
                            <a href="#facade-systems" className="block text-gray-500 hover:text-[var(--terracotta)] hover:pl-2 transition-all">2. Facade Systems</a>
                            <a href="#brick-types" className="block text-gray-500 hover:text-[var(--terracotta)] hover:pl-2 transition-all">3. Wirecut vs Handmade</a>
                            <a href="#jaalis" className="block text-gray-500 hover:text-[var(--terracotta)] hover:pl-2 transition-all">4. Passive Cooling (Jaalis)</a>
                            <a href="#specification" className="block text-gray-500 hover:text-[var(--terracotta)] hover:pl-2 transition-all">5. Specification Data</a>
                        </nav>

                        <div className="pt-12">
                            <p className="font-bold uppercase tracking-widest text-gray-400 mb-4">Share</p>
                            <SocialShare
                                url="https://claytile.in/journal/architects-guide-terracotta-cladding-bricks"
                                title="The Architect's Guide to Architectural Clay"
                                image="https://claytile.in/og-guide.jpg"
                            />
                        </div>
                    </div>
                </aside>

                {/* Article Body */}
                <article className="lg:col-span-9 prose prose-lg prose-stone max-w-none">

                    {/* Section 1 */}
                    <section id="why-clay" className="mb-20">
                        <h2 className="font-serif text-4xl text-[#2A1E16] mb-8">1. Why the world is returning to Clay</h2>
                        <p className="text-xl text-gray-600 leading-relaxed font-light mb-6">
                            In an era dominated by glass and steel, clay is making a sophisticated comeback. It isn't just about nostalgia; it's about <strong className="text-[#2A1E16]">thermal performance</strong> and <strong className="text-[#2A1E16]">longevity</strong>. Unlike synthetic ACP sheets that fade or degrade in a decade, high-fired architectural terracotta lasts for centuries, aging gracefully with the building.
                        </p>
                        <div className="bg-[#FAF8F6] p-8 rounded-2xl border border-[#2A1E16]/5 my-8">
                            <h4 className="font-serif text-xl mb-4 text-[var(--terracotta)]">Key Benefits for Modern Architects:</h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex gap-3 items-center"><span className="w-2 h-2 bg-[var(--terracotta)] rounded-full" />High Thermal Mass (Reduces HVAC load)</li>
                                <li className="flex gap-3 items-center"><span className="w-2 h-2 bg-[var(--terracotta)] rounded-full" />Non-Combustible (Fire Rating A1)</li>
                                <li className="flex gap-3 items-center"><span className="w-2 h-2 bg-[var(--terracotta)] rounded-full" />Zero Maintenance (Self-cleaning)</li>
                                <li className="flex gap-3 items-center"><span className="w-2 h-2 bg-[var(--terracotta)] rounded-full" />Acoustic Insulation</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section id="facade-systems" className="mb-20">
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
                            <h2 className="font-serif text-4xl text-[#2A1E16] m-0">2. Dry Cladding vs Wet Cladding</h2>
                            <Link href="/products/clay-facade-panels" className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-widest hover:underline hidden md:block">
                                Browse Facade Panels →
                            </Link>
                        </div>
                        <p>
                            The modern application of terracotta has split into two distinct methodologies. Understanding which to specify can save your project budget and timeline.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <Image
                                        src="/images/dry-cladding-detail.png"
                                        alt="Ventilated Terracotta Facade Detail"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-serif text-2xl mb-2">Ventilated Facades (Dry)</h3>
                                    <p className="text-sm text-gray-500 mb-4">Best for: Commercial High-rises & Institutional</p>
                                    <p className="text-gray-600 mb-6">Uses an aluminum substructure. Creates an air gap that actively cools the building (Chimney effect).</p>
                                    <Link href="/products/clay-facade-panels" className="text-[var(--terracotta)] font-bold text-sm uppercase tracking-wide">Explore Systems</Link>
                                </div>
                            </div>

                            <div className="group relative rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <Image
                                        src="/images/wet-cladding-detail.png"
                                        alt="Adhesive Brick Cladding Detail"
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div className="p-8">
                                    <h3 className="font-serif text-2xl mb-2">Adhesive Cladding (Wet)</h3>
                                    <p className="text-sm text-gray-500 mb-4">Best for: Residential & Interiors</p>
                                    <p className="text-gray-600 mb-6">Direct application using high-strength adhesives. Thinner profiles (15-20mm) that look like full bricks.</p>
                                    <Link href="/products/brick-wall-tiles" className="text-[var(--terracotta)] font-bold text-sm uppercase tracking-wide">Explore Thin Bricks</Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section id="brick-types" className="mb-20">
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
                            <h2 className="font-serif text-4xl text-[#2A1E16] m-0">3. Wirecut vs Handmade Bricks</h2>
                            <Link href="/products/exposed-bricks" className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-widest hover:underline hidden md:block">
                                Compare Bricks →
                            </Link>
                        </div>
                        <p>
                            For exposed masonry, the texture is everything.
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse my-8 text-sm md:text-base">
                                <thead>
                                    <tr className="border-b-2 border-[#2A1E16]">
                                        <th className="py-4 font-serif text-xl">Feature</th>
                                        <th className="py-4 font-serif text-xl text-[var(--terracotta)]">Wirecut (Machine)</th>
                                        <th className="py-4 font-serif text-xl text-gray-600">Handmade (Manual)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 font-bold">Edges</td>
                                        <td className="py-4">Sharp, Precise, Clean</td>
                                        <td className="py-4">Soft, Rounded, Irregular</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 font-bold">Compressive Strength</td>
                                        <td className="py-4 text-green-700 font-bold">High (ideal for load bearing)</td>
                                        <td className="py-4 md:whitespace-nowrap">Moderate (fillers/aesthetic)</td>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <td className="py-4 font-bold">Aesthetic</td>
                                        <td className="py-4">Contemporary, Minimal</td>
                                        <td className="py-4">Rustic, Traditional, Wabi-sabi</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 font-bold">Price Point</td>
                                        <td className="py-4">$$</td>
                                        <td className="py-4">$$$ (Labor intensive)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section id="jaalis" className="mb-20">
                        <div className="flex items-end justify-between border-b border-gray-200 pb-4 mb-8">
                            <h2 className="font-serif text-4xl text-[#2A1E16] m-0">4. The Breathing Wall: Terracotta Jaalis</h2>
                            <Link href="/products/terracotta-jaali" className="text-[var(--terracotta)] text-sm font-bold uppercase tracking-widest hover:underline hidden md:block">
                                View Patterns →
                            </Link>
                        </div>
                        <p>
                            Jaalis (perforated blocks) utilize the <strong>Ventouri Effect</strong> to accelerate air velocity as it passes through small apertures, actively cooling the interior air.
                        </p>
                        <blockquote className="border-l-[6px] border-[var(--terracotta)] pl-8 py-4 my-10 bg-white shadow-sm italic text-xl font-serif text-gray-600">
                            "A Jaali is not just a screen; it is an air-conditioner that runs on zero electricity."
                        </blockquote>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 not-prose">
                            {/* Quick visual links to Jaalis features - Placeholders */}
                            <div className="aspect-square bg-[#f4f1ee] rounded-xl flex flex-col items-center justify-center p-4 text-center hover:bg-[#ebe6e0] transition-colors cursor-pointer">
                                <span className="font-serif text-2xl block mb-1">Camp</span>
                                <span className="text-xs uppercase text-gray-500">Pattern 01</span>
                            </div>
                            <div className="aspect-square bg-[#f4f1ee] rounded-xl flex flex-col items-center justify-center p-4 text-center hover:bg-[#ebe6e0] transition-colors cursor-pointer">
                                <span className="font-serif text-2xl block mb-1">Flower</span>
                                <span className="text-xs uppercase text-gray-500">Pattern 02</span>
                            </div>
                            <div className="aspect-square bg-[#f4f1ee] rounded-xl flex flex-col items-center justify-center p-4 text-center hover:bg-[#ebe6e0] transition-colors cursor-pointer">
                                <span className="font-serif text-2xl block mb-1">Dia</span>
                                <span className="text-xs uppercase text-gray-500">Pattern 03</span>
                            </div>
                            <div className="aspect-square bg-[var(--terracotta)] rounded-xl flex flex-col items-center justify-center p-4 text-center text-white cursor-pointer hover:bg-[#c25e3b] transition-colors">
                                <span className="font-serif text-lg block mb-1">View All</span>
                            </div>
                        </div>
                    </section>

                </article>
            </div>

            {/* 4. Bottom CTA - Conversion Focused */}
            <section className="bg-[#2A1E16] text-white py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6">Start your material selection.</h2>
                    <p className="text-white/60 text-xl mb-10 font-light max-w-2xl mx-auto">
                        Get our physical sample board delivered to your studio within 48 hours. Experience the texture before you specify.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/#quote" className="bg-white text-[#2A1E16] px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-100 transition-all">
                            Request Sample Box
                        </Link>
                        <Link href="/products" className="border border-white/20 px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                            Browse Catalogue
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
