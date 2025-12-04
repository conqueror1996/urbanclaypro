'use client';

import React, { useState } from 'react';
import WallStyler from './WallStyler';

interface ProductToolsProps {
    category: string;
    productTitle: string;
}

export default function ProductTools({ category, productTitle }: ProductToolsProps) {
    const [area, setArea] = useState('');
    const [tileBox, setTileBox] = useState('');
    const [boxes, setBoxes] = useState<number | null>(null);

    // Determine brick color based on title
    const getBrickColor = () => {
        const title = productTitle.toLowerCase();
        if (title.includes('grey') || title.includes('silver')) return '#6b7280';
        if (title.includes('chocolate') || title.includes('brown')) return '#3f2e27';
        if (title.includes('beige') || title.includes('cream')) return '#d6cbb8';
        if (title.includes('charcoal') || title.includes('black')) return '#1f2937';
        if (title.includes('white')) return '#f3f4f6';
        return '#b45a3c'; // Default Terracotta
    };

    // Only show Wall Styler for these categories
    const showWallStyler = ['Facade', 'Interior', 'Flooring', 'Contemporary', 'Brick'].some(c => category.includes(c));

    const calculateCoverage = () => {
        const areaValue = parseFloat(area || '0');
        const tileBoxValue = parseFloat(tileBox || '10');
        if (areaValue > 0 && tileBoxValue > 0) {
            const calculatedBoxes = Math.ceil((areaValue * 1.10) / tileBoxValue);
            setBoxes(calculatedBoxes);
        }
    };

    return (
        <section className="mt-10">
            <h3 className="font-bold text-lg">Plan & Visualize</h3>

            <div className="grid lg:grid-cols-2 gap-8 mt-4">
                {/* COVERAGE CALCULATOR */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-[var(--line)] h-fit">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#2A1E16]">Coverage Calculator</h4>
                            <p className="text-xs text-gray-500">Includes +10% wastage automatically</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-semibold text-[#5d554f] mb-1.5 ml-1">Total Area</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full bg-[#faf9f8] border border-gray-200 p-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/10 transition-all placeholder:text-gray-300"
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-medium text-gray-400 pointer-events-none">sq.ft</span>
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-xs font-semibold text-[#5d554f] mb-1.5 ml-1">Coverage / Box</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        placeholder="10"
                                        value={tileBox}
                                        onChange={(e) => setTileBox(e.target.value)}
                                        className="w-full bg-[#faf9f8] border border-gray-200 p-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--terracotta)] focus:ring-2 focus:ring-[var(--terracotta)]/10 transition-all placeholder:text-gray-300"
                                    />
                                    <span className="absolute right-3 top-3 text-xs font-medium text-gray-400 pointer-events-none">sq.ft</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={calculateCoverage}
                            className="w-full bg-[var(--terracotta)] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#a85638] transition-all shadow-lg shadow-orange-900/10 active:scale-[0.98]"
                        >
                            Calculate Requirements
                        </button>
                    </div>

                    {boxes !== null && (
                        <div className="mt-5 p-4 bg-[#F5EEE7] rounded-xl border border-[#e7dbd1] flex items-center justify-between">
                            <span className="text-sm font-medium text-[#5d554f]">You need approx:</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-[var(--terracotta)]">{boxes}</span>
                                <span className="text-sm font-medium text-[#5d554f]">boxes</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* WALL STYLER - Replaces Grout Advisor */}
                {showWallStyler && (
                    <div className="h-full min-h-[500px]">
                        <WallStyler initialColor={getBrickColor()} />
                    </div>
                )}
            </div>
        </section>
    );
}
