'use client';

import React, { useState, useEffect } from 'react';
import SampleModal from './SampleModal';
import CheckoutModal from './CheckoutModal';
import { useSampleBox } from '@/context/SampleContext';

export default function GlobalSampleModal() {
    const { isBoxOpen, setBoxOpen } = useSampleBox();
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [sampleType, setSampleType] = useState<'regular' | 'curated'>('regular');
    const [consultationData, setConsultationData] = useState<any>(null);

    useEffect(() => {
        const handleOpenCheckout = (e: any) => {
            setSampleType(e.detail.type);
            setBoxOpen(false); // Close sample modal
            setCheckoutOpen(true); // Open checkout
        };

        const handleSwitchToConsultation = (e: any) => {
            setConsultationData(e.detail);
            setCheckoutOpen(false);
            setBoxOpen(true); // Re-open sample modal (which now acts as consultation form)
        };

        window.addEventListener('openCheckout', handleOpenCheckout);
        window.addEventListener('switchToConsultation', handleSwitchToConsultation);

        return () => {
            window.removeEventListener('openCheckout', handleOpenCheckout);
            window.removeEventListener('switchToConsultation', handleSwitchToConsultation);
        };
    }, [setBoxOpen]);

    return (
        <>
            <SampleModal
                isOpen={isBoxOpen}
                initialData={consultationData}
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
