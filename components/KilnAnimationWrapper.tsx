'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const KilnAnimation = dynamic(() => import('./KilnAnimation'), {
    loading: () => <div className="h-screen supports-[height:100dvh]:h-[100dvh] w-full bg-transparent flex items-center justify-center"><span className="animate-pulse text-gray-400 font-serif tracking-widest text-sm uppercase">Loading kiln...</span></div>,
    ssr: false
});

export default function KilnAnimationWrapper(props: any) {
    return (
        <div className="hidden md:block">
            <KilnAnimation {...props} />
        </div>
    );
}
