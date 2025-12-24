import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getRelatedProducts } from '@/lib/products';

// Components
import ProductPageAnimate from '@/components/ProductPageAnimate';
// import ProductHero from '@/components/product-page/ProductHero';
// import CoverageCalculator from '@/components/product-page/CoverageCalculator';
// import PatternVisualizer from '@/components/product-page/PatternVisualizer';
// import TechnicalDetails from '@/components/product-page/TechnicalDetails';
import ProductShowcase from '@/components/ProductShowcase';

import { Metadata } from 'next';

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Hardcoded Category Map for "Smart Routing"
const slugToCategory: Record<string, string> = {
    'exposed-bricks': 'Exposed Bricks',
    'exposed-brick': 'Exposed Bricks',
    'brick-walls': 'Brick Wall Tiles',
    'brick-wall-tiles': 'Brick Wall Tiles',
    'brick-tiles': 'Brick Wall Tiles',
    'jaali': 'Terracotta Jali',
    'terracotta-jaali': 'Terracotta Jali',
    'terracotta-jali': 'Terracotta Jali',
    'floor-tiles': 'Floor Tiles',
    'roof-tiles': 'Roof Tiles',
    'roof-tile': 'Roof Tiles',
    'facades': 'Clay Facade Panels'
};

const categoryDescriptions: Record<string, string> = {
    'Exposed Bricks': "Discover India's finest range of wirecut and handmade exposed bricks. Perfect for sustainable, breathable, and timeless facades in modern architecture.",
    'Brick Wall Tiles': "Transform your interiors and exteriors with our thin brick cladding tiles. Get the authentic exposed brick look with easy installation and minimal weight.",
    'Terracotta Jali': "Natural terracotta ventilation blocks (Jaali) that reduce indoor temperature and add artistic shadow patterns to your building facade.",
    'Floor Tiles': "Handcrafted terracotta floor tiles for a rustic, earthen touch. Cool underfoot, durable, and naturally slip-resistant.",
    'Roof Tiles': "Premium clay roof tiles that offer superior thermal insulation and weather protection for Indian tropical climates.",
    'Clay Facade Panels': "Advanced ventilated facade systems for commercial and high-end residential projects. Energy-efficient and aesthetically stunning."
};

// Generate Metadata for BOTH Products and Categories
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const pathSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

    // 1. Try resolving as Product
    const product = await getProduct(pathSlug);

    if (product) {
        // ... (Existing Product Metadata Logic)
        const cmsKeywords = product.seo?.keywords || [];
        const baseKeywords = [product.title, product.tag || 'Terracotta', 'UrbanClay'];
        const uniqueKeywords = Array.from(new Set([...cmsKeywords, ...baseKeywords]));
        const metaTitle = product.seo?.metaTitle || `${product.title} price in India | UrbanClay`;

        return {
            title: metaTitle,
            description: product.seo?.metaDescription || product.description?.slice(0, 160),
            keywords: uniqueKeywords,
            openGraph: {
                title: metaTitle,
                images: [(product as any).seo?.openGraphImage || `/api/og?slug=${pathSlug}`]
            }
        };
    }

    // 2. Try resolving as Category
    const categoryTitle = slugToCategory[pathSlug];
    if (categoryTitle) {
        return {
            title: `Best ${categoryTitle} in India | Price & Specifications - UrbanClay`,
            description: categoryDescriptions[categoryTitle] || `Buy premium ${categoryTitle} online. ISO certified, eco-friendly terracotta products for architects and builders. Delivery in Mumbai, Delhi, Bangalore.`,
            keywords: [`${categoryTitle} price`, `${categoryTitle} india`, `${categoryTitle} manufacturers`, 'urbanclay catalog'],
            openGraph: {
                title: `Premium ${categoryTitle} Collection | UrbanClay`,
                description: `Explore our exclusive range of ${categoryTitle}.`,
                type: 'website',
                url: `https://urbanclay.in/products/${pathSlug}`,
                images: [{
                    url: `/api/og?slug=${pathSlug}&type=category`,
                    width: 1200,
                    height: 630,
                    alt: `${categoryTitle} Collection`
                }]
            }
        };
    }

    return { title: 'Not Found | UrbanClay' };
}

