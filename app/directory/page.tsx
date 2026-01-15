import React from 'react';
import Link from 'next/link';
import { SEO_CITIES, SEO_PRODUCTS, SEO_ADJECTIVES, SEO_APPLICATIONS } from '@/lib/constants';



export default function DirectoryPage() {
    return (
        <main className="min-h-screen bg-[#1a1512] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16">

                <div className="border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif mb-4">Product Directory</h1>
                    <p className="text-white/60 text-lg max-w-2xl">
                        Index of UrbanClay's distribution network and application guidelines.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {SEO_PRODUCTS.map((product, i) => (
                        <div key={i} className="group">
                            <h2 className="text-2xl font-serif text-[var(--terracotta)] mb-6 flex items-center gap-3">
                                {product}
                                <div className="h-px bg-white/10 flex-1 group-hover:bg-[var(--terracotta)]/30 transition-colors" />
                            </h2>

                            <div className="space-y-6">
                                {/* Locations */}
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Available In</h3>
                                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-zinc-500 leading-relaxed">
                                        {SEO_CITIES.map((city, j) => (
                                            <React.Fragment key={j}>
                                                <Link
                                                    href={`/products?search=${encodeURIComponent(`${product} in ${city}`)}`}
                                                    className="hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-px"
                                                >
                                                    {city}
                                                </Link>
                                                {j < SEO_CITIES.length - 1 && <span className="text-zinc-800">•</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {/* Applications */}
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Applications</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {SEO_APPLICATIONS.map((app, k) => (
                                            <Link
                                                key={k}
                                                href={`/products?search=${encodeURIComponent(`${product} for ${app}`)}`}
                                                className="inline-block px-2 py-1 bg-white/5 rounded text-[10px] text-zinc-400 hover:text-white hover:bg-[var(--terracotta)] transition-colors"
                                            >
                                                {app}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
