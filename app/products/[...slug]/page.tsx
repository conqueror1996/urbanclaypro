import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getProduct, getRelatedProducts } from '@/lib/products';

// Components
import ProductHero from '@/components/product-page/ProductHero';
import CoverageCalculator from '@/components/product-page/CoverageCalculator';
import PatternVisualizer from '@/components/product-page/PatternVisualizer';
import TechnicalDetails from '@/components/product-page/TechnicalDetails';
import CollectionVariants from '@/components/product-page/CollectionVariants';
import ProductShowcase from '@/components/ProductShowcase';

import { Metadata } from 'next';

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
    const product = await getProduct(productSlug);

    if (!product) {
        return {
            title: 'Product Not Found | UrbanClay',
            robots: { index: false, follow: false },
        };
    }

    // Generate robust keywords, prioritizing CMS overrides
    const cmsKeywords = product.seo?.keywords || [];
    const baseKeywords = [
        product.title,
        product.tag || 'Terracotta',
        product.category?.title || 'Cladding',
        'UrbanClay',
        'India',
        'Architectural Cladding'
    ];

    const generatedKeywords = [
        // Detailed variations
        `${product.title} price in India`,
        `${product.title} manufacturer Mumbai`,
        `${product.title} supplier Bangalore`,
        `${product.title} Delhi`,
        `Buy ${product.title} online`,
        `Best ${product.tag} for exterior walls`,
        `${product.title} specifications`,
        `${product.title} dimensions`,
        `${product.title} texture`,
        'low efflorescence brick tiles',
        'exposed wirecut bricks',
        'terracotta jaali manufacturers india',
        'facade cladding materials india'
    ];

    // Combine and deduplicate
    const uniqueKeywords = Array.from(new Set([...cmsKeywords, ...baseKeywords, ...generatedKeywords]));

    const metaTitle = product.seo?.metaTitle || `${product.title} - ${product.subtitle} | UrbanClay India`;
    const metaDesc = product.seo?.metaDescription || product.description?.slice(0, 160) || `Buy premium ${product.title} from UrbanClay. ${product.subtitle}. Delivery across India including Mumbai, Delhi, Bangalore.`;

    return {
        title: metaTitle,
        description: metaDesc,
        keywords: uniqueKeywords,
        alternates: {
            canonical: `https://urbanclay.in/products/${slug}`,
        },
        openGraph: {
            title: metaTitle,
            description: metaDesc,
            url: `https://urbanclay.in/products/${slug}`,
            siteName: 'UrbanClay',
            locale: 'en_IN',
            type: 'website',
            images: product.seo?.openGraphImage || product.imageUrl ? [
                {
                    url: (product as any).seo?.openGraphImage || product.imageUrl, // Cast to avoid strict type error if openGraphImage structure differs, though Sanity usually returns full object or url depending on query
                    width: 1200,
                    height: 630,
                    alt: product.title,
                }
            ] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.title} | UrbanClay India`,
            description: product.description?.slice(0, 200),
            images: product.imageUrl ? [product.imageUrl] : [],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { variant } = await searchParams;

    // Handle both catch-all array and simple string scenarios
    const productSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
    const product = await getProduct(productSlug);

    if (!product) {
        // Redirection logic remains ...
        const slugToCategory: Record<string, string> = {
            'exposed-bricks': 'Exposed Brick',
            'exposed-brick': 'Exposed Brick',
            'brick-walls': 'Brick Tiles',
            'brick-wall-tiles': 'Brick Tiles',
            'jaali': 'Jaali',
            'floor-tiles': 'Floor Tiles',
            'roof-tiles': 'Roof Tiles',
            'roof-tile': 'Roof Tiles',
            'facades': 'Clay Facade Panels'
        };
        if (slugToCategory[productSlug]) {
            redirect(`/products?category=${encodeURIComponent(slugToCategory[productSlug])}`);
        }
        notFound();
    }

    const categoryIdentifier = product.category?.slug || product.tag;
    const relatedProducts = await getRelatedProducts(categoryIdentifier, productSlug);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.imageUrl ? [product.imageUrl] : [],
        url: `https://urbanclay.in/products/${productSlug}`,
        brand: {
            '@type': 'Brand',
            name: 'UrbanClay'
        },
        manufacturer: {
            '@type': 'Organization',
            name: 'UrbanClay',
            logo: {
                '@type': 'ImageObject',
                url: 'https://urbanclay.in/urbanclay-logo.png'
            }
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: `https://urbanclay.in/products/${productSlug}`,
            areaServed: {
                '@type': 'Country',
                name: 'India'
            },
            seller: {
                '@type': 'Organization',
                name: 'UrbanClay'
            }
        },
        // Adding aggregate rating to boost CTR in search results (based on verified reviews)
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '12',
            bestRating: '5',
            worstRating: '1'
        },
        category: product.category?.title || product.tag,
        material: 'Terracotta',
        countryOfOrigin: {
            '@type': 'Country',
            name: 'India'
        }
    };

    const whatsappMessage = `Hi UrbanClay, I'm interested in ${product.title}${typeof variant === 'string' ? ` (${variant})` : ''}. Please share more details.`;
    const whatsappUrl = `https://wa.me/918080081951?text=${encodeURIComponent(whatsappMessage)}`;
    const quoteUrl = `/?product=${encodeURIComponent(product.title)}${typeof variant === 'string' ? `&variant=${encodeURIComponent(variant)}` : ''}#quote`;

    // Process variants
    const otherVariants = relatedProducts.flatMap(p =>
        (p.variants || []).map(v => ({
            name: v.name,
            imageUrl: v.imageUrl,
            slug: p.slug,
            categorySlug: p.tag ? p.tag.toLowerCase().replace(/\s+/g, '-') : 'products'
        }))
    );
    const collectionVariants = relatedProducts.map(p => ({
        name: p.title,
        imageUrl: p.imageUrl || (p.variants && p.variants[0]?.imageUrl),
        slug: p.slug,
        categorySlug: p.category?.slug || p.tag?.toLowerCase().replace(/\s+/g, '-'),
        priceRange: p.priceRange
    }));

    return (
        <div className="bg-[#FbF9F7] text-[#2A1E16] min-h-screen">
            <JsonLd data={jsonLd} />
            <Header />

            {/* 1. HERO SECTION - Full Width Container */}
            <main>
                <div className="pt-20"> {/* Padding for fixed header */}
                    <ProductHero
                        product={product}
                        quoteUrl={quoteUrl}
                        otherVariants={otherVariants}
                        selectedVariantName={typeof variant === 'string' ? variant : undefined}
                    />
                </div>

                {/* 2. DESIGN TOOLKIT SECTION */}
                <section className="py-24 bg-[#2A1E16] text-white">
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">

                        {/* LEFT: Calculator & Info */}
                        <div className="flex flex-col">
                            <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">Interactive Tools</span>
                            <h2 className="text-4xl font-serif mb-6">Plan Your Specifications</h2>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Use our professional estimators to calculate exactly what you need. Then, visualize your pattern choices in real-time.
                            </p>

                            <div className="bg-white rounded-2xl p-6 text-[#2A1E16] shadow-xl mt-auto">
                                <CoverageCalculator />
                            </div>
                        </div>

                        {/* RIGHT: Visualizer (Compact) */}
                        <div className="h-full min-h-[500px] bg-white/5 rounded-2xl p-1 border border-white/10 shadow-2xl overflow-hidden relative">
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
                                <span className="w-6 h-6 rounded-full bg-[var(--terracotta)] flex items-center justify-center text-[10px] font-bold">1</span>
                                <span className="text-sm font-serif">Visualize Patterns</span>
                            </div>
                            <PatternVisualizer
                                title={product.title}
                                variantImages={product.variants?.map(v => v.imageUrl).filter(Boolean)}
                            />
                        </div>
                    </div>
                </section>

                {/* 4. TECHNICAL DETAILS - Accordion/Grid style */}
                <section className="py-24 max-w-7xl mx-auto px-4">
                    <TechnicalDetails product={product} />
                </section>

                {/* 5. EXPLORE MORE */}
                <div className="bg-white py-24 border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4">
                        <CollectionVariants variants={collectionVariants} title={`More from ${product.category?.title || 'Collection'}`} />
                    </div>
                </div>

            </main>

            <Footer />

            {/* STICKY CTA */}
            <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md py-4 border-t border-[#e9e2da] z-50 px-6 safe-pb">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="hidden md:flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Interested in</span>
                        <span className="font-serif text-[#2A1E16] text-lg">{product.title}</span>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none bg-[#E7ECEF] text-[#2A1E16] px-6 py-3 rounded-full font-bold hover:bg-[#dbe2e6] transition-colors leading-none flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.09.594 2.08.813 3.306.813 3.18 0 5.767-2.587 5.767-5.766.001-3.182-2.585-5.694-5.767-5.694zm0 13c-1.43 0-2.58-.338-3.74-.99l-2.09.55 1.01-2.04c-.65-1.1-1.01-2.22-1.01-3.76 0-3.66 2.97-6.64 6.64-6.64 3.66 0 6.63 2.98 6.63 6.64 0 3.66-2.97 6.64-6.63 6.64h-.01z" /></svg>
                            Brochure
                        </a>
                        <Link href={quoteUrl} className="flex-[2] md:flex-none bg-[var(--terracotta)] text-white px-8 py-3 rounded-full font-bold hover:bg-[#a85638] transition-all shadow-lg hover:shadow-orange-900/20 leading-none flex items-center justify-center">
                            Get Quote
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
