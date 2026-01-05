import React from 'react';

export default function CatalogueIntro() {
    return (
        <div className="w-full h-full bg-[#f4f1ea] text-[#1a1512] p-16 flex relative overflow-hidden font-sans">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none z-0"></div>

            {/* Background visual element */}
            <div className="absolute right-0 top-0 w-[40%] h-full border-l border-[#1a1512]/10 z-0" />

            <div className="w-full h-full z-10 flex gap-20 relative">

                {/* Left Column - The Manifest */}
                <div className="w-[60%] flex flex-col justify-center pr-12">
                    <span className="text-[var(--terracotta)] font-bold text-xs mb-8 tracking-widest uppercase">00.1 — Preface</span>

                    <h2 className="text-6xl font-serif leading-tight mb-12 text-[#1a1512]">
                        "We do not sell tiles. <br />
                        We curate <span className="italic text-neutral-500 font-light">permanence</span>."
                    </h2>

                    <div className="text-lg font-serif text-[#1a1512]/80 space-y-8 leading-loose max-w-xl text-justify border-l-2 border-[#1a1512] pl-8">
                        <p>
                            In a world of fleeting digital facades, Urban Clay returns to the geological.
                            Our systems are born from the chaotic union of intense heat and raw earth.
                            They are imperfections mastered.
                        </p>
                        <p>
                            This catalogue is not a list. It is a gallery of possibility for the
                            architect who understands that a building's skin is its primary
                            mode of communication with the city.
                        </p>
                    </div>

                    <div className="flex gap-16 pt-12 mt-12 border-t border-[#1a1512]/10">
                        <div>
                            <span className="block text-4xl font-serif text-[#1a1512]">1200°C</span>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 block">Firing Temp</span>
                        </div>
                        <div>
                            <span className="block text-4xl font-serif text-[#1a1512]">100+</span>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1 block">Years Lifespan</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Visual Anchor */}
                <div className="w-[40%] flex flex-col justify-end items-start pl-12 relative">
                    <div className="absolute top-20 left-12 w-16 h-16 bg-[var(--terracotta)] rounded-full mix-blend-multiply opacity-80" />
                    <div className="absolute top-24 left-16 w-16 h-16 bg-[#1a1512] rounded-full mix-blend-multiply opacity-80" />

                    <div className="mt-auto mb-20 w-full">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1512] border-b border-[#1a1512] pb-2">Material Index</h3>
                        <ul className="space-y-4 font-serif text-2xl text-neutral-400 italic">
                            <li className="text-[#1a1512] not-italic font-medium">The Handmades</li>
                            <li>The Linear</li>
                            <li>The Ventilated</li>
                            <li>The Baguettes</li>
                        </ul>
                    </div>

                    <div className="w-full h-64 bg-neutral-200 relative grayscale contrast-125">
                        <img src="https://images.unsplash.com/photo-1596237553535-c384dc7e2b7e?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                </div>

            </div>
        </div>
    );
}
