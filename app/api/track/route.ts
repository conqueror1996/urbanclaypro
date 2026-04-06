import { writeClient } from '@/sanity/lib/write-client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Robust tracking endpoint to replace Server Actions for high-frequency footprint logs.
 * Bypasses Next.js Action registration issues in development/Turbopack.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { path, extraData } = body;

        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = req.headers.get('user-agent') || 'unknown';

        // Background console log for server visibility
        console.log('📝 Tracking Footprint (API):', path);

        const isMobile = /mobile/i.test(userAgent);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';
        
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        await writeClient.create({
            _type: 'footprint',
            path: path || '/',
            ip: ip,
            userAgent: userAgent,
            browser,
            deviceType,
            vitals: extraData?.vitals || {},
            errors: extraData?.errors || null,
            referrer: extraData?.referrer || null,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking API Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
