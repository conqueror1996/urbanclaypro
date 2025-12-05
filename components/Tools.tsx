'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSampleBox } from '@/context/SampleContext';
import WallStyler from './WallStyler';
import { Product } from '@/lib/products';

interface ToolsProps {
    products?: Product[];
}

export default function Tools({ products = [] }: ToolsProps) {
    const { addToBox } = useSampleBox();

    // --- State ---
    const [area, setArea] = useState('');
    const [boxes, setBoxes] = useState<number | null>(null);

    // Filter products for the texture gallery
    // We want "Brick Tile" and "Exposed Brick" (loosely matched by tags or titles)
    const textureProducts = products.filter(p =>
        (p.tag?.includes('Brick') || p.title.includes('Brick') || p.tag?.includes('Facade')) && p.imageUrl
    ).slice(0, 8); // Grab top 8 for the gallery

    // Extract images for the WallStyler
    const variantImages = textureProducts.map(p => p.imageUrl || '').filter(Boolean);

    // Constants for Grout (Only needed if we are syncing state, but WallStyler handles its own state now)
    // Actually, Tools needs to control the "Finishing Touches" panel too?
    // The previous design had 3 panels: Calculator, Wall Styler Check, Finishing Touches.
    // The new WallStyler component includes Grout controls internally!
    // So we should probably consolidate. The user wants the "Wall Styler container card".

    // However, the `WallStyler` component I built (Step 519) includes:
    // 1. Variant Gallery
    // 2. Pattern Picker
    // 3. Grout Picker
    // 4. Width Slider
    // ALL in one layout.

    // So in `Tools.tsx`, I can replace the middle AND right columns with a single larger WallStyler?
    // Or just put `WallStyler` in the middle column, and remove the right column?
    // Or keep the right column for "Save Preset" only?

    // The previous `Tools.tsx` had "Finishing Touches" as a separate card.
    // My `WallStyler.tsx` duplicates these controls.
    // I should probably simplify `Tools.tsx` to:
    // Card 1: Calculator
    // Card 2 (Span 2): Advanced Wall Styler (which includes finishing touches)

    // Let's do that. It makes the UI cleaner and meets the "real product" requirement perfectly.

    // --- Logic: Coverage Calculator ---
    const calculateCoverage = () => {
        const areaValue = parseFloat(area || '0');
        const sqftPerBox = 10;
        const calculatedBoxes = Math.ceil((areaValue * 1.10) / sqftPerBox);
        setBoxes(calculatedBoxes);
    };

    const handleAddSample = () => {
        addToBox({
            id: 'sample-kit-calculator',
            name: 'Project Sample Kit',
            color: '#b45a3c',
            texture: 'Brick Texture'
        });
    };

    return (
        <section id="tools" className="bg-[var(--sand)] border-y border-[var(--line)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Planning Tools</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">Plan Your Project</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

                    {/* Tile 1: Coverage Calculator */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-transparent hover:border-[var(--line)] hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-[#f4f1ee] flex items-center justify-center text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-serif text-[#2A1E16]">Coverage Calculator</h3>
                        </div>

                        <div className="flex-grow space-y-6">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6f66] mb-2">Total Area</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-xl bg-[#f9f9f9] border-transparent focus:bg-white focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/10 transition-all outline-none text-[#2A1E16] text-lg font-medium"
                                    />
                                    <span className="flex items-center text-[#7a6f66] font-medium">sq.ft</span>
                                </div>
                            </div>

                            <button
                                onClick={calculateCoverage}
                                className="w-full py-3 rounded-xl bg-[#2A1E16] text-white font-medium hover:bg-[#4a3e36] transition-colors"
                            >
                                Calculate
                            </button>

                            {boxes !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-[#f9f9f9] rounded-xl border border-dashed border-gray-200"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-[#5d554f]">Required:</span>
                                        <span className="text-xl font-bold text-[var(--terracotta)]">{boxes} boxes</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-right mb-3">*Includes 10% wastage</p>
                                    <button
                                        onClick={handleAddSample}
                                        className="w-full py-2 text-xs font-bold uppercase tracking-wider text-[var(--terracotta)] border border-[var(--terracotta)] rounded-lg hover:bg-[var(--terracotta)] hover:text-white transition-colors"
                                    >
                                        Add Sample Kit
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Tile 2: Wall Styler (Unified) */}
                    <div className="lg:col-span-2 h-full">
                        <div className="h-full min-h-[500px]">
                            {/* We pass the fetched variant images here */}
                            <WallStyler
                                initialColor="#b45a3c"
                                variantImages={variantImages}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
