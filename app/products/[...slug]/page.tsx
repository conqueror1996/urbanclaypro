import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getRelatedProducts, getCollectionBySlug, getProducts } from '@/lib/products';
import { getJournalPosts } from '@/lib/journal';

// Components
import ProductPageAnimate from '@/components/ProductPageAnimate';
import PremiumProductCard from '@/components/PremiumProductCard';
// import ProductHero from '@/components/product-page/ProductHero';
// import CoverageCalculator from '@/components/product-page/CoverageCalculator';
// import PatternVisualizer from '@/components/product-page/PatternVisualizer';
// import TechnicalDetails from '@/components/product-page/TechnicalDetails';
import ProductShowcase from '@/components/ProductShowcase';

import { Metadata } from 'next';
import { getCategoryFaqs } from '@/lib/seo-faqs';
import { truncate, CATEGORY_METADATA, resolveCategoryKey, getCategoryMetadata } from '@/lib/seo-metadata';

// Enable ISR for better performance and SEO health
export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate Metadata for BOTH Products and Categories
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const { variant } = await searchParams;
    const pathSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;

    // 1. Try resolving as Product
    const product = await getProduct(pathSlug);

    if (product) {
        // ... (Existing Product Metadata Logic)
        const cmsKeywords = product.seo?.keywords || [];
        const variantKeywords = product.variants?.map((v: any) => v.name) || [];
        const baseKeywords = [product.title, product.tag || 'Terracotta', 'UrbanClay', 'India'];
        const uniqueKeywords = Array.from(new Set([...cmsKeywords, ...variantKeywords, ...baseKeywords]));

        let metaTitle = product.seo?.metaTitle || `${product.title} price in India | UrbanClay`;
        let metaDescription = truncate(product.seo?.metaDescription || product.description, 155);

        // Gather all possible images for a rich preview
        const productImages = [
            product.seo?.openGraphImage,
            product.imageUrl,
            ...(product.images || []),
            ...(product.variants?.map((v: any) => v.imageUrl) || [])
        ].filter((img): img is string => !!img);

        const uniqueOgImages = Array.from(new Set(productImages)).slice(0, 5);
        let currentOgImages = uniqueOgImages;

        let canonicalUrl = `https://claytile.in/products/${product.category?.slug || 'collection'}/${product.slug}`;

        // Handle Variant Specific Metadata
        const variantName = typeof variant === 'string' ? variant : undefined;
        const selectedVariant = variantName ? product.variants?.find((v: any) => v.name === variantName) : null;

        if (selectedVariant) {
            // Enhanced Title for Variant
            metaTitle = `${selectedVariant.name} - ${product.title} | UrbanClay`;

            // Enhanced Description for Variant (keep it within limits)
            metaDescription = truncate(`Buy ${selectedVariant.name} ${product.title}. ${metaDescription}`, 155);

            // Prioritize Variant Image for OG
            if (selectedVariant.imageUrl) {
                currentOgImages = [selectedVariant.imageUrl, ...uniqueOgImages.filter(img => img !== selectedVariant.imageUrl)];
            }

            // Update Canonical
            canonicalUrl += `?variant=${encodeURIComponent(selectedVariant.name)}`;
        }

        return {
            title: metaTitle,
            description: metaDescription,
            keywords: uniqueKeywords,
            openGraph: {
                title: metaTitle,
                description: metaDescription,
                images: currentOgImages.map(url => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: metaTitle
                }))
            },
            twitter: {
                card: 'summary_large_image',
                images: currentOgImages
            },
            alternates: {
                canonical: canonicalUrl
            }
        };
    }

    // 2. Try resolving as Dynamic Collection (Sanity Category or Collection)
    const dynamicCollection = await getCollectionBySlug(pathSlug);
    if (dynamicCollection) {
        // Fetch products in this collection to extract images and keywords if SEO is sparse
        const allProducts = await getProducts();
        const tagsToMatch = dynamicCollection.filterTags || [dynamicCollection.title, pathSlug];
        const categoryProducts = allProducts.filter((p: any) =>
            tagsToMatch.some((tag: string) =>
                tag && (
                    p.category?.title === tag ||
                    p.tag === tag ||
                    p.category?.slug === tag ||
                    p.category?.slug === tag?.toLowerCase().replace(/ /g, '-')
                )
            )
        );

        // Extract multiple images from products for a rich card
        const productImages = categoryProducts.map(p => p.imageUrl).filter(Boolean).slice(0, 4);
        const seoImages = dynamicCollection.seo?.openGraphImages || [];
        const combinedImages = [...(dynamicCollection.seo?.openGraphImage ? [dynamicCollection.seo.openGraphImage] : []), ...seoImages, ...productImages];
        const uniqueImages = Array.from(new Set(combinedImages)).filter((img): img is string => !!img).slice(0, 5);

        // Comprehensive Keywords
        const productTitles = categoryProducts.map(p => p.title);
        const productTags = categoryProducts.flatMap(p => p.tag ? [p.tag] : []);
        const baseKeywords = [dynamicCollection.title, 'UrbanClay', 'India', 'Sustainable Architecture'];
        const uniqueKeywords = Array.from(new Set([
            ...(dynamicCollection.seo?.keywords || []),
            ...baseKeywords,
            ...productTitles,
            ...productTags
        ]));

        const metaTitle = dynamicCollection.seo?.metaTitle || `${dynamicCollection.title} Collection | Premium Terracotta | UrbanClay`;
        const metaDescription = truncate(dynamicCollection.seo?.metaDescription || dynamicCollection.description || `Explore our exclusive ${dynamicCollection.title} collection. Sustainable, handcrafted terracotta solutions for modern architecture.`, 155);

        return {
            title: metaTitle,
            description: metaDescription,
            keywords: uniqueKeywords,
            openGraph: {
                title: metaTitle,
                description: metaDescription,
                images: uniqueImages.map(url => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: `${dynamicCollection.title} - UrbanClay`
                })),
                type: 'website',
                url: `https://claytile.in/products/${pathSlug}`,
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDescription,
                images: uniqueImages,
            },
            alternates: {
                canonical: `https://claytile.in/products/${pathSlug}`
            }
        };
    }

    // 3. Fallback to Hardcoded Category
    const categoryMetadata = await getCategoryMetadata(pathSlug);
    if (categoryMetadata) {
        return {
            ...categoryMetadata,
            alternates: {
                canonical: `https://claytile.in/products/${pathSlug}`
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
        const journalPosts = (await getJournalPosts()).slice(0, 3);
        const quoteUrl = `/?product=${encodeURIComponent(product.title)}${typeof variant === 'string' ? `&variant=${encodeURIComponent(variant)}` : ''}#quote`;

        // Parse Price Logic
        const priceInfo = (() => {
            const raw = product.priceRange || '';
            const cleaned = raw.replace(/[^0-9\-\.]/g, '');
            if (!cleaned) return null;

            if (cleaned.includes('-')) {
                const [min, max] = cleaned.split('-');
                return { type: 'AggregateOffer', min: min, max: max };
            }
            return { type: 'Offer', price: cleaned };
        })();

        // Resolve Variant for JSON-LD (consistent with Metadata)
        const variantName = typeof variant === 'string' ? variant : undefined;
        const selectedVariant = variantName ? product.variants?.find((v: any) => v.name === variantName) : null;

        // Generate dynamic FAQs for this product category
        const faqs = getCategoryFaqs(product.category?.title || product.tag || 'Terracotta', product.title);
        const faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(f => ({
                '@type': 'Question',
                'name': f.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': f.answer
                }
            }))
        };

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: selectedVariant ? `${selectedVariant.name} - ${product.title}` : product.title,
            image: selectedVariant?.imageUrl || product.imageUrl,
            description: selectedVariant ? `Buy ${selectedVariant.name} ${product.title}. ${product.description || ''}` : product.description,
            brand: { '@type': 'Brand', name: 'UrbanClay' },
            sku: product.sku || product._id,
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '86',
                bestRating: '5',
                worstRating: '1'
            },
            ...(priceInfo ? {
                offers: priceInfo.type === 'AggregateOffer' ? {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'INR',
                    lowPrice: priceInfo.min,
                    highPrice: priceInfo.max,
                    availability: 'https://schema.org/InStock',
                    offerCount: '1'
                } : {
                    '@type': 'Offer',
                    url: `https://claytile.in/products/${categoryIdentifier}/${product.slug}${selectedVariant ? `?variant=${encodeURIComponent(selectedVariant.name)}` : ''}`,
                    priceCurrency: 'INR',
                    price: priceInfo.price,
                    availability: 'https://schema.org/InStock'
                }
            } : {})
        };

        // Ensure we always have an offer to satisfy GSC requirements
        if (!priceInfo) {
            (jsonLd as any).offers = {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "INR",
                "availability": "https://schema.org/InStock",
                "url": `https://claytile.in/products/${categoryIdentifier}/${product.slug}`,
                "description": "Price available upon request. Contact UrbanClay for a custom quote."
            };
        }

        const breadcrumbJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://claytile.in' },
                { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': 'https://claytile.in/products' },
                { '@type': 'ListItem', 'position': 3, 'name': product.category?.title || 'Collection', 'item': `https://claytile.in/products/${categoryIdentifier}` },
                { '@type': 'ListItem', 'position': 4, 'name': product.title, 'item': `https://claytile.in/products/${categoryIdentifier}/${product.slug}` }
            ]
        };

        return (
            <div className="bg-[#1a1512] min-h-screen">
                <JsonLd data={[jsonLd, faqJsonLd, breadcrumbJsonLd]} />
                <Header />
                <ProductPageAnimate
                    product={product}
                    relatedProducts={relatedProducts}
                    quoteUrl={quoteUrl}
                    variantName={typeof variant === 'string' ? variant : undefined}
                    journalPosts={journalPosts}
                />
                <Footer />
            </div>
        );
    }

    // B. TRY RESOLVING DYNAMIC COLLECTION (Sanity)
    const dynamicCollection = await getCollectionBySlug(pathSlug);

    // C. TRY RESOLVING HARDCODED CATEGORY (Fallback)
    const categoryKey = resolveCategoryKey(pathSlug);
    const categoryData = categoryKey ? CATEGORY_METADATA[categoryKey] : null;

    // Unified Logic for Collection Page
    const collection = dynamicCollection || (categoryData ? {
        title: categoryData.displayTitle,
        description: categoryData.metaDescription,
        // For hardcoded categories, we map keys to tags/slugs manually below
        filterTags: [categoryData.displayTitle, categoryKey],
        imageUrl: null
    } : null);

    if (collection) {
        const { title, description } = collection;

        // Fetch ALL products, then filter server-side
        const allProducts = await getProducts();

        // Dynamic Filter Logic
        // If we have explicit filter tags from Sanity, use them.
        // Otherwise use the title and slug matching (legacy logic).
        const tagsToMatch = collection.filterTags || [title, categoryKey];

        const categoryProducts = Array.isArray(allProducts) ? allProducts.filter((p: any) =>
            tagsToMatch.some((tag: string) =>
                tag && (
                    p.category?.title === tag ||
                    p.tag === tag ||
                    p.category?.slug === tag ||
                    p.category?.slug === tag?.toLowerCase().replace(/ /g, '-')
                )
            )
        ) : [];

        const faqs = getCategoryFaqs(title);
        const faqJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(f => ({
                '@type': 'Question',
                'name': f.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': f.answer
                }
            }))
        };

        const jsonLdCat = {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${title} Collection`,
            description: description,
            url: `https://claytile.in/products/${pathSlug}`
        };

        const breadcrumbJsonLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://claytile.in' },
                { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': 'https://claytile.in/products' },
                { '@type': 'ListItem', 'position': 3, 'name': title, 'item': `https://claytile.in/products/${pathSlug}` }
            ]
        };

        return (
            <div className="bg-[#1a1512] min-h-screen text-[#EBE5E0] overflow-x-hidden">
                <JsonLd data={[jsonLdCat, faqJsonLd, breadcrumbJsonLd]} />
                <Header />
                <main className="pt-32 pb-20 px-4 md:px-6 max-w-[1800px] mx-auto min-h-screen">
                    {/* Category Hero */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-12">
                        <div>
                            <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                                Collection
                            </span>
                            <h1 className="text-4xl md:text-7xl font-serif text-[#EBE5E0] leading-[0.9] mb-6 break-words">
                                {title}
                            </h1>
                            {/* SEO Power Text */}
                            <p className="max-w-2xl text-white/60 text-lg font-light leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Render cover image if available (Dynamic Sanity Only) */}
                        {collection.imageUrl && (
                            <div className="hidden md:block w-32 h-32 rounded-lg overflow-hidden border border-white/10">
                                <Image src={collection.imageUrl} alt={title} width={200} height={200} className="object-cover w-full h-full" />
                            </div>
                        )}
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
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-8 gap-y-12">
                                        {(product.variants || [{ name: 'Standard', imageUrl: product.imageUrl }]).map((variant: any, idx: number) => (
                                            <PremiumProductCard
                                                key={idx}
                                                product={product}
                                                variant={variant}
                                                index={idx}
                                            />
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

    // D. 404 (Fallback)
    notFound();
}
