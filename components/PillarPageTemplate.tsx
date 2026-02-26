'use client';

import React from 'react';
import { motion } from 'framer-motion';
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
    slug: string;
    products: Product[];
    faqs: { q: string, a: string }[];
}

export default function PillarPageTemplate({
    title,
    subtitle,
    description,
    heroImage,
    keyword,
    slug,
    products,
    faqs
}: PillarPageTemplateProps) {

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': title,
        'description': description,
        'url': `https://claytile.in/${slug}`,
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
                'name': title,
                'item': `https://claytile.in/${slug}`
            }
        ]
    };

    return (
        <main className="bg-[#1a1512] min-h-screen text-[#EBE5E0] selection:bg-[var(--terracotta)] selection:text-white font-sans overflow-x-hidden">
            <JsonLd data={[jsonLd, faqJsonLd, breadcrumbJsonLd]} />
            <Header />

            {/* HERO SECTION */}
            <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                >
                    <img
                        src={heroImage}
                        alt={`${title} - UrbanClay India`}
                        className="w-full h-full object-cover mix-blend-luminosity grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512] via-[#1a1512]/60 to-[#1a1512]/40" />
                </motion.div>

                <div className="relative z-10 max-w-6xl mx-auto text-center mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1.5 px-4 rounded-full border border-[var(--terracotta)]/40 bg-[var(--terracotta)]/10 text-[var(--terracotta)] text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-12 backdrop-blur-sm">
                            {keyword}
                        </span>

                        <h1 className="text-5xl md:text-7xl lg:text-[110px] font-serif leading-[0.85] text-white tracking-tighter mb-10 max-w-5xl mx-auto">
                            {title.split(' ').map((word, i) => (
                                <span key={i} className="inline-block mr-4 last:mr-0">
                                    {word === "Engineered" ? (
                                        <span className="text-[var(--terracotta)] italic">{word}</span>
                                    ) : (
                                        word
                                    )}
                                </span>
                            ))}
                        </h1>

                        <div className="w-24 h-px bg-[var(--terracotta)] mx-auto mb-10 opacity-60" />

                        <p className="text-xl md:text-3xl text-white/70 font-light max-w-3xl mx-auto leading-tight mb-16 tracking-tight">
                            {subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 bg-[var(--terracotta)] text-white font-bold text-sm tracking-widest uppercase overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(204,82,46,0.4)]"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10">Request Specifier Kit</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                            </motion.button>

                            <Link
                                href="/projects"
                                className="px-10 py-5 border border-white/20 bg-white/5 text-white/80 font-bold text-sm tracking-widest uppercase backdrop-blur-md hover:bg-white hover:text-[#0a0807] transition-all duration-300"
                            >
                                View Signature Projects
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Side Labels */}
                <div className="absolute left-10 top-1/2 -rotate-90 origin-left hidden lg:block opacity-20">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white font-bold flex items-center gap-4">
                        <span className="w-12 h-px bg-white" /> Performance Validated
                    </p>
                </div>

                <div className="absolute right-10 top-1/2 rotate-90 origin-right hidden lg:block opacity-20">
                    <p className="text-[9px] uppercase tracking-[0.5em] text-white font-bold flex items-center gap-4">
                        Architectural Integrity <span className="w-12 h-px bg-white" />
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
                            <h2 className="text-4xl font-serif text-white mb-4">{title} System Specifications</h2>
                            <p className="text-white/50">Technical configurations for high-performance facade integration.</p>
                        </div>
                        <Link href="/projects" className="text-[var(--terracotta)] uppercase tracking-[0.2em] text-xs font-bold hover:text-white transition-colors flex items-center gap-2">
                            Full Project Archive <span>→</span>
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
                            <h3 className="text-2xl font-serif text-white/40">Technical Library Loading</h3>
                            <p className="text-white/30 mt-4">We are updating our {keyword.toLowerCase()} technical documentation.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQs */}
            <section className="py-32 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] uppercase tracking-[0.2em] font-bold text-xs mb-4 block">Performance Parameters</span>
                    <h2 className="text-4xl font-serif text-white">System FAQ & Integrity</h2>
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
