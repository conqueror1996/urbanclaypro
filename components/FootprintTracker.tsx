'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { trackFootprint } from '@/app/actions/track';

export default function FootprintTracker() {
    const pathname = usePathname();
    const [lastTrackedPath, setLastTrackedPath] = useState('');

    useEffect(() => {
        if (!pathname || pathname === lastTrackedPath) return;

        // Debounce or simple unique check
        // We only track meaningful unique visits to a path in this session context
        // OR simply track every navigation:

        async function logVisit() {
            if (process.env.NODE_ENV === 'development') return; // Don't track localhost

            try {
                await trackFootprint(pathname);
                setLastTrackedPath(pathname);
            } catch (err) {
                // Fail silently
            }
        }

        // Small delay to ensure it's not a bounce
        const timer = setTimeout(logVisit, 1000);
        return () => clearTimeout(timer);

    }, [pathname, lastTrackedPath]);

    return null;
}
