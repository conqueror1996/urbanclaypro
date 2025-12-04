'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Pattern = 'stretcher' | 'header' | 'flemish' | 'english' | 'stack' | 'basket';

interface WallStylerProps {
    initialColor?: string;
}

export default function WallStyler({ initialColor = '#b45a3c' }: WallStylerProps) {
    const [pattern, setPattern] = useState<Pattern>('stretcher');
    const [brickColor, setBrickColor] = useState(initialColor);
    const [groutColor, setGroutColor] = useState('#efe5d6');
    const [groutWidth, setGroutWidth] = useState(3);
    const [activeTab, setActiveTab] = useState<'pattern' | 'grout'>('pattern');

    const groutMap: Record<string, string> = {
        'Almond': '#efe5d6',
        'Charcoal': '#3a3632',
        'Terracotta': '#c06a4a',
        'Grey': '#9ca3af',
        'White': '#ffffff'
    };

    const patterns: { id: Pattern; name: string }[] = [
        { id: 'stretcher', name: 'Stretcher Bond' },
        { id: 'header', name: 'Header Bond' },
        { id: 'flemish', name: 'Flemish Bond' },
        { id: 'english', name: 'English Bond' },
        { id: 'stack', name: 'Stack Bond' },
        { id: 'basket', name: 'Basket Weave' }
    ];

    // CSS for the tile texture
    const tileStyle = {
        backgroundColor: brickColor,
        backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)
        `,
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.1)',
    };

    // Generate bricks based on pattern
    const generateBricks = () => {
        const bricks: { col: number; row: number; w: number; h: number; key: string }[] = [];
        const rows = 16;
        const cols = 16;

        // Units:
        // Stretcher = 4w x 2h
        // Header = 2w x 2h

        for (let r = 0; r < rows; r += 2) {
            let c = 0;
            const isEvenRow = (r / 2) % 2 === 0;

            if (pattern === 'stretcher') {
                // Row 0: Full bricks [0-4, 4-8...]
                // Row 1: Half [0-2], Full [2-6...], Half [14-16]
                if (isEvenRow) {
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                } else {
                    // Start with half brick
                    bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}-start` });
                    c += 2;
                    // Full bricks
                    while (c < cols - 2) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                    // End with half brick
                    if (c < cols) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}-end` });
                    }
                }
            } else if (pattern === 'header') {
                // Header = 2w. Offset = 1w.
                if (isEvenRow) {
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                } else {
                    // Start half header (1w)
                    bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-start` });
                    c += 1;
                    // Full headers
                    while (c < cols - 1) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                    // End half header
                    if (c < cols) {
                        bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-end` });
                    }
                }
            } else if (pattern === 'stack') {
                while (c < cols) {
                    bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                    c += 4;
                }
            } else if (pattern === 'english') {
                if (isEvenRow) {
                    // Stretcher Course
                    while (c < cols) {
                        bricks.push({ col: c, row: r, w: 4, h: 2, key: `${r}-${c}` });
                        c += 4;
                    }
                } else {
                    // Header Course with offset
                    // Start half header (1w)
                    bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-start` });
                    c += 1;
                    while (c < cols - 1) {
                        bricks.push({ col: c, row: r, w: 2, h: 2, key: `${r}-${c}` });
                        c += 2;
                    }
                    if (c < cols) {
                        bricks.push({ col: c, row: r, w: 1, h: 2, key: `${r}-${c}-end` });
                    }
                }
            } else if (pattern === 'flemish') {
                // Alternating Stretcher (4) and Header (2) = 6 units repeat
                // Row 1: S, H, S, H...
                // Row 2: Offset? Usually Header centered on Stretcher.
                // Center of Stretcher (4) is at 2. Header (2) needs to be at 1-3.

                // Simplified Flemish: Just alternate S-H
                const sequence = isEvenRow ? ['S', 'H'] : ['H', 'S']; // Swap start

                // To make it look "bonded", we need proper offsets.
                // Let's just do a simple alternating pattern for now.
                // Row 0: S(4), H(2), S(4), H(2)...
                // Row 1: H(2), S(4), H(2), S(4)... (Offset by 2 units effectively?)

                // Let's try explicit filling
                let currentX = 0;
                let idx = 0;

                // Offset start for odd rows to create bond
                if (!isEvenRow) {
                    // Start with a 3/4 bat? or just a Header?
                    // Let's start with Header (2w)
                    // If Row 0 starts S(4), H(2)...
                    // Row 1 starts H(2), S(4)...
                    // S(4) at 0-4. Center is 2.
                    // H(2) at 0-2. Center is 1.
                    // Not perfectly centered but creates a bond.

                    // Better Flemish Corner:
                    // Row 0: Header(2), Stretcher(4)...
                    // Row 1: 3/4 Bat (3), Header(2)... ?

                    // Let's stick to simple alternating start for visual effect
                    bricks.push({ col: currentX, row: r, w: 2, h: 2, key: `${r}-${currentX}-start` });
                    currentX += 2;
                }

                while (currentX < cols) {
                    // S then H
                    if (currentX + 4 <= cols) {
                        bricks.push({ col: currentX, row: r, w: 4, h: 2, key: `${r}-${currentX}-s` });
                        currentX += 4;
                    } else {
                        // Fill remainder
                        bricks.push({ col: currentX, row: r, w: cols - currentX, h: 2, key: `${r}-${currentX}-rem` });
                        currentX = cols;
                        break;
                    }

                    if (currentX + 2 <= cols) {
                        bricks.push({ col: currentX, row: r, w: 2, h: 2, key: `${r}-${currentX}-h` });
                        currentX += 2;
                    } else {
                        // Fill remainder
                        bricks.push({ col: currentX, row: r, w: cols - currentX, h: 2, key: `${r}-${currentX}-rem` });
                        currentX = cols;
                        break;
                    }
                }
            }
        }

        // Basket Weave
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
        <div className="bg-[#f9f9f9] rounded-3xl p-8 md:p-10 border border-transparent hover:border-[var(--line)] transition-colors h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[var(--terracotta)] shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div>
                    <h3 className="text-xl font-serif text-[#2A1E16]">Wall Styler</h3>
                    <p className="text-sm text-[#5d554f]">Visualize patterns, depth & grout.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex-grow flex flex-col">
                {/* Controls Header */}
                <div className="flex gap-4 mb-4 md:mb-6 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('pattern')}
                        className={`text-sm font-medium pb-1 transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === 'pattern' ? 'text-[var(--terracotta)] border-b-2 border-[var(--terracotta)]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Pattern
                    </button>
                    <button
                        onClick={() => setActiveTab('grout')}
                        className={`text-sm font-medium pb-1 transition-colors whitespace-nowrap flex-shrink-0 ${activeTab === 'grout' ? 'text-[var(--terracotta)] border-b-2 border-[var(--terracotta)]' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Grout Color
                    </button>
                </div>

                {/* Controls Body */}
                <div className="mb-6 space-y-4 md:space-y-6">
                    {/* Tab Content */}
                    <div className="min-h-[40px]">
                        {activeTab === 'pattern' ? (
                            <div className="flex flex-wrap gap-2">
                                {patterns.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPattern(p.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex-shrink-0 ${pattern === p.id
                                            ? 'bg-[var(--sand)] border-[var(--terracotta)] text-[var(--terracotta)]'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                            }`}
                                    >
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {Object.entries(groutMap).map(([name, color]) => (
                                    <button
                                        key={name}
                                        onClick={() => setGroutColor(color)}
                                        className={`w-10 h-10 md:w-8 md:h-8 rounded-full border-2 transition-all flex-shrink-0 ${groutColor === color ? 'border-[var(--terracotta)] scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: color, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                        title={name}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Always Visible Slider */}
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap w-16 md:w-20">Grout: {groutWidth}mm</span>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            value={groutWidth}
                            onChange={(e) => setGroutWidth(Number(e.target.value))}
                            className="w-full accent-[var(--terracotta)] h-4 md:h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* Visualizer Viewport */}
                <div
                    className="flex-grow rounded-xl overflow-hidden relative shadow-inner border border-gray-200 min-h-[300px]"
                    style={{ backgroundColor: groutColor, transition: 'background-color 0.5s ease' }}
                >
                    {/* Lighting Overlay for Depth */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-black/5 to-white/10 mix-blend-overlay"></div>

                    <div className="w-full h-full p-4 overflow-hidden relative">
                        {/* Grid Container */}
                        <div
                            className="absolute inset-0 grid grid-cols-16 auto-rows-fr"
                            style={{ gap: `${groutWidth}px` }}
                        >
                            {bricks.map((b) => (
                                <motion.div
                                    key={b.key}
                                    layoutId={b.key} // Use layoutId for smoother transitions if keys match
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="relative rounded-sm"
                                    style={{
                                        ...tileStyle,
                                        gridColumnStart: b.col + 1, // 1-based index
                                        gridColumnEnd: `span ${b.w}`,
                                        gridRowStart: b.row + 1,
                                        gridRowEnd: `span ${b.h}`,
                                        // Handle overflow gracefully if needed, but grid usually handles it
                                    }}
                                >
                                    {/* Highlight Edge */}
                                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/30"></div>
                                    {/* Shadow Edge */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/20"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center text-gray-400 mt-3">
                    *Digital representation. Actual texture may vary.
                </p>
            </div>
        </div>
    );
}
