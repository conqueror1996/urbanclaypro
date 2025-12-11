import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function clearData() {
    console.log('--- CLEARING SANITY CONTENT ---');

    try {
        console.log('Deleting Products...');
        await client.delete({ query: '*[_type == "product"]' });

        console.log('Deleting Projects...');
        await client.delete({ query: '*[_type == "project"]' });

        console.log('Deleting Home Page Data...');
        await client.delete({ query: '*[_type == "homePage"]' });

        console.log('Deleting Collections (if separate)...');
        await client.delete({ query: '*[_type == "collection"]' });

        console.log('Deleting Assets (Images & Files)...');
        await client.delete({ query: '*[_type == "sanity.imageAsset" || _type == "sanity.fileAsset"]' });

        console.log('Deleting EVERYTHING else (Total Wipe)...');
        await client.delete({ query: '*[ !(_id in path("_.**")) ]' }); // Deletes all non-system documents

        console.log('✅ All content documents deleted.');
    } catch (err) {
        console.error('Deletion failed:', err);
    }
}

clearData();
