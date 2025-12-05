'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSampleBox } from '@/context/SampleContext';

type Pattern = 'stretcher' | 'header' | 'flemish' | 'english' | 'stack' | 'basket';

export default function Tools() {
    const { addToBox } = useSampleBox();

    // --- State ---
    const [area, setArea] = useState('');
    const [boxes, setBoxes] = useState<number | null>(null);

    const [pattern, setPattern] = useState<Pattern>('stretcher');
    const [groutColor, setGroutColor] = useState('#efe5d6'); // Default: Almond
    const [groutWidth, setGroutWidth] = useState(3);
    const [brickColor, setBrickColor] = useState('#b45a3c'); // Default Brick Color

    // --- Constants ---
    const groutMap: Record<string, string> = {
        'Almond': '#efe5d6',
        'Charcoal': '#3a3632',
        'Terracotta': '#c06a4a',
        'Grey': '#9ca3af',
        'White': '#ffffff'
    };

    const patterns: { id: Pattern; name: string }[] = [
        { id: 'stretcher', name: 'Stretcher' },
        { id: 'header', name: 'Header' },
        { id: 'flemish', name: 'Flemish' },
        { id: 'english', name: 'English' },
        { id: 'stack', name: 'Stack' },
        { id: 'basket', name: 'Basket' }
    ];

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
            color: brickColor,
            texture: 'Brick Texture'
        });
    };

    const handleSavePreset = () => {
        const groutName = Object.keys(groutMap).find(key => groutMap[key] === groutColor) || 'Custom';
        addToBox({
            id: `preset-${pattern}-${groutColor}-${groutWidth}`,
            name: `${pattern.charAt(0).toUpperCase() + pattern.slice(1)} Preset`,
            color: brickColor,
            texture: `Grout: ${groutName} (${groutWidth}mm)`
        });
    };

    // --- Logic: Wall Styler Bricks ---
    const tileStyle = {
        backgroundColor: brickColor,
        backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)
        `,
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.1)',
    };

    const generateBricks = () => {
        const bricks: { col: number; row: number; w: number; h: number; key: string }[] = [];
        const rows = 12; // Smaller canvas
        const cols = 12;

        for (let r = 0; r < rows; r += 2) {
            let c = 0;
            const isEvenRow = (r / 2) % 2 === 0;

            if (pattern === 'stretcher') {
                if (isEvenRow) {
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                } else {
                    bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}-start` });
                    c += 2;
                    while (c < cols - 2) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                    if (c < cols) bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}-end` });
                }
            } else if (pattern === 'header') {
                if (isEvenRow) {
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                } else {
                    bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-start` });
                    c += 1;
                    while (c < cols - 1) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                    if (c < cols) bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-end` });
                }
            } else if (pattern === 'stack') {
                while (c < cols) {
                    bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                    c += 4;
                }
            } else if (pattern === 'english') {
                if (isEvenRow) {
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                } else {
                    bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-start` });
                    c += 1;
                    while (c < cols - 1) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                    if (c < cols) bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-end` });
                }
            } else if (pattern === 'flemish') {
                let currentX = 0;
                if (!isEvenRow) {
                    bricks.push({ col: currentX, row: r, w: 2, h: 2, key: `${r}-${currentX}-start` });
                    currentX += 2;
                }
                while (currentX < cols) {
                    if (currentX + 4 <= cols) {
                        bricks.push({ col: currentX, row: r, w: 4, h: 2, key: `${r}-${currentX}-s` });
                        currentX += 4;
                    } else {
                        bricks.push({ col: currentX, row: r, w: cols - currentX, h: 2, key: `${r}-${currentX}-rem` });
                        currentX = cols;
                        break;
                    }
                    if (currentX + 2 <= cols) {
                        bricks.push({ col: currentX, row: r, w: 2, h: 2, key: `${r}-${currentX}-h` });
                        currentX += 2;
                    } else {
                        bricks.push({ col: currentX, row: r, w: cols - currentX, h: 2, key: `${r}-${currentX}-rem` });
                        currentX = cols;
                        break;
                    }
                }
            }
        }

        if (pattern === 'basket') {
            for (let r = 0; r < rows; r += 4) {
                for (let c = 0; c < cols; c += 4) {
                    const isAlt = ((r / 4) + (c / 4)) % 2 !== 0;
                    if (!isAlt) {
                        bricks.push({ col: c, row: r, w: 2, h: 4, key: `${r}-${c}-v1` });
                        bricks.push({ col: c + 2, row: r, w: 2, h: 4, key: `${r}-${c}-v2` });
                    } else {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}-h1` });
                        bricks.push({ col: c, row: r + 2, w: 4, h: 2, key: `${r}-${c}-h2` });
                    }
                }
            }
        }

        return bricks;
    };

    const bricks = generateBricks();

    return (
        <section id="tools" className="bg-[var(--sand)] border-y border-[var(--line)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
                <div className="text-center mb-16">
                    <span className="text-[var(--terracotta)] font-medium tracking-widest uppercase text-xs mb-3 block">Planning Tools</span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#2A1E16]">Plan Your Project</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

                    {/* Tile 1: Coverage Calculator */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-transparent hover:border-[var(--line)] hover:shadow-md transition-all flex flex-col">
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
                                    <p className="text-[10px] text-gray-400 text-center mt-2 italic">
                                        Test density, strength, and finish yourself.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Tile 2: Wall Styler (Pattern + Preview) */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-transparent hover:border-[var(--line)] hover:shadow-md transition-all flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-[#f4f1ee] flex items-center justify-center text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-serif text-[#2A1E16]">Wall Styler</h3>
                        </div>

                        <div className="flex-grow flex flex-col">
                            {/* Pattern Picker */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                {patterns.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPattern(p.id)}
                                        className={`px-2 py-2 rounded-lg text-[10px] font-medium border transition-all ${pattern === p.id
                                            ? 'bg-[var(--sand)] border-[var(--terracotta)] text-[var(--terracotta)]'
                                            : 'border-gray-100 text-gray-500 hover:border-gray-300'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>

                            {/* Live Preview Canvas */}
                            <div
                                className="flex-grow rounded-xl overflow-hidden relative shadow-inner border border-gray-200 min-h-[200px]"
                                style={{ backgroundColor: groutColor, transition: 'background-color 0.5s ease' }}
                            >
                                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-black/5 to-white/10 mix-blend-overlay"></div>
                                <div className="w-full h-full p-4 overflow-hidden relative">
                                    <div
                                        className="absolute inset-0 grid grid-cols-12 auto-rows-fr"
                                        style={{ gap: `${groutWidth}px` }}
                                    >
                                        {bricks.map((b) => (
                                            <motion.div
                                                key={b.key}
                                                layoutId={`tile-${b.key}`}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4 }}
                                                className="relative rounded-[1px]"
                                                style={{
                                                    ...tileStyle,
                                                    gridColumnStart: b.col + 1,
                                                    gridColumnEnd: `span ${b.w}`,
                                                    gridRowStart: b.row + 1,
                                                    gridRowEnd: `span ${b.h}`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tile 3: Grout + Depth Picker */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-transparent hover:border-[var(--line)] hover:shadow-md transition-all flex flex-col md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-[#f4f1ee] flex items-center justify-center text-[var(--terracotta)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-serif text-[#2A1E16]">Finishing Touches</h3>
                        </div>

                        <div className="flex-grow space-y-8">
                            {/* Grout Color */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6f66] mb-4">Grout Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(groutMap).map(([name, color]) => (
                                        <button
                                            key={name}
                                            onClick={() => setGroutColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all relative group ${groutColor === color ? 'border-[var(--terracotta)] scale-110' : 'border-transparent hover:scale-105'}`}
                                            style={{ backgroundColor: color, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                            title={name}
                                        >
                                            {groutColor === color && (
                                                <motion.div
                                                    layoutId="activeGrout"
                                                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[var(--terracotta)] whitespace-nowrap"
                                                >
                                                    {name}
                                                </motion.div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Depth / Width Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-[#7a6f66]">Grout Width</label>
                                    <span className="text-xs font-medium text-[var(--terracotta)]">{groutWidth}mm</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="12"
                                    value={groutWidth}
                                    onChange={(e) => setGroutWidth(Number(e.target.value))}
                                    className="w-full accent-[var(--terracotta)] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                    <span>Tight (1mm)</span>
                                    <span>Wide (12mm)</span>
                                </div>
                            </div>

                            <div className="pt-4 mt-auto">
                                <button
                                    onClick={handleSavePreset}
                                    className="w-full py-3 rounded-xl border border-[var(--terracotta)] text-[var(--terracotta)] font-medium hover:bg-[var(--terracotta)] hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                    Save Preset to Box
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main CTA Removed */}
            </div>
        </section>
    );
}
