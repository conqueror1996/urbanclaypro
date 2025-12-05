'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WallStylerProps {
    initialColor?: string;
    productImageUrl?: string;
    variantImages?: string[];
}

type Pattern = 'stretcher' | 'header' | 'flemish' | 'english' | 'stack' | 'basket';

export default function WallStyler({ initialColor = '#b45a3c', productImageUrl, variantImages = [] }: WallStylerProps) {
    const [pattern, setPattern] = useState<Pattern>('stretcher');
    const [groutColor, setGroutColor] = useState('#efe5d6'); // Default: Almond
    const [groutWidth, setGroutWidth] = useState(3);
    const [brickColor, setBrickColor] = useState(initialColor);

    // Combine main image and variants into a single gallery
    const allImages = React.useMemo(() => {
        const images: string[] = [];
        if (productImageUrl) images.push(productImageUrl);
        if (variantImages) images.push(...variantImages);
        // Deduplicate
        return Array.from(new Set(images));
    }, [productImageUrl, variantImages]);

    const [activeTextureIndex, setActiveTextureIndex] = useState(0);
    const activeTexture = allImages.length > 0 ? allImages[activeTextureIndex] : null;

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

    // --- Logic: Generate Bricks ---
    const tileStyle = {
        backgroundColor: brickColor,
        backgroundImage: activeTexture
            ? `url("${activeTexture}")`
            : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)`,
        backgroundSize: activeTexture ? 'cover' : 'auto',
        backgroundPosition: 'center',
        boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.2), inset -1px -1px 2px rgba(0,0,0,0.2), 2px 2px 4px rgba(0,0,0,0.1)',
        transition: 'background-image 0.3s ease'
    };

    const generateBricks = () => {
        const bricks: { col: number; row: number; w: number; h: number; key: string }[] = [];
        const rows = 12;
        const cols = 12;

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
            return bricks;
        }

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
        return bricks;
    };

    const bricks = generateBricks();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-[var(--line)] h-full flex flex-col">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--sand)] rounded-lg text-[var(--terracotta)]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#2A1E16]">Real-Time Styler</h4>
                        <p className="text-xs text-gray-500">Pick a variant & tweak pattern</p>
                    </div>
                </div>

                {/* Variant Thumbnails Gallery */}
                {allImages.length > 0 && (
                    <div className="flex gap-2 bg-gray-50 p-2 rounded-xl overflow-x-auto">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTextureIndex(idx)}
                                className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 overflow-hidden transition-all ${idx === activeTextureIndex
                                        ? 'border-[var(--terracotta)] scale-105 shadow-md'
                                        : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Variant ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-grow flex flex-col gap-6">
                {/* Live Preview Canvas */}
                <div
                    className="flex-grow rounded-xl overflow-hidden relative shadow-inner border border-gray-200 min-h-[250px]"
                    style={{ backgroundColor: groutColor, transition: 'background-color 0.5s ease' }}
                >
                    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-black/5 to-white/10 mix-blend-overlay"></div>
                    <div className="w-full h-full p-4 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTextureIndex}
                                className="absolute inset-0 grid grid-cols-12 auto-rows-fr"
                                style={{ gap: `${groutWidth}px` }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {bricks.map((b) => (
                                    <motion.div
                                        key={b.key}
                                        layoutId={`tile-${b.key}`}
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
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Pattern Picker */}
                    <div className="grid grid-cols-3 gap-2">
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

                    {/* Grout Color */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#7a6f66] mb-2">Grout Color</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(groutMap).map(([name, color]) => (
                                <button
                                    key={name}
                                    onClick={() => setGroutColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all relative ${groutColor === color ? 'border-[var(--terracotta)] scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: color, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                                    title={name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Depth / Width Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
