import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { CITIES } from '../lib/locations';
import { writeClient } from '../sanity/lib/write-client';

// This script migrates the hardcoded CITIES object to Sanity
async function migrateCities() {
    console.log('Starting City Migration...');

    for (const [slug, data] of Object.entries(CITIES)) {
        console.log(`Processing ${data.name}...`);

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
            console.log(`✅ ${data.name} migrated.`);
        } catch (e: any) {
            console.error(`❌ Failed to migrate ${data.name}:`, e.message);
        }
    }

    console.log('Migration Complete.');
}

migrateCities();
