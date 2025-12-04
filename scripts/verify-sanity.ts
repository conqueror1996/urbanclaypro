
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
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

async function verifyData() {
    console.log('🔍 Verifying Sanity Data Connection...');
    console.log(`   Project ID: ${projectId}`);
    console.log(`   Dataset: ${dataset}`);

    try {
        // 1. Check Products
        const products = await client.fetch(`*[_type == "product"] {
            title,
            "imageUrl": images[0].asset->url,
            "variantsCount": count(variants),
            "collectionsCount": count(collections)
        }`);
        console.log(`\n✅ Products Found: ${products.length}`);
        products.forEach((p: any) => {
            console.log(`   - ${p.title} (Image: ${p.imageUrl ? '✅' : '❌'}, Variants: ${p.variantsCount}, Collections: ${p.collectionsCount})`);
        });

        // 2. Check Projects
        const projects = await client.fetch(`*[_type == "project"] {
            title,
            "imageUrl": image.asset->url
        }`);
        console.log(`\n✅ Projects Found: ${projects.length}`);
        projects.forEach((p: any) => {
            console.log(`   - ${p.title} (Image: ${p.imageUrl ? '✅' : '❌'})`);
        });

        // 3. Check HomePage
        const homePage = await client.fetch(`*[_type == "homePage"][0] {
            heroHeading,
            "heroImageUrl": heroImage.asset->url
        }`);
        if (homePage) {
            console.log(`\n✅ HomePage Data Found`);
            console.log(`   - Heading: ${homePage.heroHeading}`);
            console.log(`   - Hero Image: ${homePage.heroImageUrl ? '✅' : '❌'}`);
        } else {
            console.log(`\n⚠️ HomePage Data Not Found (Using fallback in app?)`);
        }

    } catch (error) {
        console.error('❌ Error fetching data:', error);
    }
}

verifyData();
