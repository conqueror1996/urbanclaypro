'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Product } from '@/lib/products';
import PremiumProductCard from '@/components/PremiumProductCard';
import JsonLd from '@/components/JsonLd';

interface PillarPageTemplateProps {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    keyword: string;
    products: Product[];
    faqs: { q: string, a: string }[];
}

export default function PillarPageTemplate({
    title,
    subtitle,
    description,
    heroImage,
    keyword,
    products,
    faqs
}: PillarPageTemplateProps) {

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': title,
        'description': description,
        'url': `https://claytile.in/${keyword.replace(/\\s+/g, '-').toLowerCase()}`,
        'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': products.slice(0, 10).map((p, i) => ({
                '@type': 'ListItem',
                'position': i + 1,
                'url': `https://claytile.in/products/${p.category?.slug || 'collection'}/${p.slug}`
            }))
        }
    };

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(faq => ({
            '@type': 'Question',
            'name': faq.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.a
            }
        }))
    };

    return (
        <main className="bg-[#1a1512] min-h-screen text-[#EBE5E0] selection:bg-[var(--terracotta)] selection:text-white font-sans overflow-x-hidden">
            <JsonLd data={[jsonLd, faqJsonLd]} />
            <Header />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[75vh] flex items-center justify-center pt-32 pb-20 px-6">
                <div className="absolute inset-0 z-0">
                    <img src={heroImage} alt={`${title} - UrbanClay India`} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/60 to-transparent" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center mt-12">
                    <span className="inline-block py-1.5 px-4 rounded-full border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-8">
                        {keyword}
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] text-white tracking-tight mb-8">
                        {title}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed border-l-2 border-[var(--terracotta)] pl-6 text-left">
                        {subtitle}
                    </p>
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className="py-20 px-6 max-w-4xl mx-auto text-center">
                <p className="text-xl text-white/70 font-light leading-loose">
                    {description}
                </p>
            </section>

            {/* PRODUCT GRID */}
            <section className="py-24 bg-[#120d0b] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-serif text-white mb-4">The {title} Collection</h2>
                            <p className="text-white/50">Explore our curated range of premium {keyword.toLowerCase()}.</p>
                        </div>
                        <Link href="/products" className="text-[var(--terracotta)] uppercase tracking-[0.2em] text-xs font-bold hover:text-white transition-colors flex items-center gap-2">
                            View All Catalog <span>→</span>
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.flatMap((product) => {
                                if (product.variants && product.variants.length > 0) {
                                    return product.variants.map((variant) => ({ product, variant }));
                                }
                                return [{ product, variant: { name: 'Standard', imageUrl: product.imageUrl } }];
                            }).map(({ product, variant }, i) => (
                                <PremiumProductCard
                                    key={`${product._id}-${i}`}
                                    product={product}
                                    variant={variant}
                                    index={i}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-32 text-center border border-white/10 rounded-3xl">
                            <h3 className="text-2xl font-serif text-white/40">Collection Expanding Soon</h3>
                            <p className="text-white/30 mt-4">We are currently curating our newest {keyword.toLowerCase()}. Check back shortly.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQs */}
            <section className="py-32 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] uppercase tracking-[0.2em] font-bold text-xs mb-4 block">Expert Knowledge</span>
                    <h2 className="text-4xl font-serif text-white">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group bg-[#241e1a] border border-white/5 rounded-2xl overflow-hidden open:border-white/20 transition-all">
                            <summary className="p-6 cursor-pointer font-medium text-white/80 flex justify-between items-center select-none marker:content-none hover:text-white">
                                {faq.q}
                                <span className="text-[var(--terracotta)] text-xl group-open:rotate-45 transition-transform">+</span>
                            </summary>
                            <div className="px-6 pb-6 text-white/50 text-sm leading-relaxed">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
