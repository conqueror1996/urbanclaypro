'use client';

import React from 'react';
import SampleModal from './SampleModal';
import { useSampleBox } from '@/context/SampleContext';

export default function GlobalSampleModal() {
    const { isBoxOpen, setBoxOpen } = useSampleBox();

    return (
        <SampleModal
            isOpen={isBoxOpen}
            onClose={() => setBoxOpen(false)}
        />
    );
}
