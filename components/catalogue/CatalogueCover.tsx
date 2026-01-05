import React from 'react';

export default function CatalogueCover() {
    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] relative overflow-hidden flex flex-col justify-between p-0 font-sans">

            {/* DECORATIVE: Top-Left Corner Mark */}
            <div className="absolute top-0 left-0 w-32 h-32 border-r border-b border-[#1a1512] z-20"></div>

            {/* BACKGROUND TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

            {/* TOP BAR */}
            <header className="relative z-10 p-12 flex justify-between items-start border-b border-[#1a1512]">
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold uppercase tracking-[0.25em]">UrbanClay®</h1>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Architectural Ceramics</p>
                </div>

                <div className="flex flex-col text-right">
                    <span className="text-[10px] font-mono border border-[#1a1512] px-2 py-1 rounded-full w-fit ml-auto mb-1">VOL. 01 — 2025</span>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-500">Mumbai / New Delhi / Bangalore</span>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative z-10 flex-grow flex flex-col justify-center px-12 md:px-24">

                {/* Visual Anchor Line */}
                <div className="w-[1px] h-32 bg-[#1a1512] mx-auto mb-12"></div>

                <h2 className="text-center font-serif text-[clamp(60px,12vw,160px)] leading-[0.8] tracking-tighter text-[#1a1512]">
                    <span className="block italic font-light opacity-60">The</span>
                    <span className="block">Monolith</span>
                </h2>

                <div className="mt-12 max-w-lg mx-auto text-center">
                    <p className="text-sm md:text-lg font-serif italic text-neutral-600 leading-relaxed">
                        "A definitive monograph on the synthesis of earth, fire, and architectural form."
                    </p>
                    <div className="mt-8 flex justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#c45d3f]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#1a1512]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#e5e5e5] border border-black"></span>
                    </div>
                </div>

            </main>

            {/* FOOTER METADATA */}
            <footer className="relative z-10 p-12 border-t border-[#1a1512] flex justify-between items-end">
                <div className="max-w-xs">
                    <strong className="block text-[10px] uppercase tracking-widest mb-4">Content Specification</strong>
                    <ul className="text-[10px] space-y-1 font-mono text-neutral-600">
                        <li className="flex justify-between w-48 border-b border-neutral-300 pb-1">
                            <span>Material</span>
                            <span>Terracotta (Clay)</span>
                        </li>
                        <li className="flex justify-between w-48 border-b border-neutral-300 pb-1">
                            <span>Origin</span>
                            <span>India</span>
                        </li>
                        <li className="flex justify-between w-48 border-b border-neutral-300 pb-1">
                            <span>Type</span>
                            <span>Architectural</span>
                        </li>
                    </ul>
                </div>

                <div className="hidden md:block">
                    {/* Barcode / QR Simulation */}
                    <div className="flex gap-1 h-8 items-end opacity-80">
                        <div className="w-1 h-full bg-black"></div>
                        <div className="w-2 h-full bg-black"></div>
                        <div className="w-0.5 h-full bg-black"></div>
                        <div className="w-4 h-full bg-black"></div>
                        <div className="w-1 h-full bg-black"></div>
                        <div className="w-0.5 h-full bg-black"></div>
                        <div className="w-3 h-full bg-black"></div>
                        <span className="text-[8px] font-mono ml-2 tracking-widest self-end">ISSN 2025-UC</span>
                    </div>
                </div>
            </footer>

        </div>
    );
}
