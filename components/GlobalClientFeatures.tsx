'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import React from 'react';

const FootprintTracker = dynamic(() => import("@/components/FootprintTracker"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), { ssr: false });
const SmartExitPopup = dynamic(() => import("@/components/SmartExitPopup"), { ssr: false });
const GlobalSampleModal = dynamic(() => import("@/components/GlobalSampleModal"), { ssr: false });
const WebVitalsReporter = dynamic(() => import("../components/WebVitalsReporter"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const SplashLoader = dynamic(() => import("@/components/SplashLoader"), { ssr: false });

export default function GlobalClientFeatures() {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith('/studio');

    // Bypass ALL global UI features if in Sanity Studio to maximize performance
    // and prevent collisions with Studio's internal scrolling and UI logic.
    if (isStudio) return null;

    return (
        <>
            <SmoothScroll />
            <SplashLoader />
            <FootprintTracker />
            <WebVitalsReporter />
            <GlobalSampleModal />
            <SmartExitPopup />
            <WhatsAppFloat />
        </>
    );
}
