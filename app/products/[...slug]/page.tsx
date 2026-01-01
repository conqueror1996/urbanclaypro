import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getRelatedProducts, getCollectionBySlug, getProducts } from '@/lib/products';

// Components
import ProductPageAnimate from '@/components/ProductPageAnimate';
// import ProductHero from '@/components/product-page/ProductHero';
// import CoverageCalculator from '@/components/product-page/CoverageCalculator';
// import PatternVisualizer from '@/components/product-page/PatternVisualizer';
// import TechnicalDetails from '@/components/product-page/TechnicalDetails';
import ProductShowcase from '@/components/ProductShowcase';

import { Metadata } from 'next';
import { getCategoryFaqs } from '@/lib/seo-faqs';
import { truncate } from '@/lib/seo-utils';

// Enable ISR for better performance and SEO health
export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Enhanced SEO Metadata Configuration for Categories
const CATEGORY_METADATA: Record<string, {
    displayTitle: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[]
}> = {
    'exposed-bricks': {
        displayTitle: 'Exposed Bricks',
        metaTitle: 'Premium Exposed Wirecut Bricks | Red, Grey & Beige Facade Bricks',
        metaDescription: 'Buy India\'s finest range of wirecut and handmade exposed bricks. Perfect for sustainable, breathable, and timeless facades. Available in Bangalore, Mumbai, Delhi.',
        keywords: ['exposed bricks', 'wirecut bricks', 'facing bricks', 'red clay bricks', 'facade bricks india']
    },
    'brick-wall-tiles': {
        displayTitle: 'Brick Wall Tiles',
        metaTitle: 'Thin Brick Cladding Tiles & Interior Brick Venners | Urban Clay',
        metaDescription: 'Transform your interiors and exteriors with thin brick cladding tiles. Get the authentic exposed brick look with easy installation and minimal weight.',
        keywords: ['brick cladding tiles', 'exposed brick tiles', 'wall cladding', 'interior brick veneer', 'thin bricks']
    },
    'terracotta-jaali': {
        displayTitle: 'Terracotta Jali',
        metaTitle: 'Terracotta Jaali Blocks & Ventilation Breeze Blocks | Urban Clay',
        metaDescription: 'Natural terracotta ventilation blocks (Jaali) that reduce indoor temperature and add artistic shadow patterns to building facades. Sustainable cooling solutions.',
        keywords: ['terracotta jaali', 'jaali blocks', 'breeze blocks', 'ventilation blocks', 'clay jali', 'facade screens']
    },
    'floor-tiles': {
        displayTitle: 'Floor Tiles',
        metaTitle: 'Handmade Terracotta Floor Tiles & Paving Bricks | Urban Clay',
        metaDescription: 'Handcrafted terracotta floor tiles for a rustic, earthen touch. Cool underfoot, durable, and naturally slip-resistant. Perfect for farmhouses and verandas.',
        keywords: ['terracotta floor tiles', 'clay pavers', 'handmade tiles', 'rustic flooring', 'red floor tiles']
    },
    'roof-tiles': {
        displayTitle: 'Roof Tiles',
        metaTitle: 'Premium Clay Roof Tiles for Indian Climate | Urban Clay',
        metaDescription: 'Weather-proof clay roof tiles that offer superior thermal insulation. Authentic Mangalore and pot tiles for heritage and modern tropical roofs.',
        keywords: ['clay roof tiles', 'mangalore tiles', 'roofing tiles interior', 'cooling roof tiles', 'weather proof tiles']
    },
    'facades': {
        displayTitle: 'Clay Facade Panels',
        metaTitle: 'Ventilated Clay Facade Systems & Louvers | Urban Clay',
        metaDescription: 'Advanced ventilated facade systems for commercial and high-end residential projects. Energy-efficient, rain-screen cladding, and baguettes.',
        keywords: ['ventilated facade', 'clay facade panels', 'terracotta cladding', 'facade louvers', 'architectural facade']
    },
    // Aliases for robustness (All mean All)
    'wirecut-bricks': {
        displayTitle: 'Wirecut Bricks',
        metaTitle: 'Machine-Cut Wirecut Bricks | Uniform Facade Masonry',
        metaDescription: 'Precision-made wirecut bricks for modern exposed brick facades. High strength, sharp edges, and consistent sizing.',
        keywords: ['wirecut bricks', 'machine bricks', 'exposed masonry', 'red wirecut', 'bangalore bricks']
    },
    'breeze-blocks': {
        displayTitle: 'Breeze Blocks',
        metaTitle: 'Terracotta Breeze Blocks & Ventilation Jali | Urban Clay',
        metaDescription: 'Sustainable terracotta breeze blocks for natural ventilation and shading. Perfect for tropical architecture and screening.',
        keywords: ['breeze blocks', 'ventilation blocks', 'hollow blocks', 'screen wall', 'terracotta jali']
    }
};

