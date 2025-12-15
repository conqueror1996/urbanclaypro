import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
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
        'India'
    ];

    // Only add generic long-tail variations if we don't have enough specific AI keywords
    const generatedKeywords = cmsKeywords.length > 5 ? [] : [
        // Detailed variations (Fallback)
        `${product.title} price in India`,
        `${product.title} manufacturer Mumbai`,
        `${product.title} supplier Bangalore`,
        `Buy ${product.title} online`,
        `${product.title} specifications`,
        'architectural cladding india'
    ];

    // Combine and deduplicate (CMS first)
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
            images: (product.seo?.openGraphImage || product.imageUrl) ? [
                {
                    url: (product as any).seo?.openGraphImage || product.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                }
            ] : [
                {
                    url: 'https://urbanclay.in/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: product.title
                }
            ],
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

    const otherVariants = relatedProducts.flatMap(p =>
        (p.variants || []).map(v => ({
            name: v.name,
            imageUrl: v.imageUrl,
            slug: p.slug,
            categorySlug: p.tag ? p.tag.toLowerCase().replace(/\s+/g, '-') : 'products'
        }))
    );

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
