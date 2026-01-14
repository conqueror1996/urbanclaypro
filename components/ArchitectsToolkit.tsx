'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for our Toolkit Configuration
type BrickTone = 'terracotta' | 'antique' | 'cocoa';
type BondPattern = 'stack' | 'stretcher' | 'flemish' | 'english';
type GroutSize = 0 | 5 | 10 | 15;
type GroutColor = '#e5e5e5' | '#666666' | '#1a1a1a' | '#bf5b3b';

const BRICK_RATIO = 230 / 75; // Standard Brick Aspect Ratio (230mm x 75mm)

export default function ArchitectsToolkit() {
    // State
    const [tone, setTone] = useState<BrickTone>('terracotta');
    const [bond, setBond] = useState<BondPattern>('stretcher');
    const [groutSize, setGroutSize] = useState<GroutSize>(10);
    const [groutColor, setGroutColor] = useState<GroutColor>('#e5e5e5');
    const [showDimensions, setShowDimensions] = useState(false);

    // Configuration Data
    const brickTones = [
        { id: 'terracotta', label: 'Natural Red', color: 'bg-[#B14A2A]' },
        { id: 'antique', label: 'Antique Beige', color: 'bg-[#d8b09a]' },
        { id: 'cocoa', label: 'Burnt Cocoa', color: 'bg-[#5c4033]' },
    ];

    const bondPatterns = [
        { id: 'stretcher', label: 'Stretcher', desc: 'Standard running bond' },
        { id: 'stack', label: 'Stack', desc: 'Modern aligned grid' },
        { id: 'flemish', label: 'Flemish', desc: 'Classic header-stretcher' },
        { id: 'english', label: 'English', desc: 'Alternating courses' },
    ];

    const groutColors = [
        { color: '#e5e5e5', label: 'Light' },
        { color: '#9ca3af', label: 'Grey' },
        { color: '#1a1a1a', label: 'Dark' },
        { color: '#bf5b3b', label: 'Match' },
    ];

    return (
        <section className="py-20 md:py-32 bg-[#F5F2F0] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <span className="text-[var(--terracotta)] font-bold tracking-widest uppercase text-xs mb-4 block">
                            Interactive Visualizer
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1a1512] mb-4">
                            The Architect's Toolkit
                        </h2>
                        <p className="text-[#1a1512]/60 max-w-xl leading-relaxed">
                            Visualize high-precision clay systems. Calibrate bond patterns, grout thickness, and mortar tones to specify your facade with 100% confidence.
                        </p>
                    </div>
                </div>

                {/* Toolkit Interface */}
                <div className="grid lg:grid-cols-12 gap-8 h-auto lg:h-[700px]">

                    {/* Controls Panel */}
                    <div className="lg:col-span-4 bg-white rounded-3xl p-8 shadow-xl border border-[#1a1512]/5 flex flex-col h-full overflow-y-auto">
                        <div className="space-y-10">

                            {/* 1. Brick Tone */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a1512]/40 mb-4 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#1a1512] text-white flex items-center justify-center text-[10px]">1</span>
                                    Select Tone
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {brickTones.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTone(t.id as BrickTone)}
                                            className={`
                                                relative h-20 rounded-xl overflow-hidden border-2 transition-all flex items-end p-2
                                                ${tone === t.id ? 'border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/20' : 'border-transparent opacity-70 hover:opacity-100'}
                                                ${t.color}
                                            `}
                                        >
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${t.id === 'antique' ? 'text-[#1a1512]' : 'text-white'}`}>
                                                {t.label}
                                            </span>
                                            {tone === t.id && (
                                                <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full text-[var(--terracotta)] flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                </div>
                                            )}
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
                                        <button
                                            key={b.id}
                                            onClick={() => setBond(b.id as BondPattern)}
                                            className={`
                                                w-full text-left px-4 py-3 rounded-xl border transition-all flex justify-between items-center
                                                ${bond === b.id
                                                    ? 'bg-[#1a1512] text-white border-[#1a1512]'
                                                    : 'bg-white text-[#1a1512] border-[#1a1512]/10 hover:border-[#1a1512]/30'}
                                            `}
                                        >
                                            <span className="font-serif font-medium">{b.label}</span>
                                            <span className={`text-xs ${bond === b.id ? 'text-white/60' : 'text-[#1a1512]/40'}`}>
                                                {b.desc}
                                            </span>
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

                                <div className="mb-6">
                                    <div className="flex justify-between text-xs font-bold text-[#1a1512]/60 mb-2">
                                        <span>Joint Size</span>
                                        <span>{groutSize}mm</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="15"
                                        step="5"
                                        value={groutSize}
                                        onChange={(e) => setGroutSize(Number(e.target.value) as GroutSize)}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--terracotta)]"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                                        <span>Zero</span>
                                        <span>5mm</span>
                                        <span>10mm</span>
                                        <span>15mm</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-bold text-[#1a1512]/60 mb-2 block">Mortar Tone</span>
                                    <div className="flex gap-3">
                                        {groutColors.map((g) => (
                                            <button
                                                key={g.color}
                                                onClick={() => setGroutColor(g.color as GroutColor)}
                                                className={`
                                                    w-10 h-10 rounded-full border-2 transition-all relative
                                                    ${groutColor === g.color ? 'border-[#1a1512] scale-110' : 'border-transparent hover:scale-110'}
                                                `}
                                                style={{ backgroundColor: g.color }}
                                                title={g.label}
                                            >
                                                {groutColor === g.color && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className={`w-2 h-2 rounded-full ${g.color === '#1a1a1a' ? 'bg-white' : 'bg-[#1a1a1a]'}`} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Visualization Canvas */}
                    <div className="lg:col-span-8 bg-white rounded-3xl overflow-hidden shadow-2xl relative border border-[#1a1512]/5 flex flex-col">

                        {/* Canvas Controls */}
                        <div className="absolute top-6 right-6 z-20 flex gap-2">
                            <button
                                onClick={() => setShowDimensions(!showDimensions)}
                                className={`
                                    px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border
                                    ${showDimensions
                                        ? 'bg-[#1a1512] text-white border-[#1a1512]'
                                        : 'bg-white/80 text-[#1a1512] border-[#1a1512]/10 hover:bg-white'}
                                `}
                            >
                                {showDimensions ? 'Hide Grid' : 'Show Grid'}
                            </button>
                        </div>

                        {/* Rendering Area */}
                        <div
                            className="flex-1 w-full h-full relative overflow-hidden transition-colors duration-500"
                            style={{ backgroundColor: groutColor }}
                        >
                            <BrickWall
                                tone={tone}
                                bond={bond}
                                groutSize={groutSize}
                                brickColor={brickTones.find(t => t.id === tone)?.color || ''}
                            />

                            {/* Dimension Overlay */}
                            <AnimatePresence>
                                {showDimensions && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 pointer-events-none"
                                    >
                                        {/* Grid Lines - Representing 1m x 1m roughly */}
                                        <div className="w-full h-full"
                                            style={{
                                                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                                                backgroundSize: '100px 100px'
                                            }}
                                        />
                                        <div className="absolute bottom-4 left-4 bg-[#1a1512] text-white text-[10px] px-2 py-1 rounded">
                                            Scale: 1:10 (Approx) | Brick: 230x75mm
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Spec Bar */}
                        <div className="bg-white border-t border-gray-100 p-4 flex justify-between items-center text-xs text-gray-500">
                            <div className="flex gap-6">
                                <span><strong className="text-[#1a1512]">Pattern:</strong> {bondPatterns.find(b => b.id === bond)?.label}</span>
                                <span><strong className="text-[#1a1512]">Joint:</strong> {groutSize}mm</span>
                                <span><strong className="text-[#1a1512]">Est. Bricks/m²:</strong> ~48</span>
                            </div>
                            <button className="text-[var(--terracotta)] font-bold hover:underline">
                                Downlaod Spec Sheet
                            </button>
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

    const rows = 12; // Number of rows to render

    // Grout spacing in pixels (scaled)
    // 5mm real world ~= 2px on screen? 
    // Let's say 230mm brick = 100px on screen.
    // Then 5mm = 2.1px.
    const gap = groutSize * 0.4;

    // Brick Height
    const h = 32; // px

    return (
        <div className="w-full h-full flex flex-col justify-center overflow-hidden" style={{ gap: `${gap}px`, padding: '20px' }}>
            {Array.from({ length: rows }).map((_, r) => (
                <Row
                    key={r}
                    rowIdx={r}
                    bond={bond}
                    brickColor={brickColor}
                    gap={gap}
                    height={h}
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
        bricks = Array(10).fill('stretcher');
    } else if (bond === 'stretcher') {
        // Offset every other row
        bricks = Array(10).fill('stretcher');
    } else if (bond === 'flemish') {
        // Alternating Header/Stretcher
        // Row 1: S H S H...
        // Row 2: Might be offset? Usually Flemish is same pattern per row but offset to center header over stretcher.
        // Simplified Flemish: S H S H...
        bricks = Array(8).fill(null).flatMap(() => ['stretcher', 'header']);
    } else if (bond === 'english') {
        // Row 1: S S S...
        // Row 2: H H H...
        bricks = rowIdx % 2 === 0 ? Array(10).fill('stretcher') : Array(15).fill('header');
    }

    // Offset logic for Stretcher/Flemish
    const isOffset = (bond === 'stretcher' || bond === 'flemish' || bond === 'stack' === false) && rowIdx % 2 !== 0;

    // CSS Texture classes for realism
    const textureBase = "relative rounded-[2px] shadow-sm";

    // We handle offset by margin-left on the first brick or using a transform
    // Using a flex row

    return (
        <div
            className="flex w-[120%] -ml-[10%]" // Oversize width to handle offsets cleanly without blank edges
            style={{
                gap: `${gap}px`,
                height: `${height}px`,
                transform: isOffset && bond === 'stretcher' ? 'translateX(-50px)' :
                    isOffset && bond === 'flemish' ? 'translateX(-30px)' : 'none'
            }}
        >
            {bricks.map((type, i) => {
                // Random subtle variation
                const randomLight = Math.random() > 0.5 ? 'brightness-105' : 'brightness-95';
                const width = type === 'stretcher' ? '100px' : '45px'; // 230 vs 110 approx ratio

                return (
                    <div
                        key={i}
                        className={`${brickColor} ${textureBase} ${randomLight} transition-all duration-500`}
                        style={{
                            width: width,
                            flexShrink: 0,
                            // Add a subtle texture overlay
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.2\'/%3E%3C/svg%3E")'
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

