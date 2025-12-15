import React from 'react';

export default function CatalogueIntro() {
    return (
        <div className="w-full h-full bg-[#111] text-white p-16 flex relative overflow-hidden">

            {/* Background visual element */}
            <div className="absolute right-0 top-0 w-[40%] h-full bg-[#161616] border-l border-white/5" />

            <div className="w-full h-full z-10 flex gap-20">

                {/* Left Column - The Manifest */}
                <div className="w-[60%] flex flex-col justify-center pr-12">
                    <span className="text-[#c45d3f] font-mono text-xs mb-8 tracking-widest uppercase">00.1 — Preface</span>

                    <h2 className="text-6xl font-serif leading-tight mb-12">
                        "We do not sell tiles. <br />
                        We curate <span className="italic text-neutral-500">permanence</span>."
                    </h2>

                    <div className="text-lg font-light text-neutral-400 space-y-8 leading-relaxed max-w-xl text-justify">
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
                        <div className="flex gap-8 pt-8 border-t border-white/10 mt-8">
                            <div>
                                <span className="block text-2xl font-serif text-white">1200°C</span>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Firing Temp</span>
                            </div>
                            <div>
                                <span className="block text-2xl font-serif text-white">100+</span>
                                <span className="text-[10px] uppercase tracking-widest text-neutral-500">Years Lifespan</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Visual Anchor */}
                <div className="w-[40%] flex flex-col justify-end items-start pl-12 border-l border-white/10 relative">
                    <div className="absolute top-20 left-12 w-48 h-1 bg-[#c45d3f]" />

                    <div className="mt-auto mb-20">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-white">Material Index</h3>
                        <ul className="space-y-4 font-serif text-2xl text-neutral-500 italic">
                            <li className="text-white">The Handmades</li>
                            <li>The Linear</li>
                            <li>The Ventilated</li>
                            <li>The Baguettes</li>
                        </ul>
                    </div>

                    <div className="w-full h-64 bg-neutral-800 relative grayscale opacity-60">
                        <img src="https://images.unsplash.com/photo-1596237553535-c384dc7e2b7e?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-overlay" />
                    </div>
                </div>

            </div>
        </div>
    );
}
