'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Variant {
    name: string;
    imageUrl?: string;
}

interface Collection {
    name: string;
    variants: Variant[];
}

interface ColorChipSelectorProps {
    variants?: Variant[];
    collections?: Collection[];
}

export default function ColorChipSelector({ variants = [], collections = [] }: ColorChipSelectorProps) {
    // Determine initial state
    // If we have collections, default to the first one.
    // If we have direct variants, we might want a "Standard" tab or just show them if no collections exist.

    const hasCollections = collections && collections.length > 0;
    const hasDirectVariants = variants && variants.length > 0;

    // Prepare tabs
    const tabs: { id: string; label: string; items: Variant[] }[] = [];

    if (hasDirectVariants) {
        tabs.push({ id: 'standard', label: 'Standard', items: variants });
    }

    if (hasCollections) {
        collections.forEach((c, idx) => {
            if (c.variants && c.variants.length > 0) {
                tabs.push({ id: `col-${idx}`, label: c.name, items: c.variants });
            }
        });
    }

    const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '');

    if (tabs.length === 0) {
        return <p className="text-xs text-gray-400 italic">Variations available upon request.</p>;
    }

    const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

    return (
        <div className="mt-6 pt-6 border-t border-[var(--line)]">
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-[#5d554f] uppercase tracking-widest">Natural Color Variations</p>
            </div>

            {/* TABS (Only if multiple) */}
            {tabs.length > 1 && (
                <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap pb-1 transition-colors ${activeTabId === tab.id
                                ? 'text-[var(--terracotta)] border-b-2 border-[var(--terracotta)]'
                                : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* CHIPS GRID */}
            <div className="flex flex-wrap gap-3 mb-3">
                {activeTab.items.map((variant, index) => (
                    <div key={index} className="group relative cursor-help">
                        <div
                            className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-[var(--terracotta)] overflow-hidden bg-gray-100"
                        >
                            {variant.imageUrl ? (
                                <Image
                                    src={variant.imageUrl}
                                    alt={variant.name || 'Variant'}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                            )}
                        </div>
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white bg-[#2A1E16] rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-10">
                            {variant.name}
                            <svg className="absolute text-[#2A1E16] h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                        </span>
                    </div>
                ))}
            </div>

            <p className="text-[10px] leading-relaxed text-[#7a6f66] italic">
                *Handmade clay products exhibit natural shade variation. Final shade depends on batch firing.
            </p>
        </div>
    );
}
