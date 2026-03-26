import { NextRequest, NextResponse } from 'next/server';
import { testZohoConnection } from '@/lib/zoho';
import { isValidAdminToken } from '@/lib/auth-constants';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    // 1. Auth Check - Prevent info leakage to unauthorized users
    const token = req.cookies.get('uc_admin_token')?.value;
    if (!isValidAdminToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await testZohoConnection();
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
