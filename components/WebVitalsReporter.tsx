'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendGAEvent } from '@next/third-parties/google';

export default function WebVitalsReporter() {
    useReportWebVitals((metric) => {
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(metric);
        }

        // Send to Google Analytics
        sendGAEvent('event', metric.name, {
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // GA expects integers for value
            event_label: metric.id,
            non_interaction: true,
        });
    });

    return null;
}
