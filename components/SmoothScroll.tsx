'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't initialize Lenis on studio, dashboard, or mobile devices (native scroll is better for mobile)
        const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
        if (pathname?.startsWith('/studio') || pathname?.startsWith('/dashboard') || isMobile) {
            return;
        }

        const lenis = new Lenis({
            duration: 0.85, // Was 1.2. Lower = Snappier/Faster settling (Less "slow")
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.15, // Was 1. Higher = moves more pixels per scroll tick
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [pathname]);

    return null;
}
