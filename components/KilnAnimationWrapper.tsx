'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const KilnAnimation = dynamic(() => import('./KilnAnimation'), {
    loading: () => <div className="h-screen w-full bg-[#f5f0eb] flex items-center justify-center"><span className="animate-pulse text-transparant">Loading kiln...</span></div>,
    ssr: false
});

export default function KilnAnimationWrapper(props: any) {
    return <KilnAnimation {...props} />;
}
