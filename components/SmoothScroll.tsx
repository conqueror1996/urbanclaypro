'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
    const pathname = usePathname();

    useEffect(() => {
        // Only enable on desktop (min-width: 1024px) for luxury experience
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        let lenis: Lenis | null = null;

        const initLenis = () => {
            // Skip on studio/dashboard pages
            if (pathname?.startsWith('/studio') || pathname?.startsWith('/dashboard')) {
                return;
            }

            if (mediaQuery.matches && !lenis) {
                // Initialize Lenis for smooth, luxury scrolling (desktop only)
                lenis = new Lenis({
                    duration: 1.2, // Smooth, luxury duration
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing
                    orientation: 'vertical',
                    gestureOrientation: 'vertical',
                    smoothWheel: true,
                    wheelMultiplier: 1, // Standard scroll speed
                    touchMultiplier: 2,
                    infinite: false,
                });

                // RAF loop
                function raf(time: number) {
                    lenis?.raf(time);
                    requestAnimationFrame(raf);
                }

                requestAnimationFrame(raf);
            } else if (!mediaQuery.matches && lenis) {
                // Destroy Lenis on mobile/tablet for native scrolling
                lenis.destroy();
                lenis = null;
            }
        };

        // Initialize on mount
        initLenis();

        // Listen for resize to enable/disable based on screen size
        mediaQuery.addEventListener('change', initLenis);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', initLenis);
            if (lenis) {
                lenis.destroy();
            }
        };
    }, [pathname]);

    return null;
}
