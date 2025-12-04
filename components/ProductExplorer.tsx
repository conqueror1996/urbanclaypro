'use client';

import React, { useState, useEffect } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ColorChipSelector from './ColorChipSelector';
import Link from 'next/link';
import SampleModal from './SampleModal';

interface Product {
    title: string;
    subtitle: string;
    description: string;
    priceRange: string;
    specs: {
        size: string;
        waterAbsorption: string;
        compressiveStrength: string;
        firingTemperature: string;
        thickness?: string;
        coverage?: string;
        weight?: string;
    };
    images?: string[];
    variants?: any[];
    collections?: any[];
}

interface ProductExplorerProps {
    product: Product;
    initialVariant?: string;
    quoteUrl: string;
}

export default function ProductExplorer({ product, initialVariant, quoteUrl }: ProductExplorerProps) {
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [activeCollectionName, setActiveCollectionName] = useState<string | null>(
        product.collections?.[0]?.name || null
    );

    // Derive current data based on active collection
    const activeCollection = product.collections?.find(c => c.name === activeCollectionName);

    // Fallback to main product data if collection data is missing
    const currentDescription = activeCollection?.description || product.description;
    const currentPrice = activeCollection?.priceRange || product.priceRange;

    // Merge specs: Collection specs override Product specs
    const currentSpecs = {
        ...product.specs,
        ...(activeCollection?.specs || {})
    };

    // Handle collection change from Gallery or Chips
    // We need to sync the state between Gallery and this component if we want them to control each other.
    // Currently ProductImageGallery has its own state. 
    // Ideally, we should lift state up, but to minimize refactoring risk, we'll pass the active collection down.

    return (
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 items-start">
            {/* INTERACTIVE GALLERY */}
            <div className="lg:col-span-2">
                <ProductImageGallery
                    images={product.images || []}
                    variants={product.variants || []}
                    collections={product.collections}
                    title={product.title}
                    initialVariantName={initialVariant}
                    onCollectionChange={(name) => setActiveCollectionName(name)}
                />

                {/* Description - Dynamic based on collection */}
                <div className="mt-8 prose prose-brown max-w-none">
                    <h3 className="text-lg font-bold text-[#2A1E16] mb-2">
                        About {activeCollectionName || product.title}
                    </h3>
                    <p className="text-[#5d554f] leading-relaxed">
                        {currentDescription}
                    </p>
                </div>
            </div>

            {/* SPECS BOX */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[var(--line)] lg:sticky lg:top-28">
                <h3 className="text-lg font-bold mb-6 text-[#2A1E16] tracking-tight">
                    {activeCollectionName ? `${activeCollectionName} Specs` : 'Product Specifications'}
                </h3>

                <div className="space-y-5">
                    {/* Size */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)] mt-0.5 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-1">Size</p>
                            <p className="text-sm font-medium text-[#2A1E16]">{currentSpecs.size || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Thickness (if available) */}
                    {currentSpecs.thickness && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)] mt-0.5 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-1">Thickness</p>
                                <p className="text-sm font-medium text-[#2A1E16]">{currentSpecs.thickness}</p>
                            </div>
                        </div>
                    )}

                    {/* Water Absorption */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)] mt-0.5 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-1">Water Absorption</p>
                            <p className="text-sm font-medium text-[#2A1E16]">{currentSpecs.waterAbsorption || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Compressive Strength */}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)] mt-0.5 flex-shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-1">Compressive Strength</p>
                            <p className="text-sm font-medium text-[#2A1E16]">{currentSpecs.compressiveStrength || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Firing Temp (if available) */}
                    {currentSpecs.firingTemperature && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)] mt-0.5 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-1">Firing Temperature</p>
                                <p className="text-sm font-medium text-[#2A1E16]">{currentSpecs.firingTemperature}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Color Chips (Hidden for Roof/Jaali as per original logic, but we can keep it if needed) */}
                {/* Note: ProductImageGallery already shows variants, so we might not need this duplicate selector unless desired. 
                    The original design had it. Let's keep it if it adds value, or rely on the Gallery.
                    For now, I'll omit it to avoid clutter since Gallery handles selection.
                */}

                <div className="mt-6 pt-6 border-t border-[var(--line)]">
                    <p className="text-xs font-semibold text-[#5d554f] uppercase tracking-wider mb-2">Price Range</p>
                    <p className="text-2xl text-[var(--terracotta)] font-bold tracking-tight">{currentPrice}</p>
                </div>

                <div className="flex flex-col gap-3 mt-8">
                    <Link href={quoteUrl} className="w-full bg-[var(--terracotta)] text-white px-6 py-4 rounded-xl text-base font-semibold text-center hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/10 flex items-center justify-center gap-2 hover:shadow-xl hover:scale-[1.02]">
                        <span>Get a Quote</span>
                        <span className="text-xl">→</span>
                    </Link>
                    <button
                        onClick={() => setIsSampleModalOpen(true)}
                        className="w-full bg-transparent border-2 border-[#e7dbd1] text-[#5d554f] px-6 py-3.5 rounded-xl text-base font-medium text-center hover:border-[var(--terracotta)] hover:text-[var(--terracotta)] transition-all flex items-center justify-center gap-2 hover:bg-[var(--sand)]"
                    >
                        <span>Request Free Sample</span>
                    </button>
                </div>
            </div>

            <SampleModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                initialRequirements={`${product.title}${activeCollectionName ? ` - ${activeCollectionName}` : ''}`}
            />
        </div>
    );
}
