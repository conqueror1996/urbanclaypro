'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our Toolkit Configuration
type BrickTone = 'terracotta' | 'antique' | 'cocoa';
type BondPattern = 'stack' | 'stretcher' | 'flemish' | 'english';
type GroutSize = 0 | 5 | 10 | 15;
type GroutColor = '#e5e5e5' | '#666666' | '#1a1a1a' | '#bf5b3b';

const BRICK_RATIO = 230 / 75; // Standard Brick Aspect Ratio (230mm x 75mm)
const BRICK_HEIGHT = 45;
const BRICK_WIDTH_STRETCHER = 135; // 3:1 Ratio
const BRICK_WIDTH_HEADER = 65;

export default function ArchitectsToolkit() {
    // State
    const [tone, setTone] = useState<BrickTone>('terracotta');
    const [bond, setBond] = useState<BondPattern>('stretcher');
    const [groutSize, setGroutSize] = useState<GroutSize>(10);
    const [groutColor, setGroutColor] = useState<GroutColor>('#e5e5e5');
    const [showDimensions, setShowDimensions] = useState(false);
    const [activeTab, setActiveTab] = useState<'tone' | 'bond' | 'grout'>('tone');

    // Configuration Data
    const brickTones = [
        { id: 'terracotta', label: 'Natural Red', color: 'bg-[#B14A2A]' },
        { id: 'antique', label: 'Antique Beige', color: 'bg-[#d8b09a]' },
        { id: 'cocoa', label: 'Burnt Cocoa', color: 'bg-[#5c4033]' },
    ];

    const bondPatterns = [
        { id: 'stretcher', label: 'Stretcher', desc: 'Running bond' },
        { id: 'stack', label: 'Stack', desc: 'Aligned grid' },
        { id: 'flemish', label: 'Flemish', desc: 'Header-stretch' },
        { id: 'english', label: 'English', desc: 'Alt courses' },
    ];

    const groutColors = [
        { color: '#e5e5e5', label: 'Light' },
        { color: '#9ca3af', label: 'Grey' },
        { color: '#1a1a1a', label: 'Dark' },
        { color: '#bf5b3b', label: 'Match' },
    ];

    return (
        <section className="section-padding bg-[#F5F2F0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">

                {/* Section Header */}
                <div className="mb-8 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 text-center md:text-left">
                    <div>
                        <span className="text-[var(--terracotta)] font-semibold tracking-widest uppercase text-[10px] md:text-xs mb-2 md:mb-4 block">
                            Interactive Visualizer
                        </span>
                        <h2 className="mb-2 md:mb-4 font-extrabold text-[#1a1512]">
                            The Architect's Toolkit
                        </h2>
                        <p className="text-[#1a1512]/80 max-w-xl leading-relaxed text-sm md:text-base mx-auto md:mx-0 font-normal">
                            Visualize high-precision clay systems. Calibrate bond patterns, grout thickness, and mortar tones with 100% confidence.
                        </p>
                    </div>
                </div>

                {/* Toolkit Interface - MOBILE REDESIGN */}
                <div className="block lg:hidden space-y-4">
                    {/* 1. Visualization Canvas (Top Focus) */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-xl relative border border-[#1a1512]/5 h-[280px]">
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={() => setShowDimensions(!showDimensions)}
                                className={`p-2 rounded-full backdrop-blur-md border transition-all ${showDimensions ? 'bg-[#1a1512] text-white' : 'bg-white/80 text-[#1a1512]'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </button>
                        </div>

                        <div className="flex-1 w-full h-full relative overflow-hidden" style={{ backgroundColor: groutColor }}>
                            <BrickWall tone={tone} bond={bond} groutSize={groutSize} brickColor={brickTones.find(t => t.id === tone)?.color || ''} />
                            {/* Scale Indicator */}
                            <div className="absolute bottom-10 left-4 bg-[#1a1512] text-white text-[8px] px-2 py-0.5 rounded z-20 font-medium">
                                Scale 1:10 | 9&quot; x 3&quot;
                            </div>
                            <AnimatePresence>
                                {showDimensions && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 pointer-events-none">
                                        <div className="w-full h-full opacity-10" style={{ backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Current Spec Mini-Banner */}
                        <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 p-2 flex justify-around text-[10px] font-bold text-[#1a1512]/60">
                            <span>{tone.toUpperCase()}</span>
                            <span>{bond.toUpperCase()}</span>
                            <span>{groutSize}MM JOINT</span>
                        </div>
                    </div>

                    {/* 2. Step Selector (Tabs) */}
                    <div className="flex bg-[#1a1512]/5 p-2 rounded-xl">
                        {(['tone', 'bond', 'grout'] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`flex-1 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${activeTab === t ? 'bg-white text-[#1a1512] shadow-sm' : 'text-[#1a1512]/40'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* 3. Active Tab Controls */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#1a1512]/5 min-h-[160px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'tone' && (
                                <motion.div key="tone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-3 gap-4">
                                    {brickTones.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id as BrickTone)}
                                            className={`relative h-16 rounded-lg border-2 transition-all ${tone === t.id ? 'border-[var(--terracotta)]' : 'border-transparent'} ${t.color}`}
                                        >
                                            <span className={`text-[10px] font-semibold uppercase absolute bottom-2 inset-x-0 text-center ${t.id === 'antique' ? 'text-black' : 'text-white'}`}>{t.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                            {activeTab === 'bond' && (
                                <motion.div key="bond" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-2 gap-2">
                                    {bondPatterns.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => setBond(b.id as BondPattern)}
                                            className={`py-4 px-2 rounded-lg border text-xs font-semibold transition-all ${bond === b.id ? 'bg-[#1a1512] text-white border-[#1a1512]' : 'bg-white text-[#1a1512] border-gray-100'}`}
                                        >
                                            {b.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                            {activeTab === 'grout' && (
                                <motion.div key="grout" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2"><span>Joint: {groutSize}mm</span></div>
                                        <input type="range" min="0" max="15" step="5" value={groutSize} onChange={(e) => setGroutSize(Number(e.target.value) as GroutSize)} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none accent-[var(--terracotta)]" />
                                    </div>
                                    <div className="flex gap-4">
                                        {groutColors.map((g) => (
                                            <button key={g.color} onClick={() => setGroutColor(g.color as GroutColor)} className={`w-10 h-10 rounded-full border-2 transition-all ${groutColor === g.color ? 'border-[#1a1512] scale-110' : 'border-transparent'}`} style={{ backgroundColor: g.color }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button className="w-full bg-[var(--terracotta)] text-white py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform">
                        Download Technical Spec Sheet
                    </button>
                </div>

                {/* Toolkit Interface - DESKTOP MODE (HIDDEN ON MOBILE) */}
                <div className="hidden lg:grid grid-cols-12 gap-8 h-[700px]">
                    {/* Controls Panel */}
                    <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-xl border border-[#1a1512]/5 flex flex-col h-full overflow-y-auto">
                        <div className="space-y-12">
                            {/* 1. Brick Tone */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a1512]/40 mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#1a1512] text-white flex items-center justify-center text-[10px]">1</span>
                                    Select Tone
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {brickTones.map((t) => (
                                        <button key={t.id} onClick={() => setTone(t.id as BrickTone)} className={`relative h-20 rounded-xl border-2 transition-all flex items-end p-2 ${tone === t.id ? 'border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/20' : 'border-transparent opacity-70'} ${t.color}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${t.id === 'antique' ? 'text-black' : 'text-white'}`}>{t.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 2. Bond Pattern */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a1512]/40 mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#1a1512] text-white flex items-center justify-center text-[10px]">2</span>
                                    Bond Configuration
                                </h3>
                                <div className="space-y-2">
                                    {bondPatterns.map((b) => (
                                        <button key={b.id} onClick={() => setBond(b.id as BondPattern)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex justify-between items-center ${bond === b.id ? 'bg-[#1a1512] text-white border-[#1a1512]' : 'bg-white text-[#1a1512] border-gray-100 hover:border-gray-300'}`}>
                                            <span className="font-serif font-medium">{b.label}</span>
                                            <span className="text-xs opacity-40">{b.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* 3. Grout Settings */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a1512]/40 mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#1a1512] text-white flex items-center justify-center text-[10px]">3</span>
                                    Mortar Specification
                                </h3>
                                <div className="space-y-6">
                                    <div><div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>Joint Size</span><span>{groutSize}mm</span></div><input type="range" min="0" max="15" step="5" value={groutSize} onChange={(e) => setGroutSize(Number(e.target.value) as GroutSize)} className="w-full h-2 bg-gray-100 rounded-lg appearance-none accent-[var(--terracotta)]" /></div>
                                    <div className="flex gap-4">
                                        {groutColors.map((g) => (
                                            <button key={g.color} onClick={() => setGroutColor(g.color as GroutColor)} className={`w-10 h-10 rounded-full border-2 transition-all ${groutColor === g.color ? 'border-[#1a1512] scale-110' : 'border-transparent'}`} style={{ backgroundColor: g.color }} title={g.label} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualization Canvas */}
                    <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-[#1a1512]/5 flex flex-col">
                        <div className="absolute top-6 right-6 z-20"><button onClick={() => setShowDimensions(!showDimensions)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${showDimensions ? 'bg-[#1a1512] text-white' : 'bg-white/80 text-[#1a1512] hover:bg-white'}`}>{showDimensions ? 'Hide Grid' : 'Show Grid'}</button></div>
                        <div className="flex-1 w-full h-full relative" style={{ backgroundColor: groutColor }}>
                            <BrickWall tone={tone} bond={bond} groutSize={groutSize} brickColor={brickTones.find(t => t.id === tone)?.color || ''} />
                            {/* Scale Indicator */}
                            <div className="absolute bottom-4 left-4 bg-[#1a1512] text-white text-[9px] md:text-[10px] px-2 py-1 rounded z-20 font-medium">
                                Scale: 1:10 (Approx) | Brick: 9&quot; x 3&quot;
                            </div>
                        </div>
                        <div className="bg-white border-t border-gray-100 p-4 flex justify-between items-center text-xs text-gray-500">
                            <div className="flex gap-6"><span><strong>Pattern:</strong> {bondPatterns.find(b => b.id === bond)?.label}</span><span><strong>Joint:</strong> {groutSize}mm</span><span><strong>Est. Bricks/m²:</strong> ~48</span></div>
                            <button className="text-[var(--terracotta)] font-bold hover:underline">Download Spec Sheet</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Sub-component to handle the complex CSS Grid / Flex logic for patterns
function BrickWall({ tone, bond, groutSize, brickColor }: { tone: BrickTone, bond: BondPattern, groutSize: number, brickColor: string }) {

    // We simulate a wall by creating rows
    // Standard Brick: 230mm x 75mm
    // We use relative units (rem or %) or just CSS Grid fr units.
    // Let's use CSS Grid for robustness.

    // Actually, for patterns like Flemish/English which vary per row, 
    // we might need row-based rendering.

    const rows = 12; // Adjusted for new proportions

    // Grout spacing in pixels (scaled)
    const gap = groutSize * 0.4;

    return (
        <div className="w-full h-full flex flex-col justify-center overflow-hidden" style={{ gap: `${gap}px`, padding: '0px' }}>
            {Array.from({ length: rows }).map((_, r) => (
                <Row
                    key={r}
                    rowIdx={r}
                    bond={bond}
                    brickColor={brickColor}
                    gap={gap}
                    height={BRICK_HEIGHT}
                    tone={tone}
                />
            ))}
        </div>
    );
}

function Row({ rowIdx, bond, brickColor, gap, height, tone }: any) {
    // Generate brick sequence for this row based on bond
    let bricks: ('stretcher' | 'header')[] = [];

    if (bond === 'stack') {
        bricks = Array(15).fill('stretcher');
    } else if (bond === 'stretcher') {
        // Offset every other row
        bricks = Array(15).fill('stretcher');
    } else if (bond === 'flemish') {
        // Alternating Header/Stretcher
        // Row 1: S H S H...
        // Row 2: Might be offset? Usually Flemish is same pattern per row but offset to center header over stretcher.
        // Simplified Flemish: S H S H...
        bricks = Array(12).fill(null).flatMap(() => ['stretcher', 'header']);
    } else if (bond === 'english') {
        // Row 1: S S S...
        // Row 2: H H H...
        bricks = rowIdx % 2 === 0 ? Array(15).fill('stretcher') : Array(25).fill('header');
    }

    // Offset logic for Stretcher/Flemish
    const isOffset = (bond === 'stretcher' || bond === 'flemish' || bond === 'stack' === false) && rowIdx % 2 !== 0;

    // CSS Texture classes for realism
    const textureBase = "relative rounded-[3px] shadow-sm";

    // We handle offset by margin-left on the first brick or using a transform
    // Using a flex row

    return (
        <div
            className="flex w-[120%] -ml-[10%] flex-shrink-0" // flex-shrink-0 prevents vertical squishing
            style={{
                gap: `${gap}px`,
                height: `${height}px`,
                transform: isOffset && bond === 'stretcher' ? 'translateX(-67.5px)' :
                    isOffset && bond === 'flemish' ? 'translateX(-50px)' : 'none'
            }}
        >
            {bricks.map((type, i) => {
                // Deterministic subtle variation to prevent hydration mismatch
                const pseudoRandom = (rowIdx * 17 + i * 31) % 100;
                const randomLight = pseudoRandom > 50 ? 'brightness-105' : 'brightness-95';
                const width = type === 'stretcher' ? `${BRICK_WIDTH_STRETCHER}px` : `${BRICK_WIDTH_HEADER}px`;

                return (
                    <div
                        key={i}
                        className={`${brickColor} ${textureBase} ${randomLight} transition-all duration-500`}
                        style={{
                            width: width,
                            flexShrink: 0,
                            // Add a subtle texture overlay
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E")'
                        }}
                    >
                        {/* Optional inner shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)] rounded-[2px]" />
                    </div>
                );
            })}
        </div>
    );
}

