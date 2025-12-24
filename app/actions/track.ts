'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { headers } from 'next/headers';

export async function trackFootprint(path: string) {
    try {
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        // Simple Bot Filter
        if (userAgent.includes('bot') || userAgent.includes('spider')) return;

        await writeClient.create({
            _type: 'footprint',
            path: path,
            ip: ip,
            userAgent: userAgent,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Tracking Error:', error);
        return { success: false };
    }
}
