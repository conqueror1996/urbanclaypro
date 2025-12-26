'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const ProjectAtlasMap = dynamic(() => import('./ProjectAtlasMap'), {
    loading: () => <div className="aspect-[4/5] w-full max-w-md mx-auto bg-white/5 animate-pulse rounded-xl" />,
    ssr: false
});

export default function ProjectAtlasMapWrapper(props: any) {
    return <ProjectAtlasMap {...props} />;
}