// Formatting Helper: Map URL slugs variations to the canonical keys above
const resolveCategoryKey = (slug: string): string | undefined => {
    // 1. Direct match
    if (CATEGORY_METADATA[slug]) return slug;

    // 2. Normalization (remove confusing suffixes)
    const normalize = slug.toLowerCase().replace(/s$/, ''); // Remove trailing 's'

    // 3. Synonym Mapping
    const map: Record<string, string> = {
        'exposed-brick': 'exposed-bricks',
        'wirecut-brick': 'wirecut-bricks',
        'brick-wall': 'brick-wall-tiles',
        'brick-tile': 'brick-wall-tiles',
        'wall-cladding': 'brick-wall-tiles',
        'cladding': 'brick-wall-tiles',
        'jaali': 'terracotta-jaali',
        'jali': 'terracotta-jaali',
        'jally': 'terracotta-jaali',
        'terracotta-jali': 'terracotta-jaali',
        'breeze-block': 'breeze-blocks',
        'roof-tile': 'roof-tiles',
        'roofing': 'roof-tiles',
        'clay-tile': 'roof-tiles',
        'floor-tile': 'floor-tiles',
        'paving': 'floor-tiles',
        'facade': 'facades',
        'louver': 'facades',
        'panel': 'facades'
    };

    // Check mapped or normalized keys
    if (map[slug]) return map[slug];
    if (CATEGORY_METADATA[normalize + 's']) return normalize + 's'; // try adding s back (singular -> plural)

    return undefined;
};

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
    const categoryKey = resolveCategoryKey(pathSlug);
    const categoryData = categoryKey ? CATEGORY_METADATA[categoryKey] : null;

    if (categoryData) {
        // Fetch products for this fallback category to get images
        const allProducts = await getProducts();
        const categoryProducts = allProducts.filter((p: any) =>
            p.category?.title === categoryData.displayTitle ||
            p.tag === categoryData.displayTitle ||
            p.category?.slug === categoryKey
        );

        // Robust Image Strategy for Categories
        const productImages = categoryProducts.map(p => p.imageUrl).filter(Boolean).slice(0, 4);
        let images = productImages.length > 0 ? (productImages as string[]) : [];

        // If no product images found, try the helper (which searches via Sanity query more broadly)
        if (images.length === 0) {
            const { getCategoryHero } = await import('@/lib/products');
            const hero = await getCategoryHero(pathSlug);
            if (hero?.imageUrl) {
                images = [hero.imageUrl];
            } else {
                // Final Fallback: Dynamic OG Generator or Static Backup
                images = [`https://claytile.in/api/og?slug=${pathSlug}&type=category`];
            }
        }

        return {
            title: categoryData.metaTitle,
            description: categoryData.metaDescription,
            keywords: Array.from(new Set([...categoryData.keywords, ...categoryProducts.map(p => p.title), 'UrbanClay', 'India'])),
            openGraph: {
                title: categoryData.metaTitle,
                description: categoryData.metaDescription,
                type: 'website',
                url: `https://claytile.in/products/${pathSlug}`,
                images: images.map(url => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: categoryData.displayTitle
                }))
            },
            twitter: {
                card: 'summary_large_image',
                images: images
            },
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

        // Clean up fallback if we want to be strict:
        if (!priceInfo) {
            delete (jsonLd as any).offers;
        }

        return (
            <div className="bg-[#1a1512] min-h-screen">
                <JsonLd data={[jsonLd, faqJsonLd]} />
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

        return (
            <div className="bg-[#1a1512] min-h-screen text-[#EBE5E0]">
                <JsonLd data={[jsonLdCat, faqJsonLd]} />
                <Header />
                <main className="pt-32 pb-20 px-6 max-w-[1800px] mx-auto min-h-screen">
                    {/* Category Hero */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-12">
                        <div>
                            <span className="text-[var(--terracotta)] font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                                Collection
                            </span>
                            <h1 className="text-4xl md:text-7xl font-serif text-[#EBE5E0] leading-[0.9] mb-6">
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

    // D. 404 (Fallback)
    notFound();
}
