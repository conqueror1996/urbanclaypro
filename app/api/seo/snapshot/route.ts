
import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '../../../../sanity/lib/write-client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { score, details } = body;

        await writeClient.create({
            _type: 'seoSnapshot',
            date: new Date().toISOString(),
            score,
            details
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
