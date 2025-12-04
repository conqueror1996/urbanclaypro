
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('❌ Missing required environment variables.');
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
});

async function clean() {
    console.log('🧹 Cleaning Sanity Data...');

    try {
        // Delete all products
        const products = await client.delete({ query: '*[_type == "product"]' });
        console.log(`✅ Deleted products`);

        // Delete all projects
        const projects = await client.delete({ query: '*[_type == "project"]' });
        console.log(`✅ Deleted projects`);

        console.log('✨ Cleanup complete.');
    } catch (error) {
        console.error('❌ Error cleaning data:', error);
    }
}

clean();
