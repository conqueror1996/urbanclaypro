import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2023-05-03',
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
