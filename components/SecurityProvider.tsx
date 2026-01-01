'use client';

import { ReactNode } from 'react';

/**
 * SecurityProvider - Refactored to allow inspection.
 * Previous implementation disabled right-click and dev tools.
 */
export default function SecurityProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
