
import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/locations';
import { writeClient } from '@/sanity/lib/write-client';

export async function GET() {
    console.log('Starting City Migration via API...');

    const results = [];

    for (const [slug, data] of Object.entries(CITIES)) {

        const doc = {
            _type: 'cityPage',
            _id: `city-${slug}`, // Deterministic ID
            name: data.name,
            slug: { _type: 'slug', current: slug },
            region: data.region,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            heroTitle: data.heroTitle,
            heroSubtitle: data.heroSubtitle,
            climateAdvice: data.climateAdvice,
            areasServed: data.areasServed,
            popularProducts: data.popularProducts
        };

        try {
            await writeClient.createOrReplace(doc);
            results.push({ city: data.name, status: 'migrated' });
        } catch (e: any) {
            console.error(`❌ Failed to migrate ${data.name}:`, e.message);
            results.push({ city: data.name, status: 'failed', error: e.message });
        }
    }

    return NextResponse.json({ success: true, results });
}
