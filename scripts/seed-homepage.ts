
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('❌ Missing required environment variables.');
    console.error('Please ensure .env.local contains:');
    console.error('- NEXT_PUBLIC_SANITY_PROJECT_ID');
    console.error('- NEXT_PUBLIC_SANITY_DATASET');
    console.error('- SANITY_API_TOKEN (Write token)');
    process.exit(1);
}

// Initialize client with token for write access
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
});

async function uploadImage(url: string) {
    try {
        console.log(`   Downloading image: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        console.log(`   Uploading asset to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: url.split('/').pop() || 'image.jpg'
        });
        console.log(`   ✅ Uploaded asset: ${asset._id}`);
        return asset;
    } catch (error) {
        console.error(`   ❌ Failed to upload image from ${url}:`, error);
        return null;
    }
}

async function seedHomePage() {
    console.log('🌱 Seeding Home Page data...');

    const homePageData = {
        _id: 'homePage',
        _type: 'homePage',
        title: 'Main Home Page',
        heroHeading: 'Premium Terracotta for Facades & Interiors',
        heroSubheading: 'Crafted for timeless spaces, engineered for performance. Discover our range of sustainable clay products.',
        // Temporary Unsplash images for "Premium" look
        heroImageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop', // Construction/Clay/Architecture
        ourStoryImageUrl: 'https://images.unsplash.com/photo-1459749411177-d4a414c9ff5f?q=80&w=2070&auto=format&fit=crop', // Artisan/Hands/Clay
    };

    try {
        // 1. Upload Hero Image
        console.log('Processing Hero Image...');
        const heroAsset = await uploadImage(homePageData.heroImageUrl);
        let heroImageObject = undefined;
        if (heroAsset) {
            heroImageObject = {
                _type: 'image',
                asset: { _type: 'reference', _ref: heroAsset._id },
                alt: 'Modern Terracotta Facade'
            };
        }

        // 2. Upload Our Story Image
        console.log('Processing Our Story Image...');
        const storyAsset = await uploadImage(homePageData.ourStoryImageUrl);
        let storyImageObject = undefined;
        if (storyAsset) {
            storyImageObject = {
                _type: 'image',
                asset: { _type: 'reference', _ref: storyAsset._id },
                alt: 'Artisan crafting clay'
            };
        }

        // 3. Create/Replace Document
        const doc = {
            _id: 'homePage',
            _type: 'homePage',
            title: homePageData.title,
            heroHeading: homePageData.heroHeading,
            heroSubheading: homePageData.heroSubheading,
            heroImage: heroImageObject,
            ourStoryImage: storyImageObject
        };

        const res = await client.createOrReplace(doc);
        console.log(`✅ Home Page Seeded Successfully! Document ID: ${res._id}`);

    } catch (error) {
        console.error('❌ Error seeding home page:', error);
    }
}

seedHomePage();
