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
        const { id, data } = body;

        if (!id || !data) {
            return NextResponse.json({ error: 'Missing ID or Data' }, { status: 400 });
        }

        const result = await client.patch(id).set(data).commit();

        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        console.error('Sanity Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
