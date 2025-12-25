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
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        await client.delete(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Sanity Delete Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
