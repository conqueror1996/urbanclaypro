'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const FootprintTracker = dynamic(() => import("@/components/FootprintTracker"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), { ssr: false });
const SmartExitPopup = dynamic(() => import("@/components/SmartExitPopup"), { ssr: false });
const GlobalSampleModal = dynamic(() => import("@/components/GlobalSampleModal"), { ssr: false });
const WebVitalsReporter = dynamic(() => import("../components/WebVitalsReporter"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), { ssr: false });
const SplashLoader = dynamic(() => import("@/components/SplashLoader"), { ssr: false });

export default function GlobalClientFeatures() {
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
