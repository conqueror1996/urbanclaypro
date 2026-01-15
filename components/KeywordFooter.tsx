import React from 'react';
import Link from 'next/link';
import { SEO_CITIES, SEO_PRODUCTS, SEO_ADJECTIVES, SEO_APPLICATIONS } from '@/lib/constants';

// Helper to shuffle array deterministically (or just random for now is fine since it's client comp)
// Actually, for SEO consistency, it's better if these are static. We will generate a fixed set.
// But displaying 1000 links is bad UX. We will use an accordion or a clean grid.

export default function KeywordFooter() {
    // Generate Combinations
    // 1. Product + City (Top 10 Cities x Top 5 Products = 50 links)
    // 2. Adjective + Product (Top 10 Adjectives x Top 10 Products = 100 links)
    // 3. Product + Application (Top 10 Products x Top 10 Applications = 100 links)

    // We will render a curated selection to avoid spam look.

    // Optimized Limits for Aesthetics (Tag Cloud)
    const cityLinks = SEO_PRODUCTS.slice(0, 4).flatMap(product =>
        SEO_CITIES.slice(0, 5).map(city => ({
            text: `${product} in ${city}`,
            href: `/products?search=${encodeURIComponent(`${product} in ${city}`)}`
        }))
    );

    const appLinks = SEO_PRODUCTS.slice(0, 5).flatMap(product =>
        SEO_APPLICATIONS.slice(0, 5).map(app => ({
            text: `${product} for ${app}`,
            href: `/products?search=${encodeURIComponent(`${product} for ${app}`)}`
        }))
    );

    const styleLinks = SEO_ADJECTIVES.slice(0, 8).flatMap(adj =>
        SEO_PRODUCTS.slice(0, 3).map(product => ({
            text: `${adj} ${product}`,
            href: `/products?search=${encodeURIComponent(`${adj} ${product}`)}`
        }))
    );

    return (
        <section className="bg-[#1a1512] border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h3 className="text-xl font-serif text-white mb-2">Explore Collections</h3>
                    <p className="text-white/40 text-sm">
                        Curated selection of our premium clay products.
                    </p>
                </div>

                {/* Clean, Curated Tag Cloud - ONLY Core Products */}
                <div className="flex flex-wrap gap-3">
                    {SEO_PRODUCTS.map((p, i) => (
                        <Link key={i} href={`/products?search=${encodeURIComponent(p)}`}
                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] transition-all duration-300">
                            {p}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