export default async function SmartProductRouter({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { variant } = await searchParams;
    const pathSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

    // A. CHECK FOR PRODUCT (Priority)
    const product = await getProduct(pathSlug);

    if (product) {
        // Render Product Page
        const categoryIdentifier = product.category?.slug || product.tag;
        const relatedProducts = await getRelatedProducts(categoryIdentifier, pathSlug);
        const quoteUrl = `/?product=${encodeURIComponent(product.title)}${typeof variant === 'string' ? `&variant=${encodeURIComponent(variant)}` : ''}#quote`;

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: product.imageUrl,
            description: product.description,
            brand: { '@type': 'Brand', name: 'UrbanClay' }
        };

        return (
            <div className="bg-[#1a1512] min-h-screen">
                <JsonLd data={jsonLd} />
                <Header />
                <ProductPageAnimate
                    product={product}
                    relatedProducts={relatedProducts}
                    quoteUrl={quoteUrl}
                    variantName={typeof variant === 'string' ? variant : undefined}
                />
                <Footer />
            </div>
        );
    }

    // B. CHECK FOR CATEGORY (The New "Category Hub")
    const categoryTitle = slugToCategory[pathSlug];
    if (categoryTitle) {
        // Fetch ALL products, then filter server-side
        const allProducts = await getProduct(pathSlug) || await import('@/lib/products').then(m => m.getProducts());
        // Since getProducts returns everything, we filter:
        const categoryProducts = Array.isArray(allProducts) ? allProducts.filter((p: any) =>
            p.category?.title === categoryTitle || p.tag === categoryTitle
        ) : [];

        const jsonLdCat = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${categoryTitle} Collection`,
            description: categoryDescriptions[categoryTitle],
            url: `https://urbanclay.in/products/${pathSlug}`
        };

        return (
            <div className="bg-[#1a1512] min-h-screen text-[#EBE5E0]">
                <JsonLd data={jsonLdCat} />
                <Header />
                <main className="pt-32 pb-20 px-6 max-w-[1800px] mx-auto min-h-screen">
                    {/* Category Hero */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-12">
                        <div>
                            <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                                Collection
                            </span>
                            <h1 className="text-4xl md:text-7xl font-serif text-[#EBE5E0] leading-[0.9] mb-6">
                                {categoryTitle}
                            </h1>
                            {/* SEO Power Text */}
                            <p className="max-w-2xl text-white/60 text-lg font-light leading-relaxed">
                                {categoryDescriptions[categoryTitle] || `Explore our premium range of ${categoryTitle}.`}
                            </p>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="space-y-20">
                        {categoryProducts.length > 0 ? (
                            categoryProducts.map((product: any) => (
                                <div key={product._id} className="section-series">
                                    {/* Simplified Series Header */}
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-2 h-2 rounded-full bg-[var(--terracotta)]"></div>
                                        <h3 className="text-2xl font-serif text-[#EBE5E0]">
                                            {product.title} <span className="text-white/30 text-lg font-sans font-light italic ml-2">Series</span>
                                        </h3>
                                        <div className="h-px bg-white/5 flex-1" />
                                        <Link href={`/products/${product.category?.slug || 'collection'}/${product.slug}`} className="text-xs uppercase tracking-widest text-[#d8b09a] hover:text-white transition-colors">
                                            View Specs →
                                        </Link>
                                    </div>

                                    {/* Variants Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                                        {(product.variants || [{ name: 'Standard', imageUrl: product.imageUrl }]).map((variant: any, idx: number) => (
                                            <Link
                                                key={idx}
                                                href={`/products/${product.category?.slug || 'collection'}/${product.slug}${variant.name !== 'Standard' ? `?variant=${encodeURIComponent(variant.name)}` : ''}`}
                                                className="group"
                                            >
                                                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#241e1a] mb-4 border border-white/5 group-hover:border-[var(--terracotta)]/50 transition-all">
                                                    {variant.imageUrl && (
                                                        <Image
                                                            src={variant.imageUrl}
                                                            alt={`${product.title} ${variant.name}`}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                                </div>
                                                <h4 className="text-sm font-bold text-white mb-1">{variant.name}</h4>
                                                <p className="text-[10px] text-[var(--terracotta)] uppercase tracking-widest">{product.title}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-white/30">
                                <p>No products found in this category currently.</p>
                                <Link href="/products" className="text-[var(--terracotta)] underline mt-4 inline-block">View Full Catalog</Link>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // C. 404 (Fallback)
    notFound();
}
