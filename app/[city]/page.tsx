
import { Metadata } from 'next';
import { SEO_KEYWORDS } from '@/lib/constants';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { regions } from '@/lib/locations';

import { truncate } from '@/lib/seo-utils';
import Breadcrumbs from '@/components/Breadcrumbs';

// Revalidate every hour
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
    const cities = await client.fetch(`*[_type == "cityPage"]{ "city": slug.current }`);
    return cities;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city } = await params;

    const data = await client.fetch(`
        *[_type == "cityPage" && slug.current == $city][0]{
            name,
            metaTitle,
            metaDescription,
            "slug": slug.current,
            region
        }
    `, { city });

    if (!data) return { title: 'City Not Found' };

    // Boss SEO Template: [Category Hub] in [City] | Premium Terracotta | UrbanClay
    const title = data.metaTitle || `Premium Terracotta Tiles & Facades in ${data.name} | UrbanClay ${data.region || ''}`;
    const description = truncate(data.metaDescription || `Discover architectural-grade terracotta tiles, flexible brick cladding, and jali panels in ${data.name}. Engineered for the ${data.region || ''} Indian climate. Pan-India delivery.`, 155);

    const cityKeywords = [
        `Terracotta Tiles ${data.name}`,
        `Brick Cladding Tiles ${data.name}`,
        `Flexible Brick Veneers ${data.name}`,
        `Terracotta Facade Panels ${data.name}`,
        `Exposed Bricks ${data.name}`,
        `Clay Jali Blocks ${data.name}`,
        `Best Tiles for ${data.name} Climate`
    ];

    return {
        title: title,
        description: description,
        keywords: [...cityKeywords, ...SEO_KEYWORDS],
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            url: `https://claytile.in/${data.slug}`,
            images: ['/og-image.png'],
        },
        alternates: {
            canonical: `https://claytile.in/${data.slug}`
        }
    };
}

import LeadCapture from '@/components/LeadCapture';
import { KNOWLEDGE_BASE } from '@/lib/knowledge-base';

