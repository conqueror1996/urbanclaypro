
import { NextResponse } from 'next/server';
import { testZohoConnection } from '@/lib/zoho';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await testZohoConnection();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
