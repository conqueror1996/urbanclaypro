import React from 'react';

export default function CatalogueCover() {
    return (
        <div className="w-full h-full bg-[#0a0a0a] text-[#e5e5e5] relative overflow-hidden flex flex-col justify-between p-0">

            {/* Background Image - Abstract & Moody */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
            </div>

            {/* Top Bar */}
            <div className="relative z-10 p-12 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">Restricted</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-400">Circulation</span>
                </div>
                <div className="text-right">
                    <div className="w-8 h-8 border border-neutral-600 rounded-full flex items-center justify-center text-[10px] font-mono text-neutral-400">
                        01
                    </div>
                </div>
            </div>

            {/* Center Title - Massive & Broken */}
            <div className="relative z-10 px-12">
                <h1 className="text-[140px] leading-[0.8] font-serif uppercase tracking-tighter text-white mix-blend-exclusion">
                    <span className="block ml-[-8px]">Artefact</span>
                    <span className="block font-light text-neutral-500 italic text-[80px] leading-[0.5] translate-x-32 my-4">
                        & Origin
                    </span>
                    <span className="block text-right">Facade</span>
                </h1>
            </div>

            {/* Footer Details */}
            <div className="relative z-10 p-12 flex items-end justify-between border-t border-white/10 mx-12">
                <div className="flex flex-col max-w-[200px]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c45d3f] mb-2">The 2025 Monograph</span>
                    <p className="text-[10px] leading-relaxed text-neutral-400">
                        A curation of fired earth systems for the contemporary avant-garde architect.
                    </p>
                </div>

                <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-1">Urban Clay</span>
                    <span className="block text-3xl font-serif">Signature Series</span>
                </div>
            </div>

        </div>
    );
}
