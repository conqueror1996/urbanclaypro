import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('uid');

    // 1. Return a transparent 1x1 GIF immediately (Speed is key)
    const transparentGif = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
    );

    // 2. Async Tracking (Fire & Forget)
    if (leadId) {
        // We catch errors so the image never fails to load
        writeClient
            .patch(leadId)
            .inc({ opens: 1 })
            .set({ lastOpenedAt: new Date().toISOString() })
            .commit()
            .catch((err: any) => console.error('Tracking Error', err));
    }

    return new NextResponse(transparentGif, {
        headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
}
