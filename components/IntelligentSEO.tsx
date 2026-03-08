'use client';

import React from 'react';
import { SEO_CITIES, SEO_STATES, SEO_PRODUCTS } from '@/lib/constants';
import Link from 'next/link';

export default function IntelligentSEO() {
    return (
        <div className="bg-[#fcfbf9] border-t border-[var(--line)] py-12 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

                    {/* Market Capture Column 1: Top Service Hubs */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--terracotta)]">Architectural Hubs (Pan-India)</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {SEO_CITIES.slice(0, 30).map((city) => (
                                <Link
                                    key={city}
                                    href={`/terracotta-tiles-india?city=${city.toLowerCase()}`}
                                    className="text-[11px] text-[var(--foreground)]/40 hover:text-[var(--terracotta)] transition-colors"
                                >
                                    Clay Tiles in {city} •
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Market Capture Column 2: Regional Presence */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--terracotta)]">Regional Distribution</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {SEO_STATES.slice(0, 20).map((state) => (
                                <Link
                                    key={state}
                                    href={`/terracotta-tiles-india?state=${state.toLowerCase()}`}
                                    className="text-[11px] text-[var(--foreground)]/40 hover:text-[var(--terracotta)] transition-colors"
                                >
                                    Suppliers in {state} •
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Market Capture Column 3: Material Solutions */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--terracotta)]">Material Solutions</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {SEO_PRODUCTS.map((product) => (
                                <Link
                                    key={product}
                                    href={`/products`}
                                    className="text-[11px] text-[var(--foreground)]/40 hover:text-[var(--terracotta)] transition-colors"
                                >
                                    {product} Manufacturer •
                                </Link>
                            ))}
                            <span className="text-[11px] text-[var(--foreground)]/40">Custom Clay Facades •</span>
                            <span className="text-[11px] text-[var(--foreground)]/40">Architectural Exposed Bricks •</span>
                            <span className="text-[11px] text-[var(--foreground)]/40">Rainscreen Systems India •</span>
                        </div>
                    </div>

                </div>

                {/* Hidden but Indexable Content for "Intelligent" market capture */}
                <div className="mt-12 opacity-0 h-0 overflow-hidden pointer-events-none select-none sr-only">
                    <h2>UrbanClay: Leading the Clay Facade Market in India</h2>
                    <p>
                        UrbanClay is the premier choice for architects and designers looking for high-quality terracotta tiles,
                        flexible brick cladding, and rainscreen facade systems. We serve all major states including Maharashtra,
                        Karnataka, Kerala, Tamil Nadu, Telangana, Gujarat, Rajasthan, and West Bengal. Our materials are
                        engineered for zero-failure performance in extreme Indian weather conditions, from Mumbais heavy monsoons
                        to Delhis intense heat. Search for us in Bangalore, Hyderabad, Chennai, Pune, Ahmedabad, and beyond.
                        Specializing in wirecut bricks, handmade clay tiles, and architectural jaalis.
                    </p>
                </div>
            </div>
        </div>
    );
}