export default async function CityPage({ params }: PageProps) {
    const { city } = await params;

    const query = `*[_type == "cityPage" && slug.current == $city][0]{
        name,
        "slug": slug.current,
        region,
        heroTitle,
        heroSubtitle,
        richContent,
        climateAdvice,
        weatherContext,
        deliveryTime,
        areasServed,
        popularProducts,
        faq,
        localImages
    }`;

    const data = await client.fetch(query, { city });

    if (!data) notFound();

    // Default values if fields are missing in Sanity (for safety)
    const areas = data.areasServed || [];
    const products = data.popularProducts || [];
    const delivery = data.deliveryTime || '2-4 days';
    const weather = data.weatherContext || 'Tropical';
    const regionCities = regions[data.region as keyof typeof regions] || [];

    // Relevant knowledge items based on common local concerns (e.g. efflorescence or cooling)
    const relevantKnowledge = Object.values(KNOWLEDGE_BASE).slice(0, 3);

    // 1. Local Business Schema (Existing logic remains but we can enhance it...)
    const localBusinessJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': `UrbanClay ${data.name}`,
        'image': 'https://claytile.in/og-image.png',
        '@id': `https://claytile.in/${data.slug}`,
        'url': `https://claytile.in/${data.slug}`,
        'telephone': '+918080081951',
        'priceRange': '₹₹',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': `UrbanClay Service Region: ${data.name}`,
            'addressLocality': data.name,
            'addressRegion': data.region,
            'addressCountry': 'IN'
        },
        'geo': {
            '@type': 'GeoCoordinates',
            'latitude': '20.5937', 
            'longitude': '78.9629'
        },
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '09:00',
            'closes': '19:00'
        },
        'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.9',
            'reviewCount': '156',
            'bestRating': '5',
            'worstRating': '1'
        },
        'areaServed': areas.map((area: string) => ({
            '@type': 'Place',
            'name': area
        }))
    };

    // 2. Breadcrumb Schema
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://claytile.in'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': `Review: ${data.name}`,
                'item': `https://claytile.in/${data.slug}`
            }
        ]
    };

    // 3. FAQ Schema (Enhanced)
    const allFaqs = [
        ...(data.faq || []).map((f: any) => ({ q: f.question, a: f.answer })),
        { q: "What is the local delivery time?", a: `For most areas in ${data.name}, delivery takes ${delivery}. We deliver to all major areas including ${areas.slice(0, 4).join(', ')}.` },
        { q: `Are terracotta tiles suitable for ${data.name}'s climate?`, a: `Absolutely. ${data.climateAdvice}` }
    ];

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': allFaqs.map((faq: any) => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.a
            }
        }))
    };

    return (
        <div className="min-h-screen bg-white">
            <JsonLd data={[localBusinessJsonLd, breadcrumbJsonLd, faqJsonLd]} />
            <Header />

            <main className="pt-32 pb-20">
                {/* Dynamic Hero */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Breadcrumbs items={[{ name: data.name, href: `/${data.slug}` }]} />
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 mb-8 border border-[var(--terracotta)] text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full bg-[var(--terracotta)]/5">
                            Serving {data.region} India
                        </span>
                        <h1 className="text-4xl md:text-7xl font-serif text-[#2A1E16] mb-8 leading-tight tracking-tight">
                            {data.heroTitle} <span className="text-[var(--terracotta)] italic">{data.name}</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
                            {data.heroSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        <div className="group text-center p-8 bg-[var(--sand)]/5 rounded-3xl border border-[#e5e0d8] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🌡️</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Climate Optimized</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">{data.climateAdvice}</p>
                        </div>
                        <div className="group text-center p-8 bg-[var(--sand)]/5 rounded-3xl border border-[#e5e0d8] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🚚</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Local Delivery</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                Fast transit to {data.name} in <strong>{delivery}</strong>.
                            </p>
                        </div>
                        <div className="group text-center p-8 bg-[var(--sand)]/5 rounded-3xl border border-[#e5e0d8] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">🏗️</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Firm Support</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">On-site technical support for {data.name} architectural firms.</p>
                        </div>
                        <div className="group text-center p-8 bg-[var(--sand)]/5 rounded-3xl border border-[#e5e0d8] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">💎</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Kiln-Fired Quality</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Authentic terracotta, high-fired for lifetime durability.</p>
                        </div>
                    </div>

                    {/* LEAD CONVERSION BLOCK - HIGH PRIORITY */}
                    <div className="max-w-4xl mx-auto mb-24">
                        <LeadCapture city={data.name} title={`Get Architectural Prices in ${data.name}`} />
                    </div>
                </section>

                {/* Authority Content: Semantic Knowledge Links */}
                <section className="bg-[#2A1E16] py-24 text-white overflow-hidden relative">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--terracotta)]/40 to-transparent"></div>
                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-5 gap-12 items-center">
                            <div className="lg:col-span-2">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--terracotta)] font-bold mb-4 block">Architectural Intelligence</span>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">Technical Data for {data.name} Architects</h2>
                                <p className="text-white/60 mb-8 font-light leading-relaxed">
                                    Our materials are engineered using advanced thermodynamics. Explore why terracotta is the most sustainable choice for {data.name}'s specific weather context.
                                </p>
                            </div>
                            <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
                                {relevantKnowledge.map((k, i) => (
                                    <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-help group">
                                        <h4 className="font-serif text-xl mb-3 text-[var(--terracotta)]">{k.term}</h4>
                                        <p className="text-xs text-white/50 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                                            {k.technicalDetail}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                   </div>
                </section>

                {/* Popular Products for City (Visual Collection) */}
                <section className="bg-[#faf7f5] py-24 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-serif text-[#2A1E16] mb-4">
                                    Curated in <span className="italic">{data.name}</span>
                                </h2>
                                <p className="text-gray-500 font-light">The most requested terracotta textures and profiles currently trending in {data.name} residential projects.</p>
                            </div>
                            <Link href="/products" className="text-[var(--terracotta)] font-bold uppercase tracking-widest text-xs border-b border-[var(--terracotta)]/30 pb-2 hover:border-[var(--terracotta)] transition-colors">
                                Browse All Collections →
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {[
                                { title: 'Exposed Bricks', cat: 'Exposed Brick', img: '/images/products/wirecut-texture.jpg' },
                                { title: 'Ventilation Jaalis', cat: 'Jaali', img: '/images/premium-terracotta-facade.png' },
                                { title: 'Facade Systems', cat: 'Facade Panel', img: '/images/products/pressed-texture.jpg' }
                            ].map((p, idx) => (
                                <Link key={idx} href={`/products?category=${p.cat}`} className="group">
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-200/50 flex flex-col h-full">
                                        <div className="h-72 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                                            <img
                                                src={p.img}
                                                alt={`${p.title} ${data.name}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute bottom-6 left-6 z-20">
                                                <h3 className="text-2xl font-serif text-white mb-1">{p.title}</h3>
                                                <div className="flex items-center text-white/70 text-[10px] uppercase tracking-widest font-bold">
                                                    Best Seller in {data.name}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 flex-grow">
                                            <p className="text-gray-500 text-sm mb-6 leading-relaxed font-light">
                                                Engineered for {data.name}'s {weather.toLowerCase()} climate with zero efflorescence.
                                            </p>
                                            <div className="flex items-center text-[var(--terracotta)] font-bold tracking-widest text-[10px] uppercase">
                                                Explore Specifications <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Block (Deep Local SEO) */}
                <section className="py-24 max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Direct Support</span>
                        <h2 className="text-4xl font-serif text-[#2A1E16]">Frequently Asked Questions</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {allFaqs.map((faq, i) => (
                            <div key={i} className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-serif text-[#2A1E16] mb-4">{faq.q}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-light">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Keyword Anchors (Local Authority) */}
                <section className="bg-gray-50 py-20 border-y border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-[#2A1E16]/40 mb-12">Authorized Logistics to all areas in {data.name}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {areas.map((area: string) => (
                                <span key={area} className="text-xs font-medium text-gray-500 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm hover:text-[var(--terracotta)] transition-colors cursor-default">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Hyper-Local Nearby Links (Pillar Pages) */}
                <section className="py-20 max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 italic">Browse Other {data.region} Hubs</p>
                    <div className="flex justify-center flex-wrap gap-x-8 gap-y-4">
                        {regionCities
                            .filter((c: string) => c !== data.slug)
                            .map((citySlug: string) => (
                                <Link key={citySlug} href={`/${citySlug}`} className="text-sm font-serif text-[#2A1E16] hover:text-[var(--terracotta)] transition-colors capitalize underline decoration-[var(--terracotta)]/20 underline-offset-8">
                                    {citySlug}
                                </Link>
                            ))}
                    </div>
                </section>

                {/* Final Intent CTA */}
                <section className="bg-[#2A1E16] text-white py-32 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--terracotta)]/5 rounded-full blur-[120px]"></div>
                    <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                        <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Elevate your {data.name} project with architectural clay.</h2>
                        <p className="text-lg md:text-xl mb-12 text-white/50 font-light leading-relaxed max-w-2xl mx-auto">
                            Trusted by luxury architectural firms across {data.name}. Get a technical consultation and physical sample box within 48 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="#lead-form"
                                className="px-12 py-6 bg-[var(--terracotta)] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#a85638] transition-all shadow-2xl hover:scale-105 active:scale-95"
                            >
                                Request Sample Box
                            </Link>
                            <Link
                                href="/products"
                                className="px-12 py-6 border border-white/20 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                View PDF Catalog
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
