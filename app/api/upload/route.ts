import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

export async function POST(req: NextRequest) {
    // 1. Auth Check
    const token = req.cookies.get('uc_admin_token')?.value;
    if (token !== 'clay2025' && token !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Initialize Sanity client at runtime to avoid build-time env var issues
        const client = createClient({
            projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '22qqjddz',
            dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
            token: process.env.SANITY_API_TOKEN,
            apiVersion: '2024-01-01',
            useCdn: false,
        });

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const assetType = file.type.startsWith('image/') ? 'image' : 'file';

        const asset = await client.assets.upload(assetType, Buffer.from(buffer), {
            filename: file.name
        });

        return NextResponse.json({
            success: true,
            asset: {
                _id: asset._id,
                url: asset.url
            }
        });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Upload Failed', details: error }, { status: 500 });
    }
}
