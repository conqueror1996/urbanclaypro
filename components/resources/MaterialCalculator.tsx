'use client';

import React, { useState, useEffect } from 'react';

export default function MaterialCalculator() {
    const [area, setArea] = useState<number>(100);
    const [unit, setUnit] = useState<'sqft' | 'sqm'>('sqft');
    const [productType, setProductType] = useState('brick'); // brick, tile, jaali
    const [brickSize, setBrickSize] = useState({ l: 230, h: 75, w: 105 }); // mm
    const [jointSize, setJointSize] = useState(10); // mm
    const [wastage, setWastage] = useState(5); // %

    const [result, setResult] = useState<number>(0);

    useEffect(() => {
        calculate();
    }, [area, unit, productType, brickSize, jointSize, wastage]);

    const calculate = () => {
        // Convert Area to Sq.mm
        let areaInSqMm = unit === 'sqft' ? area * 92903 : area * 1000000;

        // Calculate Area of 1 Brick including joint
        // (L + Joint) * (H + Joint)
        const brickAreaWithJoint = (brickSize.l + jointSize) * (brickSize.h + jointSize);

        // Raw count
        const rawCount = areaInSqMm / brickAreaWithJoint;

        // Add wastage
        const totalCount = rawCount * (1 + wastage / 100);

        setResult(Math.ceil(totalCount));
    };

    return (
        <div className="w-full bg-[#E8E6E1] text-[#111] p-8 md:p-12 relative overflow-hidden font-sans border-2 border-black/10">

            {/* Background Graphic */}
            <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-9xl font-bold pointer-events-none select-none">
                CALC
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16">

                {/* INPUTS */}
                <div className="space-y-8">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-2 block">Utility Tool</span>
                        <h2 className="text-4xl font-serif font-black uppercase tracking-tight leading-none mb-4">
                            Material Quantifier
                        </h2>
                        <p className="text-sm font-mono text-neutral-600 max-w-md">
                            Estimate material requirements based on standard masonry bonds and variable joint widths.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">

                        {/* Area Input */}
                        <div className="col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Total Wall Area</label>
                            <div className="flex border-b-2 border-black focus-within:border-[var(--terracotta)] transition-colors">
                                <input
                                    type="number"
                                    value={area}
                                    onChange={(e) => setArea(Number(e.target.value))}
                                    className="w-full bg-transparent text-4xl font-mono font-bold py-2 focus:outline-none placeholder-neutral-300"
                                />
                                <select
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value as 'sqft' | 'sqm')}
                                    className="bg-transparent font-bold text-sm uppercase focus:outline-none cursor-pointer"
                                >
                                    <option value="sqft">SQ.FT</option>
                                    <option value="sqm">SQ.M</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Type Selection */}
                        <div className="col-span-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-3">System Type</label>
                            <div className="flex gap-4">
                                {['brick', 'tile', 'jaali'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setProductType(type);
                                            // Reset default sizes
                                            if (type === 'brick') setBrickSize({ l: 230, h: 75, w: 105 });
                                            if (type === 'tile') setBrickSize({ l: 230, h: 20, w: 18 }); // height often 55 or 75
                                            if (type === 'jaali') setBrickSize({ l: 200, h: 200, w: 60 });
                                        }}
                                        className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${productType === type ? 'bg-black text-[#E8E6E1] border-black' : 'bg-transparent border-black/20 text-neutral-500 hover:border-black'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dimensions (Auto/Manual) */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Length (mm)</label>
                            <input
                                type="number"
                                value={brickSize.l}
                                onChange={(e) => setBrickSize({ ...brickSize, l: Number(e.target.value) })}
                                className="w-full bg-white/50 border border-black/10 p-3 font-mono text-lg font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Height (mm)</label>
                            <input
                                type="number"
                                value={brickSize.h}
                                onChange={(e) => setBrickSize({ ...brickSize, h: Number(e.target.value) })}
                                className="w-full bg-white/50 border border-black/10 p-3 font-mono text-lg font-bold"
                            />
                        </div>

                        {/* Technical Vars */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Joint (mm)</label>
                            <input
                                type="number"
                                value={jointSize}
                                onChange={(e) => setJointSize(Number(e.target.value))}
                                className="w-full bg-white/50 border border-black/10 p-3 font-mono text-lg font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2">Wastage (%)</label>
                            <input
                                type="number"
                                value={wastage}
                                onChange={(e) => setWastage(Number(e.target.value))}
                                className="w-full bg-white/50 border border-black/10 p-3 font-mono text-lg font-bold"
                            />
                        </div>

                    </div>
                </div>

                {/* OUTPUT */}
                <div className="flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-black/10 pt-8 lg:pt-0 lg:pl-12">

                    <div className="text-center lg:text-right mb-12">
                        <span className="block text-xs font-bold uppercase tracking-widest text-[var(--terracotta)] mb-2">Estimated Requirement</span>
                        <div className="text-9xl font-serif font-black leading-none tracking-tight">
                            {result.toLocaleString()}
                        </div>
                        <span className="text-xl font-mono text-neutral-400 font-bold tracking-widest uppercase">Units</span>
                    </div>

                    <button className="bg-black text-white px-8 py-4 uppercase tracking-[0.2em] text-xs hover:bg-[var(--terracotta)] transition-all flex items-center gap-3">
                        <span>Save Calculation</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </button>

                    <p className="mt-8 text-[10px] text-neutral-500 max-w-xs text-center lg:text-right font-mono">
                        *Approximation only. Actual site conditions, breakage during transit (typically 2-3%), and specialized bonding patterns may affect final quantity.
                    </p>

                </div>

            </div>
        </div>
    );
}
