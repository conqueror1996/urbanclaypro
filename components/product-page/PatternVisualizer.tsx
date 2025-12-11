'use client';

import React from 'react';
import WallStyler from '../WallStyler'; // Assuming this is in components/WallStyler.tsx

interface PatternVisualizerProps {
    title: string;
    variantImages?: string[];
}

export default function PatternVisualizer({ title, variantImages }: PatternVisualizerProps) {
    // Determine brick color based on title (Basic heuristic)
    const getBrickColor = () => {
        const t = title.toLowerCase();
        if (t.includes('grey') || t.includes('silver')) return '#6b7280';
        if (t.includes('chocolate') || t.includes('brown')) return '#3f2e27';
        if (t.includes('beige') || t.includes('cream')) return '#d6cbb8';
        if (t.includes('charcoal') || t.includes('black')) return '#1f2937';
        if (t.includes('white')) return '#f3f4f6';
        return '#b45a3c'; // Default Terracotta
    };

    return (
        <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden relative shadow-inner bg-black/20">
            {/* The WallStyler itself should just take up the space */}
            <WallStyler initialColor={getBrickColor()} variantImages={variantImages} />

            {/* Optional Overlay if WallStyler doesn't provide controls context */}
            <div className="absolute top-4 right-4 pointer-events-none">
                <span className="bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    Interactive
                </span>
            </div>
        </div>
    );
}
