/**
 * Resource Hints Component
 * Adds preconnect and dns-prefetch for external resources
 * to improve loading performance
 */

export default function ResourceHints() {
    return (
        <>
            {/* Preconnect to Sanity CDN */}
            <link rel="preconnect" href="https://cdn.sanity.io" />
            <link rel="dns-prefetch" href="https://cdn.sanity.io" />

            {/* Preconnect to Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            {/* Preconnect to Google Analytics */}
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

            {/* Preconnect to Unsplash (if used) */}
            <link rel="preconnect" href="https://images.unsplash.com" />
            <link rel="dns-prefetch" href="https://images.unsplash.com" />
        </>
    );
}
