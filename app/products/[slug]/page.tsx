import JsonLd from '@/components/JsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProduct } from '@/lib/products';
import ProductTools from '@/components/ProductTools';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductShowcase from '@/components/ProductShowcase';
import ProductExplorer from '@/components/ProductExplorer';
import ColorChipSelector from '@/components/ColorChipSelector';

import { Metadata } from 'next';

// Force dynamic rendering since we're fetching data
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        return {
            title: 'Product Not Found | UrbanClay',
        };
    }

    return {
        title: `${product.title} - ${product.subtitle} | UrbanClay India`,
        description: product.description,
        keywords: [product.title, product.tag, 'Terracotta Tiles', 'Clay Bricks', 'UrbanClay', 'India', 'Architectural Cladding'],
        alternates: {
            canonical: `https://urbanclay.in/products/${slug}`,
        },
        openGraph: {
            title: `${product.title} | Premium Terracotta by UrbanClay`,
            description: product.description,
            url: `https://urbanclay.in/products/${slug}`,
            siteName: 'UrbanClay',
            images: product.imageUrl ? [
                {
                    url: product.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: product.title,
                }
            ] : [],
            locale: 'en_IN',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.title} | UrbanClay`,
            description: product.description,
            images: product.imageUrl ? [product.imageUrl] : [],
        },
    };
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { variant } = await searchParams;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.imageUrl ? [product.imageUrl] : [],
        description: product.description,
        sku: product.slug,
        mpn: product.slug,
        category: product.tag,
        brand: {
            '@type': 'Brand',
            name: 'UrbanClay',
            logo: 'https://urbanclay.in/urbanclay-logo.png'
        },
        offers: {
            '@type': 'Offer',
            url: `https://urbanclay.in/products/${slug}`,
            priceCurrency: 'INR',
            price: product.priceRange.replace(/[^0-9]/g, '').slice(0, 3) || '100',
            priceValidUntil: '2025-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'UrbanClay'
            }
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            reviewCount: '89'
        },
        review: {
            '@type': 'Review',
            reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5'
            },
            author: {
                '@type': 'Person',
                name: 'Verified Architect'
            }
        }
    };

    const whatsappMessage = `Hi UrbanClay, I'm interested in ${product.title}${typeof variant === 'string' ? ` (${variant})` : ''}. Please share more details.`;
    const whatsappUrl = `https://wa.me/918080081951?text=${encodeURIComponent(whatsappMessage)}`;
    const quoteUrl = `/?product=${encodeURIComponent(product.title)}${typeof variant === 'string' ? `&variant=${encodeURIComponent(variant)}` : ''}#quote`;

    const faqs = [
        {
            question: "Which adhesive do you recommend?",
            answer: "Kerakoll H14/H40 depending on substrate; see install guide."
        },
        {
            question: "Lead time & logistics?",
            answer: "Typically 7–10 days; Pan-India shipping with moisture-safe packing."
        },
        {
            question: "Recoating & maintenance?",
            answer: "Water-repellent coat every 8–10 years, mild detergent cleaning."
        }
    ];

    return (
        <div className="bg-[#F5EEE7] text-[#2A1E16] min-h-screen overflow-x-hidden">
            <JsonLd data={jsonLd} />
            <Header />

            {/* MAIN CONTENT */}
            <main className="px-4 sm:px-6 md:px-10 max-w-6xl mx-auto pb-32 pt-24 sm:pt-28">
                {/* Breadcrumbs */}
                <div className="mb-6">
                    <Breadcrumbs />
                </div>

                {/* Title Section */}
                <div className="mb-4 md:mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1E16] leading-tight">
                        {product.title}
                    </h1>
                    <p className="text-sm sm:text-base text-[#5d554f] mt-2 font-light tracking-wide">
                        {product.subtitle}
                    </p>
                </div>

                {/* HERO + SPECS + EXPLORER */}
                <ProductExplorer
                    product={product}
                    initialVariant={typeof variant === 'string' ? variant : undefined}
                    quoteUrl={quoteUrl}
                />

                {/* INTERACTIVE TOOLS */}
                {/* Pass image URL and variant images to ProductTools */}
                <ProductTools
                    category={product.tag}
                    productTitle={product.title}
                    productImageUrl={product.imageUrl}
                    variantImages={product.variants?.map(v => v.imageUrl).filter(Boolean)}
                />

                {/* RELATED PROJECTS SHOWCASE */}
                {product.relatedProjects && product.relatedProjects.length > 0 && (
                    <ProductShowcase projects={product.relatedProjects} />
                )}

                {/* DOWNLOADS & RESOURCES */}
                {(product.resources?.technicalSheets?.length || product.resources?.bimModels?.length || product.resources?.productCatalogues?.length) ? (
                    <section className="mt-10 space-y-8">
                        {/* Technical Sheets */}
                        {product.resources?.technicalSheets && product.resources.technicalSheets.length > 0 && (
                            <div>
                                <h3 className="font-bold text-lg mb-4">Technical Sheets</h3>
                                <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] divide-y divide-gray-100">
                                    {product.resources.technicalSheets.map((resource, idx) => (
                                        <a key={idx} href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-[var(--sand)] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">{resource.title}</p>
                                                    <p className="text-xs text-gray-500">PDF • Download</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-[#5d554f] font-medium group-hover:translate-x-1 transition-transform">Download →</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BIM & 3D Models */}
                        {product.resources?.bimModels && product.resources.bimModels.length > 0 && (
                            <div>
                                <h3 className="font-bold text-lg mb-4">BIM & 3D Models</h3>
                                <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] divide-y divide-gray-100">
                                    {product.resources.bimModels.map((resource, idx) => (
                                        <a key={idx} href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-[var(--sand)] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">{resource.title}</p>
                                                    <p className="text-xs text-gray-500">3D Asset • Download</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-[#5d554f] font-medium group-hover:translate-x-1 transition-transform">Download →</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Product Catalogues */}
                        {product.resources?.productCatalogues && product.resources.productCatalogues.length > 0 && (
                            <div>
                                <h3 className="font-bold text-lg mb-4">Product Catalogues</h3>
                                <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] divide-y divide-gray-100">
                                    {product.resources.productCatalogues.map((resource, idx) => (
                                        <a key={idx} href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 hover:bg-[var(--sand)] transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-orange-50 text-orange-500 rounded-lg">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors">{resource.title}</p>
                                                    <p className="text-xs text-gray-500">Catalogue • Download</p>
                                                </div>
                                            </div>
                                            <span className="text-sm text-[#5d554f] font-medium group-hover:translate-x-1 transition-transform">Download →</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                ) : null}

                {/* FAQ */}
                <section className="mt-10">
                    <h3 className="font-bold text-lg">FAQs</h3>

                    <div className="mt-4 space-y-3">
                        {faqs.map((faq, index) => (
                            <details key={index} className="bg-white p-4 rounded-xl shadow-sm border border-[var(--line)] group">
                                <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                                    {faq.question}
                                    <span className="transform group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="text-sm mt-2 text-[#5d554f] leading-relaxed">{faq.answer}</p>
                            </details>
                        ))}
                    </div>
                </section>
            </main>

            <div className="pb-20">
                <Footer />
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map(faq => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer
                            }
                        }))
                    })
                }}
            />

            {/* STICKY FOOTER CTA */}
            <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur py-3 border-t flex justify-center gap-3 z-40 shadow-[0_-2px_10px_-1px_rgba(0,0,0,0.05)]">
                <Link href={quoteUrl} className="bg-[var(--terracotta)] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#a85638] transition-colors shadow-md shadow-orange-900/10">
                    Get Quote
                </Link>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#f0e8e2] text-[#5d554f] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#e7dbd1] transition-colors"
                >
                    WhatsApp
                </a>
            </footer>
        </div>
    );
}
