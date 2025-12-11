'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/products';

interface RelatedProductsProps {
    products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="mt-24">
            <h2 className="text-2xl font-serif font-bold text-[#2A1E16] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link key={product.slug} href={`/products/${product.slug}`} className="group block">
                        <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100 mb-4 border border-gray-100 group-hover:border-[var(--terracotta)] transition-colors">
                            {product.imageUrl && (
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            )}
                        </div>
                        <h3 className="font-bold text-[#2A1E16] group-hover:text-[var(--terracotta)] transition-colors truncate">{product.title}</h3>
                        <p className="text-sm text-gray-500">{product.tag}</p>
                        <p className="text-sm font-medium text-[var(--terracotta)] mt-1">{product.priceRange || 'On Request'}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
