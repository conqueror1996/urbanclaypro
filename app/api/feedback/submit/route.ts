import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

import { projectId, dataset, apiVersion } from '@/sanity/env';

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { siteId, workmanship, material, service, comments, images } = body;

        await client.create({
            _type: 'feedback',
            site: { _type: 'reference', _ref: siteId },
            workmanshipRating: workmanship,
            materialRating: material,
            serviceRating: service,
            comments,
            siteImages: images,
            submittedAt: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
