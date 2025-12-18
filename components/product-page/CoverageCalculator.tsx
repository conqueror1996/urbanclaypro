'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoverageCalculatorProps {
    productDimensions?: string; // e.g., "230mm x 105mm x 75mm" or "230mm x 75mm x 18mm"
}

export default function CoverageCalculator({ productDimensions }: CoverageCalculatorProps) {
    const [area, setArea] = useState('');
    const [pieces, setPieces] = useState<number | null>(null);
    const [boxes, setBoxes] = useState<number | null>(null);

    // Parse product dimensions to calculate area per piece in sq.ft
    const getAreaPerPiece = (): number => {
        if (!productDimensions) return 0;

        // Extract length and width from dimensions string (e.g., "230mm x 105mm x 75mm")
        const match = productDimensions.match(/(\d+\.?\d*)\s*mm\s*x\s*(\d+\.?\d*)\s*mm/i);
        if (!match) return 0;

        const lengthMm = parseFloat(match[1]);
        const widthMm = parseFloat(match[2]);

        // Convert mm² to sq.ft (1 sq.ft = 92903.04 mm²)
        const areaInSqFt = (lengthMm * widthMm) / 92903.04;
        return areaInSqFt;
    };

    const calculateCoverage = () => {
        const areaValue = parseFloat(area || '0');
        const areaPerPiece = getAreaPerPiece();

        if (areaValue > 0 && areaPerPiece > 0) {
            // Calculate pieces with 10% wastage
            const calculatedPieces = Math.ceil((areaValue * 1.10) / areaPerPiece);
            setPieces(calculatedPieces);

            // Calculate boxes (assuming 100 pieces per box as standard)
            const piecesPerBox = 100;
            const calculatedBoxes = Math.ceil(calculatedPieces / piecesPerBox);
            setBoxes(calculatedBoxes);
        } else {
            setPieces(null);
            setBoxes(null);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Estimator</span>
                    <h3 className="font-serif text-2xl text-[#2A1E16]">Quantity Calculator</h3>
                </div>
                <span className="text-[10px] font-bold bg-[#EBE5E0] text-[#5d554f] px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Inc. 10% Wastage
                </span>
            </div>

            <div className="flex-1 space-y-6">
                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-bold text-[#5d554f] mb-2 uppercase tracking-wider flex justify-between">
                            Total Wall Area
                            <span className="text-gray-300 font-normal normal-case">In square feet</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                placeholder="e.g. 150"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full bg-[#FAF7F5] border border-transparent hover:border-[#e9e2da] focus:border-[var(--terracotta)] focus:bg-white p-4 pr-16 rounded-xl text-xl font-medium focus:outline-none transition-all placeholder:text-gray-300"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none uppercase bg-white/50 px-2 py-1 rounded">sq.ft</span>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {pieces !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#2A1E16] text-white rounded-xl p-6 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
                            </div>
                            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-3">Quantity Required</p>

                            {/* Pieces */}
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-5xl font-bold text-[var(--terracotta)]">{pieces.toLocaleString()}</span>
                                <span className="text-lg font-serif">Pieces</span>
                            </div>

                            <p className="text-[10px] text-white/40">Based on {area} sq.ft with 10% wastage. Consult your contractor for precision.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {pieces === null && (
                    <button
                        onClick={calculateCoverage}
                        disabled={!area || !productDimensions}
                        className="w-full py-4 bg-[var(--terracotta)] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-bold tracking-wide hover:bg-[#a85638] transition-all shadow-md mt-2"
                    >
                        Calculate Quantity
                    </button>
                )}

                {pieces !== null && (
                    <button
                        onClick={calculateCoverage}
                        className="w-full py-3 bg-gray-100 text-gray-500 hover:text-[#2A1E16] rounded-xl font-bold tracking-wide transition-all text-sm"
                    >
                        Recalculate
                    </button>
                )}
            </div>
        </div>
    );
}
