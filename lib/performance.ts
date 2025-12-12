/**
 * Performance Monitoring Utilities
 * Provides helpers for measuring and logging performance metrics
 */

export interface PerformanceMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(): PerformanceMetric | null {
    if (typeof window === 'undefined') return null;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return null;

    const ttfb = navigation.responseStart - navigation.requestStart;

    return {
        name: 'TTFB',
        value: ttfb,
        rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor'
    };
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(): Promise<PerformanceMetric | null> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(null);
            return;
        }

        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');

            if (fcpEntry) {
                const fcp = fcpEntry.startTime;
                observer.disconnect();

                resolve({
                    name: 'FCP',
                    value: fcp,
                    rating: fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor'
                });
            }
        });

        observer.observe({ entryTypes: ['paint'] });

        // Timeout after 10 seconds
        setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, 10000);
    });
}

/**
 * Log performance metrics to console (dev only)
 */
export function logPerformanceMetrics() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    // TTFB
    const ttfb = measureTTFB();
    if (ttfb) {
        console.log(`⚡ ${ttfb.name}: ${ttfb.value.toFixed(2)}ms (${ttfb.rating})`);
    }

    // FCP
    measureFCP().then(fcp => {
        if (fcp) {
            console.log(`🎨 ${fcp.name}: ${fcp.value.toFixed(2)}ms (${fcp.rating})`);
        }
    });

    // Resource timing
    if (window.performance) {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        const totalSize = resources.reduce((acc, resource) => acc + (resource.transferSize || 0), 0);
        const totalDuration = resources.reduce((acc, resource) => acc + resource.duration, 0);

        console.log(`📦 Total Resources: ${resources.length}`);
        console.log(`💾 Total Transfer Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`⏱️ Total Resource Load Time: ${totalDuration.toFixed(2)}ms`);
    }
}

/**
 * Measure and report bundle size (client-side estimation)
 */
export function estimateBundleSize() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));

    const jsSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    const cssSize = cssResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);

    console.group('📊 Bundle Size Estimation');
    console.log(`JavaScript: ${(jsSize / 1024).toFixed(2)} KB`);
    console.log(`CSS: ${(cssSize / 1024).toFixed(2)} KB`);
    console.log(`Total: ${((jsSize + cssSize) / 1024).toFixed(2)} KB`);
    console.groupEnd();
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
    if (typeof window === 'undefined') return;

    // Wait for page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            logPerformanceMetrics();
            estimateBundleSize();
        }, 0);
    });
}
