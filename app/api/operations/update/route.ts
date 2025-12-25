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
