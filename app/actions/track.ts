'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { headers } from 'next/headers';

export async function trackFootprint(path: string, extraData?: { vitals?: any, errors?: string, referrer?: string }) {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Robust Bot Filter
        const lowerUA = userAgent.toLowerCase();
        const botSignatures = ['bot', 'spider', 'crawl', 'python', 'curl', 'wget', 'http', 'lighthouse', 'vercel'];

        // Return immediately if it matches any bot signature
        if (botSignatures.some(sig => lowerUA.includes(sig))) return;

        // Simple Device/Browser parsing (can be enhanced with a library like ua-parser-js if needed)
        const isMobile = /mobile/i.test(userAgent);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        await writeClient.create({
            _type: 'footprint',
            path: path,
            ip: ip,
            userAgent: userAgent,
            browser,
            deviceType,
            vitals: extraData?.vitals || {},
            errors: extraData?.errors || null,
            referrer: extraData?.referrer || null,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Tracking Error:', error);
        return { success: false };
    }
}
