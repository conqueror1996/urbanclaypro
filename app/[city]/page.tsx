
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
            "slug": slug.current
        }
    `, { city });

    if (!data) return { title: 'City Not Found' };

    const title = data.metaTitle || `UrbanClay ${data.name} | Premium Terracotta Tiles & Facades`;
    const description = truncate(data.metaDescription || `Discover premium terracotta tiles, brick cladding, and jaali panels in ${data.name}. Pan-India delivery and architect-preferred quality.`, 155);

    const cityKeywords = [
        `Terracotta Tiles ${data.name}`,
        `Wirecut Bricks ${data.name}`,
        `Clay Facade ${data.name}`,
        `Architectural Clay ${data.name}`
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

export default async function CityPage({ params }: PageProps) {
    const { city } = await params;

    const query = `*[_type == "cityPage" && slug.current == $city][0]{
        name,
        "slug": slug.current,
        region,
        heroTitle,
        heroSubtitle,
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

    // 1. Local Business Schema
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
            'streetAddress': `${data.name}, India`,
            'addressLocality': data.name,
            'addressRegion': data.region,
            'addressCountry': 'IN'
        },
        'openingHoursSpecification': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '09:00',
            'closes': '19:00'
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

    // 3. FAQ Schema
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
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 mb-6 border border-[var(--terracotta)] text-[var(--terracotta)] text-[10px] font-bold uppercase tracking-[0.25em] rounded-full">
                            Serving {data.region} India
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif text-[#2A1E16] mb-6 leading-tight">
                            {data.heroTitle} <span className="text-[var(--terracotta)]">{data.name}</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                            {data.heroSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-8 bg-[var(--sand)]/30 rounded-2xl border border-[#e5e0d8]">
                            <div className="text-4xl mb-4">🌡️</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Climate Optimized</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{data.climateAdvice}</p>
                        </div>
                        <div className="text-center p-8 bg-[var(--sand)]/30 rounded-2xl border border-[#e5e0d8]">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Fast Delivery</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Delivery to {data.name} usually takes <strong>{delivery}</strong>. Direct site delivery available.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-[var(--sand)]/30 rounded-2xl border border-[#e5e0d8]">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="font-serif text-xl mb-3 text-[#2A1E16]">Architect Preferred</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">Trusted by top architects in {data.name} for premium facades.</p>
                        </div>
                    </div>
                </section>

                {/* Local Project Gallery (New Feature) */}
                {data.localImages && data.localImages.length > 0 && (
                    <section className="py-16 bg-gray-50 mb-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-3xl md:text-4xl font-serif text-center mb-12 text-[#2A1E16]">
                                Projects in {data.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data.localImages.map((img: any, idx: number) => (
                                    <div key={idx} className="relative h-64 rounded-xl overflow-hidden shadow-sm group">
                                        <img
                                            src={urlForImage(img).width(600).height(400).url()}
                                            alt={`${data.name} Project ${idx + 1}`}
                                            className="search-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}


                {/* Popular Products for City */}
                <section className="bg-[#faf7f5] py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-[#2A1E16]">
                            Trending in {data.name}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Generic fallbacks if specific products aren't set, or loop through if logic permits. 
                                For now, we keep the reliable internal linking structure but inject dynamic text.
                            */}

                            <Link href="/products?category=Exposed Brick" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                        <img
                                            src="/images/products/wirecut-texture.jpg"
                                            alt={`Exposed Bricks ${data.name}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <span className="absolute bottom-4 left-4 text-white font-medium z-20">Best Seller</span>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif mb-3 text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">Exposed Bricks</h3>
                                        <p className="text-gray-500 mb-6 font-light">Perfect for {data.name}'s {weather.toLowerCase()} climate.</p>
                                        <div className="flex items-center text-[var(--terracotta)] font-bold tracking-widest text-xs uppercase">
                                            View Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/products?category=Jaali" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                        <img
                                            src="/images/premium-terracotta-facade.png"
                                            alt={`Terracotta Jaali ${data.name}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif mb-3 text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">Ventilation Jaalis</h3>
                                        <p className="text-gray-500 mb-6 font-light">Natural cooling for {data.name} homes.</p>
                                        <div className="flex items-center text-[var(--terracotta)] font-bold tracking-widest text-xs uppercase">
                                            View Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/products?category=Roof Tiles" className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                                    <div className="h-64 bg-gray-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                                        <img
                                            src="/images/products/pressed-texture.jpg"
                                            alt={`Clay Roof Tiles ${data.name}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-2xl font-serif mb-3 text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">Clay Roof Tiles</h3>
                                        <p className="text-gray-500 mb-6 font-light">Weather-proof solutions.</p>
                                        <div className="flex items-center text-[var(--terracotta)] font-bold tracking-widest text-xs uppercase">
                                            View Collection <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    </div>
                </section>

                {/* FAQ Section (Enhanced with Sanity Data) */}
                <section className="max-w-4xl mx-auto px-6 py-20">
                    <h2 className="text-3xl font-serif mb-12 text-center">Frequently Asked Questions in {data.name}</h2>
                    <div className="space-y-6">
                        {/* Dynamic FAQs from Sanity */}
                        {data.faq && data.faq.map((item: any, i: number) => (
                            <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 open:shadow-md transition-all">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <h3 className="font-medium text-lg text-[#2A1E16]">{item.question}</h3>
                                    <span className="transform group-open:rotate-180 transition-transform duration-300">▼</span>
                                </summary>
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {item.answer}
                                </div>
                            </details>
                        ))}

                        {/* Standard FAQs (Fallbacks if no specific ones, or additions) */}
                        <details className="group bg-white rounded-xl shadow-sm border border-gray-100 open:shadow-md transition-all">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-medium text-lg text-[#2A1E16]">What is the local delivery time?</h3>
                                <span className="transform group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                For most areas in {data.name}, delivery takes {delivery}. We deliver to all major areas including {areas.slice(0, 4).join(', ')}.
                            </div>
                        </details>
                        <details className="group bg-white rounded-xl shadow-sm border border-gray-100 open:shadow-md transition-all">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <h3 className="font-medium text-lg text-[#2A1E16]">Are terracotta tiles suitable for {data.name}'s climate?</h3>
                                <span className="transform group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                Absolutely. {data.climateAdvice}
                            </div>
                        </details>
                    </div>
                </section>

                {/* Areas List (SEO Keyword Juice) */}
                <section className="bg-gray-50 py-16 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 text-center">Delivering to all areas in {data.name}</p>
                        <div className="flex flex-wrap justify-center gap-3 text-center">
                            {areas.map((area: string) => (
                                <span key={area} className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Nearby Locations (Internal Linking) */}
                <section className="py-12 max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-gray-400 mb-6">Explore other locations in {data.region} India</p>
                    <div className="flex justify-center flex-wrap gap-6 text-[var(--terracotta)] underline decoration-[var(--terracotta)]/30 underline-offset-4">
                        {regionCities
                            .filter((c: string) => c !== data.slug)
                            .map((citySlug: string) => (
                                <Link key={citySlug} href={`/${citySlug}`} className="capitalize hover:decoration-[var(--terracotta)]">
                                    {citySlug}
                                </Link>
                            ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-[#2A1E16] text-white py-24 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-serif mb-8 max-w-2xl mx-auto">Build with {data.name}'s finest clay materials.</h2>
                        <p className="text-xl mb-12 text-white/70 font-light">
                            Join hundreds of satisfied homeowners and architects in {data.name}.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/#quote"
                                className="px-10 py-5 bg-[var(--terracotta)] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#a85638] transition-all shadow-xl hover:scale-105"
                            >
                                Get Free Quote
                            </Link>
                            <Link
                                href="/contact"
                                className="px-10 py-5 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Contact {data.name} Team
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
