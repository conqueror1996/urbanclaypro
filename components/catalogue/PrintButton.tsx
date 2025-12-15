'use client';

import React from 'react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-white text-black border border-black/10 px-8 py-4 uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white transition-all shadow-2xl backdrop-blur-md"
        >
            Export Monograph
        </button>
    );
}
