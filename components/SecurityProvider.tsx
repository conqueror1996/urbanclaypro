'use client';

import { useEffect, ReactNode } from 'react';

export default function SecurityProvider({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Disable keyboard shortcuts for DevTools and Source View
        const handleKeyDown = (e: KeyboardEvent) => {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                e.stopPropagation();
            }

            // Ctrl+Shift+I (DevTools), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect)
            // Mac: Meta+Option+I (DevTools), Meta+Option+J (Console), Meta+Option+C (Inspect)
            if (
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()))
            ) {
                e.preventDefault();
                e.stopPropagation();
            }

            // Ctrl+U (View Source)
            // Mac: Meta+Option+U
            if (
                (e.ctrlKey && e.key.toLowerCase() === 'u') ||
                (e.metaKey && e.altKey && e.key.toLowerCase() === 'u')
            ) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Initial warning in console
        console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0 black;');
        console.log('%cThis is a browser feature intended for developers. Access is restricted for security.', 'font-size: 20px;');

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return <>{children}</>;
}
