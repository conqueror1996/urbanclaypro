'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface WallStylerProps {
    initialColor?: string;
    variantImages?: string[];
}

type Pattern = 'stretcher' | 'stack' | 'herringbone' | 'basket' | 'spanish';

export default function WallStyler({ initialColor = '#b45a3c', variantImages = [] }: WallStylerProps) {
    const wallRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'pattern' | 'color' | 'grout'>('pattern');
    const [pattern, setPattern] = useState<Pattern>('stretcher');
    const [brickTone, setBrickTone] = useState(initialColor);
    const [groutColor, setGroutColor] = useState('#e6d5c9');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- CONFIG ---
    const patterns: { id: Pattern; label: string; icon: any }[] = [
        { id: 'stretcher', label: 'Stretcher', icon: <div className="flex flex-col gap-1 w-6"><div className="h-1 bg-current w-full" /><div className="flex gap-1"><div className="h-1 bg-current w-2" /><div className="h-1 bg-current w-4" /></div><div className="h-1 bg-current w-full" /></div> },
        { id: 'stack', label: 'Stack Bond', icon: <div className="grid grid-cols-2 gap-0.5 w-6"><div className="h-2 bg-current" /><div className="h-2 bg-current" /><div className="h-2 bg-current" /><div className="h-2 bg-current" /></div> },
        { id: 'herringbone', label: 'Herringbone', icon: <div className="w-6 h-6 rotate-45 flex flex-col gap-0.5 items-center justify-center"><div className="h-3 w-1 bg-current" /><div className="h-1 w-3 bg-current" /></div> },
        { id: 'basket', label: 'Basketweave', icon: <div className="grid grid-cols-2 gap-0.5 w-6"><div className="h-3 bg-current" /><div className="flex flex-col gap-0.5"><div className="h-1 bg-current w-full" /><div className="h-1 bg-current w-full" /></div></div> },
        { id: 'spanish', label: 'Spanish', icon: <div className="flex flex-col gap-0.5 w-6"><div className="h-1 bg-current w-full" /><div className="grid grid-cols-3 gap-0.5"><div className="h-2 bg-current" /><div className="h-2 bg-current" /><div className="h-2 bg-current" /></div></div> },
    ];

    const colors = [
        { hex: '#b45a3c', name: 'Rustic Red' },
        { hex: '#e6d5c9', name: 'Sandstone' },
        { hex: '#3f2e27', name: 'Espresso' },
        { hex: '#8a3324', name: 'Vintage Burgundy' },
        { hex: '#c0c0c0', name: 'Industrial Grey' }
    ];

    const grouts = [
        { hex: '#ffffff', name: 'White' },
        { hex: '#e6d5c9', name: 'Beige' },
        { hex: '#9ca3af', name: 'Grey' },
        { hex: '#3a3632', name: 'Charcoal' }
    ];

    // --- GENERATORS ---
    // CSS Grid generator based on pattern
    const getGridStyles = (): { className: string; style: React.CSSProperties } => {
        // REMOVED gap-x-[3px] and gap-x-[6px] -> Only keeping gap-y for horizontal rows
        const baseClass = "absolute inset-0 grid p-4 md:p-8 transition-all duration-700 ease-in-out gap-y-[3px] md:gap-y-[6px]";
        const cols = isMobile ? 'repeat(4, 1fr)' : 'repeat(12, 1fr)';

        switch (pattern) {
            case 'stack':
                return {
                    className: `${baseClass} content-start`,
                    style: { gridTemplateColumns: cols }
                };
            case 'herringbone':
                // Diagonal Stretcher approximation for stability
                return {
                    className: `${baseClass} content-center rotate-45 ${isMobile ? 'scale-[2]' : 'scale-150'}`,
                    style: { gridTemplateColumns: cols }
                };
            case 'basket':
                // BLOCKS: 3x1 aspect ratio implies 3 stacked bricks = Square.
                // We render Squares.
                return {
                    className: `${baseClass} content-start`,
                    style: { gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(8, 1fr)' }
                };
            case 'spanish':
                return {
                    className: `${baseClass} content-start`,
                    style: { gridTemplateColumns: cols }
                };
            default: // stretcher (Default 3:1)
                return {
                    className: `${baseClass} content-start`,
                    style: { gridTemplateColumns: cols }
                };
        }
    };

    // --- HELPERS ---
    const BRICK_TEXTURE = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMDAlJyBoZWlnaHQ9JzIwMCUnPjxmaWx0ZXIgaWQ9J24nPjxmZVR1cmJ1bGVuY2UgdHlwZT0nZnJhY3RhbE5vaXNlJyBiYXNlRnJlcXVlbmN5PScwLjUnIG51bU9jdGF2ZXM9JzEnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSd0cmFuc3BhcmVudCcvPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbHRlcj0ndXJsKCNuKScgb3BhY2l0eT0nMC4yJy8+PC9zdmc+')";

    // --- RENDER HELPERS ---
    const renderedBricks = React.useMemo(() => {
        // SPECIAL CASE: BASKETWEAVE (Block Based)
        if (pattern === 'basket') {
            // Reduced from 100 to 50 for performance
            return Array.from({ length: 50 }).map((_, i) => {
                const col = i % 8;
                const row = Math.floor(i / 8);
                const isVertical = (col + row) % 2 === 0;

                return (
                    <div key={`basket-block-${i}`} className="relative aspect-square w-full flex flex-col gap-[3px] md:gap-[6px]">
                        <div className={`w-full h-full flex ${isVertical ? 'flex-row' : 'flex-col'} gap-[3px] md:gap-[6px]`}>
                            {Array.from({ length: 3 }).map((__, bIdx) => {
                                const randomVal = Math.sin((i * 3 + bIdx) * 12.9898);
                                const deterministicRandom = (randomVal + 1) / 2;

                                return (
                                    <div
                                        key={bIdx}
                                        className="relative flex-1 rounded-[1px] overflow-hidden min-w-0 min-h-0 border-white/10 border-[0.5px]"
                                        style={{
                                            backgroundColor: brickTone,
                                        }}
                                    >
                                        <div className="absolute inset-0 opacity-40"
                                            style={{
                                                backgroundImage: BRICK_TEXTURE,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            });
        }

        // STANDARD BRICKS (Stretcher, Stack, Herringbone)
        // Reduced from 400 to 192 for performance (enough to fill view)
        return Array.from({ length: 192 }).map((_, i) => {
            let spanClass = "col-span-1 aspect-[3/1] w-full"; // Explicit w-full
            let offsetClass = "";

            // Offset Logic
            if (pattern === 'stretcher' || pattern === 'herringbone') {
                const row = Math.floor(i / 12);
                if (row % 2 !== 0) offsetClass = "translate-x-[50%]";
            }
            if (pattern === 'spanish') {
                const row = Math.floor(i / 12);
                if (row % 2 !== 0) offsetClass = "translate-x-[25%]";
            }

            const deterministicRandom = (Math.sin(i * 12.9898) + 1) / 2;

            return (
                <div
                    key={`${pattern}-${i}`}
                    className={`relative ${spanClass} ${offsetClass} box-border border-r-[3px] md:border-r-[6px] border-transparent`}
                >
                    <div className="w-full h-full relative rounded-[1px] overflow-hidden bg-current border-[0.5px] border-white/10"
                        style={{
                            backgroundColor: brickTone,
                        }}>

                        <div className="absolute inset-0 opacity-40"
                            style={{
                                backgroundImage: BRICK_TEXTURE,
                            }}
                        />
                    </div>
                </div>
            );
        });
    }, [pattern, brickTone]);

    // --- ACTIONS ---
    const handleDownload = async () => {
        if (!wallRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(wallRef.current, {
                useCORS: true,
                scale: 2, // High res
                backgroundColor: null,
                ignoreElements: (element: Element) => element.hasAttribute('data-html2canvas-ignore')
            } as any);
            const link = document.createElement('a');
            link.download = `urbanclay-wall-${pattern}-${brickTone}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        }
        setIsExporting(false);
    };

    const gridConfig = getGridStyles();

    return (
        <div className="w-full h-full relative bg-[#121212] overflow-hidden rounded-3xl shadow-2xl flex flex-col group select-none font-sans">

            {/* --- 1. THE VIEWPORT (WALL) --- */}
            <div
                ref={wallRef}
                className="flex-grow relative overflow-hidden cursor-default"
            >
                {/* Backing Grout */}
                <div
                    className="absolute inset-0 transition-colors duration-700 ease-in-out"
                    style={{ backgroundColor: groutColor }}
                />

                {/* Lighting Gradient (Vignette) */}
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.3) 100%)' }}
                />

                {/* The Wall */}
                <motion.div
                    className={gridConfig.className}
                    style={gridConfig.style}
                    initial={{ scale: 1.4 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 100 }}
                >
                    {renderedBricks}
                </motion.div>

                {/* Info Text - Ignored during export */}
                <div
                    data-html2canvas-ignore="true"
                    className="absolute top-8 left-8 z-20 pointer-events-none mix-blend-difference text-xs font-mono uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    <div className="mt-1">Light Angle: 45°</div>
                </div>
                {/* Watermark Label - Visible in Export */}
                <div className="absolute bottom-8 right-8 z-20 text-right pointer-events-none mix-blend-difference text-white/50">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em]">{patterns.find(p => p.id === pattern)?.label}</div>
                    <div className="text-[9px] uppercase tracking-widest opacity-70">{colors.find(c => c.hex === brickTone)?.name}</div>
                </div>
            </div>

            {/* --- 2. THE DOCK (CONTROLS) --- */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 px-4 pointer-events-none">
                <div className="pointer-events-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-4 w-full max-w-[90%] md:max-w-md transition-transform duration-300">

                    {/* TABS (Top of Dock) */}
                    <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-1">
                        {['pattern', 'color', 'grout'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                                    ? 'bg-[var(--terracotta)] text-white shadow-lg'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* CONTENT TAPE (Horizontal Scroll) */}
                    <div className="h-16 relative overflow-hidden">

                        {/* PATTERN TAPE */}
                        {activeTab === 'pattern' && (
                            <div className="flex gap-6 items-center justify-start md:justify-center overflow-x-auto h-full px-4 animate-in slide-in-from-bottom-2 fade-in duration-300 scrollbar-hide">
                                {patterns.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPattern(p.id)}
                                        className={`flex flex-col items-center gap-1 group outline-none transition-all duration-300 shrink-0 ${pattern === p.id ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-100'}`}
                                    >
                                        <div className={`w-9 h-9 rounded-full border border-white/20 flex items-center justify-center transition-all ${pattern === p.id ? 'bg-white text-black shadow-lg' : 'text-white bg-white/5'}`}>
                                            {p.icon}
                                        </div>
                                        <span className={`text-[8px] font-bold tracking-widest uppercase transition-colors ${pattern === p.id ? 'text-white' : 'text-white/60'}`}>
                                            {p.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* COLOR TAPE */}
                        {activeTab === 'color' && (
                            <div className="flex gap-4 items-center justify-start md:justify-center overflow-x-auto h-full px-4 animate-in slide-in-from-bottom-2 fade-in duration-300 scrollbar-hide">
                                {colors.map(c => (
                                    <button
                                        key={c.name}
                                        onClick={() => setBrickTone(c.hex)}
                                        className={`flex flex-col items-center gap-1 group outline-none shrink-0 ${brickTone === c.hex ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${brickTone === c.hex ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c.hex }}
                                        />
                                        <span className={`text-[8px] font-bold tracking-widest uppercase max-w-[60px] truncate text-center transition-colors ${brickTone === c.hex ? 'text-white' : 'text-white/60'}`}>
                                            {c.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* GROUT TAPE */}
                        {activeTab === 'grout' && (
                            <div className="flex gap-4 items-center justify-start md:justify-center overflow-x-auto h-full px-4 animate-in slide-in-from-bottom-2 fade-in duration-300 scrollbar-hide">
                                {grouts.map(g => (
                                    <button
                                        key={g.name}
                                        onClick={() => setGroutColor(g.hex)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all relative group shrink-0 ${groutColor === g.hex ? 'border-[var(--terracotta)] scale-125' : 'border-white/20 hover:scale-110'}`}
                                        style={{ backgroundColor: g.hex }}
                                    >
                                        <span className="text-[9px] text-white uppercase opacity-0 group-hover:opacity-100 absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-2 py-1 rounded transition-opacity">
                                            {g.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* --- 3. EXPORT / SHARE --- */}
            <button
                onClick={handleDownload}
                disabled={isExporting}
                className="absolute top-6 right-6 z-30 bg-white text-black p-3 rounded-full hover:scale-110 active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isExporting ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                )}
            </button>

        </div >
    );
}
