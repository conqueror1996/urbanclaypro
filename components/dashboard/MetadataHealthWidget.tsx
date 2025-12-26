'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';

interface ProductIssue {
    id: string;
    title: string;
    slug: string;
    issues: string[];
}

export default function MetadataHealthWidget() {
    const [loading, setLoading] = useState(true);
    const [issues, setIssues] = useState<ProductIssue[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const checkMetadata = async () => {
            try {
                const query = `*[_type == "product"]{
                    _id,
                    title,
                    "slug": slug.current,
                    "seoTitle": seo.metaTitle,
                    "seoDesc": seo.metaDescription,
                    "seoImage": seo.openGraphImage,
                    "variants": variants[]{ name, "image": image },
                    description
                }`;

                const products = await client.fetch(query);
                setTotalProducts(products.length);

                const detectedIssues: ProductIssue[] = [];

                products.forEach((p: any) => {
                    const productIssues: string[] = [];

                    // 1. Check Title
                    if (!p.seoTitle) {
                        productIssues.push('Missing Meta Title');
                    } else if (p.seoTitle.length < 30) {
                        productIssues.push('Meta Title too short (<30 chars)');
                    } else if (p.seoTitle.length > 60) {
                        productIssues.push('Meta Title too long (>60 chars)');
                    }

                    // 2. Check Description
                    if (!p.seoDesc) {
                        // Fallback check: is there a main description used as fallback?
                        if (!p.description) productIssues.push('Missing Meta Description');
                        else productIssues.push('Using Auto-Generated Description (Not Optimized)');
                    } else if (p.seoDesc.length < 50) {
                        productIssues.push('Meta Description too short (<50 chars)');
                    } else if (p.seoDesc.length > 160) {
                        productIssues.push('Meta Description too long (>160 chars)');
                    }

                    // 3. Check Images
                    if (!p.seoImage && (!p.variants || p.variants.length === 0)) {
                        productIssues.push('No Social Share Image');
                    }

                    if (productIssues.length > 0) {
                        detectedIssues.push({
                            id: p._id,
                            title: p.title,
                            slug: p.slug,
                            issues: productIssues
                        });
                    }
                });

                setIssues(detectedIssues);
            } catch (error) {
                console.error("Failed to fetch product metadata", error);
            } finally {
                setLoading(false);
            }
        };

        checkMetadata();
    }, []);

    if (loading) return <div className="h-48 bg-gray-50 rounded-2xl animate-pulse"></div>;

    const healthScore = totalProducts > 0
        ? Math.round(((totalProducts - issues.length) / totalProducts) * 100)
        : 100;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-[var(--ink)] text-lg">SEO Health</h3>
                    <p className="text-xs text-gray-400 mt-1">Metadata completeness check</p>
                </div>
                <div className={`text-2xl font-serif font-bold ${healthScore < 50 ? 'text-red-500' : healthScore < 80 ? 'text-orange-500' : 'text-emerald-500'}`}>
                    {healthScore}%
                </div>
            </div>

            {issues.length === 0 ? (
                <div className="text-center py-8 text-emerald-600 bg-emerald-50 rounded-xl">
                    <p className="font-bold text-sm">All products looking good! 🎉</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {issues.map((item) => (
                        <div key={item.id} className="p-3 bg-red-50/50 border border-red-100 rounded-lg group hover:bg-red-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <Link
                                    href={`/studio/structure/product;${item.id}`} // Link to Sanity Studio (Deep linking if configured, else just illustrative)
                                    target="_blank"
                                    className="font-bold text-[var(--ink)] text-sm hover:text-[var(--terracotta)] hover:underline"
                                >
                                    {item.title}
                                </Link>
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">{item.issues.length} Issues</span>
                            </div>
                            <ul className="space-y-1">
                                {item.issues.map((issue, idx) => (
                                    <li key={idx} className="text-[11px] text-red-500 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">Scanning {totalProducts} products</p>
            </div>
        </div>
    );
}
