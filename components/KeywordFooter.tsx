'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SEO_CITIES, SEO_PRODUCTS, SEO_ADJECTIVES, SEO_APPLICATIONS } from '@/lib/constants';

// Helper to shuffle array deterministically (or just random for now is fine since it's client comp)
// Actually, for SEO consistency, it's better if these are static. We will generate a fixed set.
// But displaying 1000 links is bad UX. We will use an accordion or a clean grid.

export default function KeywordFooter() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Curated CORE combinations for first view
    const coreLinks = [
        ...SEO_PRODUCTS.slice(0, 10).map(p => ({ text: p, href: `/products?search=${encodeURIComponent(p)}` })),
        ...SEO_CITIES.slice(0, 5).map(c => ({ text: `Terracotta in ${c}`, href: `/products?search=${encodeURIComponent(`Terracotta in ${c}`)}` })),
        ...SEO_APPLICATIONS.slice(0, 5).map(a => ({ text: `${a} Cladding`, href: `/products?search=${encodeURIComponent(`${a} Cladding`)}` }))
    ];

    // Programmatic Expansion
    const expandedLinks = [
        ...SEO_PRODUCTS.slice(0, 5).flatMap(product =>
            SEO_CITIES.slice(5, 15).map(city => ({
                text: `${product} in ${city}`,
                href: `/products?search=${encodeURIComponent(`${product} in ${city}`)}`
            }))
        ),
        ...SEO_PRODUCTS.slice(0, 5).flatMap(product =>
            SEO_APPLICATIONS.slice(5, 15).map(app => ({
                text: `${product} for ${app}`,
                href: `/products?search=${encodeURIComponent(`${product} for ${app}`)}`
            }))
        ),
        ...SEO_ADJECTIVES.slice(0, 10).flatMap(adj =>
            SEO_PRODUCTS.slice(0, 3).map(product => ({
                text: `${adj} ${product}`,
                href: `/products?search=${encodeURIComponent(`${adj} ${product}`)}`
            }))
        )
    ];

    return (
        <section className="bg-[#1a1512] border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-serif text-white mb-2">Technical Index & Collections</h3>
                        <p className="text-white/40 text-sm max-w-xl">
                            Search our industrial catalog by product specification, application category, or regional availability.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--terracotta)] hover:text-white transition-colors flex items-center gap-2"
                    >
                        {isExpanded ? 'Collapse Index' : 'Expand All Collections'}
                        <span className={`text-lg transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>↓</span>
                    </button>
                </div>

                {/* Core Tags */}
                <div className="flex flex-wrap gap-2 md:gap-3 mb-8">
                    {coreLinks.map((link, i) => (
                        <Link key={i} href={link.href}
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[10px] md:text-[11px] font-medium text-gray-400 hover:text-white hover:bg-[var(--terracotta)] hover:border-[var(--terracotta)] transition-all duration-300">
                            {link.text}
                        </Link>
                    ))}
                </div>

                {/* Expanded Tags */}
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-3 transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    {expandedLinks.map((link, i) => (
                        <Link key={i} href={link.href}
                            className="text-[10px] text-white/30 hover:text-[var(--terracotta)] transition-colors py-1 truncate">
                            {link.text}
                        </Link>
                    ))}
                    {/* Extra Local SEO boost with individual cities */}
                    {SEO_CITIES.slice(15).map((city, i) => (
                        <Link key={`city-${i}`} href={`/products?search=${encodeURIComponent(`Terracotta in ${city}`)}`}
                            className="text-[10px] text-white/20 hover:text-[var(--terracotta)] transition-colors py-1 truncate">
                            Terracotta {city}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

