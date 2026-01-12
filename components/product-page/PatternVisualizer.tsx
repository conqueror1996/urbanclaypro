'use client';

import React from 'react';
// import WallStyler from '../WallStyler'; // Assuming this is in components/WallStyler.tsx

interface PatternVisualizerProps {
    title: string;
    variantImages?: string[];
}

export default function PatternVisualizer({ title, variantImages }: PatternVisualizerProps) {
    return (
        <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden relative shadow-inner bg-black/20 flex items-center justify-center text-white/50">
            {/* The WallStyler itself should just take up the space */}
            {/* <WallStyler initialColor={getBrickColor()} variantImages={variantImages} /> */}
            <p>Visualizer upgrading...</p>

            {/* Optional Overlay if WallStyler doesn't provide controls context */}

            {/* Optional Overlay if WallStyler doesn't provide controls context */}
            <div className="absolute top-4 right-4 pointer-events-none">
                <span className="bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    Interactive
                </span>
            </div>
        </div>
    );
}
