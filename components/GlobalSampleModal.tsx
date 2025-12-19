'use client';

import React, { useState, useEffect } from 'react';
import SampleModal from './SampleModal';
import CheckoutModal from './CheckoutModal';
import { useSampleBox } from '@/context/SampleContext';

export default function GlobalSampleModal() {
    const { isBoxOpen, setBoxOpen } = useSampleBox();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [sampleType, setSampleType] = useState<'regular' | 'curated'>('regular');

    useEffect(() => {
        const handleOpenCheckout = (e: any) => {
            setSampleType(e.detail.type);
            setBoxOpen(false); // Close sample modal
            setCheckoutOpen(true); // Open checkout
        };

        window.addEventListener('openCheckout', handleOpenCheckout);
        return () => window.removeEventListener('openCheckout', handleOpenCheckout);
    }, [setBoxOpen]);

    return (
        <>
            <SampleModal
                isOpen={isBoxOpen}
                onClose={() => setBoxOpen(false)}
            />
            <CheckoutModal
                isOpen={checkoutOpen}
                onClose={() => setCheckoutOpen(false)}
                sampleType={sampleType}
            />
        </>
    );
}
