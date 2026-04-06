'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export default function FootprintTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef('');

    // Store vitals for the current page view
    const vitals = useRef<{ lcp?: number; cls?: number; fid?: number; ttfb?: number; fcp?: number }>({});

    // Robust fetch-based tracking function (bypasses Server Action sync issues)
    const track = async (path: string, extraData?: any) => {
        try {
            await fetch('/api/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path, extraData }),
                keepalive: true, // Crucial for fire-and-forget during page unloading
            });
        } catch (e) {
            // Silently fail for tracking
        }
    };

    // Web Vitals Hook (Standard Next.js 13+)
    useReportWebVitals((metric) => {
        switch (metric.name) {
            case 'FCP': vitals.current.fcp = metric.value; break;
            case 'LCP': vitals.current.lcp = metric.value; break;
            case 'CLS': vitals.current.cls = metric.value; break;
            case 'FID': vitals.current.fid = metric.value; break;
            case 'TTFB': vitals.current.ttfb = metric.value; break;
        }
    });

    useEffect(() => {
        if (!pathname || pathname === lastTrackedPath.current) return;

        lastTrackedPath.current = pathname;

        // Reset vitals for new path
        vitals.current = {};

        // 1. Log Initial Page View immediately
        track(pathname, { referrer: document.referrer });

        // 2. Schedule Vitals Log (Wait for LCP/CLS to settle, ~3-4 seconds)
        const vitalsTimer = setTimeout(() => {
            const hasData = Object.keys(vitals.current).length > 0;
            if (hasData) {
                track(pathname, { vitals: vitals.current, referrer: document.referrer });
            }
        }, 1000);

        // 3. Error Listener (Global)
        const handleError = (event: ErrorEvent) => {
            track(pathname, { errors: event.message, referrer: document.referrer });
        };
        window.addEventListener('error', handleError);

        return () => {
            clearTimeout(vitalsTimer);
            window.removeEventListener('error', handleError);
        };

    }, [pathname]);

    return null;
}
