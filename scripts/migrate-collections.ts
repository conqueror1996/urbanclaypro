
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '22qqjddz',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN || process.env.tmp_sanity_token, // Ensure you have a write token in .env.local
});

const CATEGORY_METADATA = {
    'exposed-bricks': {
        displayTitle: 'Exposed Bricks',
        metaTitle: 'Premium Exposed Wirecut Bricks | Red, Grey & Beige Facade Bricks',
        metaDescription: 'Buy India\'s finest range of wirecut and handmade exposed bricks. Perfect for sustainable, breathable, and timeless facades. Available in Bangalore, Mumbai, Delhi.',
        keywords: ['exposed bricks', 'wirecut bricks', 'facing bricks', 'red clay bricks', 'facade bricks india']
    },
    'brick-wall-tiles': {
        displayTitle: 'Brick Wall Tiles',
        metaTitle: 'Thin Brick Cladding Tiles & Interior Brick Venners | Urban Clay',
        metaDescription: 'Transform your interiors and exteriors with thin brick cladding tiles. Get the authentic exposed brick look with easy installation and minimal weight.',
        keywords: ['brick cladding tiles', 'exposed brick tiles', 'wall cladding', 'interior brick veneer', 'thin bricks']
    },
    'terracotta-jaali': {
        displayTitle: 'Terracotta Jali',
        metaTitle: 'Terracotta Jaali Blocks & Ventilation Breeze Blocks | Urban Clay',
        metaDescription: 'Natural terracotta ventilation blocks (Jaali) that reduce indoor temperature and add artistic shadow patterns to building facades. Sustainable cooling solutions.',
        keywords: ['terracotta jaali', 'jaali blocks', 'breeze blocks', 'ventilation blocks', 'clay jali', 'facade screens']
    },
    'floor-tiles': {
        displayTitle: 'Floor Tiles',
        metaTitle: 'Handmade Terracotta Floor Tiles & Paving Bricks | Urban Clay',
        metaDescription: 'Handcrafted terracotta floor tiles for a rustic, earthen touch. Cool underfoot, durable, and naturally slip-resistant. Perfect for farmhouses and verandas.',
        keywords: ['terracotta floor tiles', 'clay pavers', 'handmade tiles', 'rustic flooring', 'red floor tiles']
    },
    'roof-tiles': {
        displayTitle: 'Roof Tiles',
        metaTitle: 'Premium Clay Roof Tiles for Indian Climate | Urban Clay',
        metaDescription: 'Weather-proof clay roof tiles that offer superior thermal insulation. Authentic Mangalore and pot tiles for heritage and modern tropical roofs.',
        keywords: ['clay roof tiles', 'mangalore tiles', 'roofing tiles interior', 'cooling roof tiles', 'weather proof tiles']
    },
    'facades': {
        displayTitle: 'Clay Facade Panels',
        metaTitle: 'Ventilated Clay Facade Systems & Louvers | Urban Clay',
        metaDescription: 'Advanced ventilated facade systems for commercial and high-end residential projects. Energy-efficient, rain-screen cladding, and baguettes.',
        keywords: ['ventilated facade', 'clay facade panels', 'terracotta cladding', 'facade louvers', 'architectural facade']
    },
    'wirecut-bricks': {
        displayTitle: 'Wirecut Bricks',
        metaTitle: 'Machine-Cut Wirecut Bricks | Uniform Facade Masonry',
        metaDescription: 'Precision-made wirecut bricks for modern exposed brick facades. High strength, sharp edges, and consistent sizing.',
        keywords: ['wirecut bricks', 'machine bricks', 'exposed masonry', 'red wirecut', 'bangalore bricks']
    },
    'breeze-blocks': {
        displayTitle: 'Breeze Blocks',
        metaTitle: 'Terracotta Breeze Blocks & Ventilation Jali | Urban Clay',
        metaDescription: 'Sustainable terracotta breeze blocks for natural ventilation and shading. Perfect for tropical architecture and screening.',
        keywords: ['breeze blocks', 'ventilation blocks', 'hollow blocks', 'screen wall', 'terracotta jali']
    }
};

async function migrate() {
    console.log('🚀 Starting Migration of Collections to Sanity...');

    if (!client.config().token) {
        console.error('❌ Error: SANITY_API_TOKEN is missing in .env.local');
        console.log('Please add your Sanity Write Token to .env.local as SANITY_API_TOKEN=sk...');
        process.exit(1);
    }

    for (const [slug, data] of Object.entries(CATEGORY_METADATA)) {
        console.log(`Processing: ${data.displayTitle} (${slug})`);

        const doc = {
            _type: 'collection',
            title: data.displayTitle,
            slug: { _type: 'slug', current: slug },
            description: data.metaDescription, // Use meta description as short description initially
            seo: {
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords
            },
            // Auto-populate filter tags to match existing logic
            filterTags: [data.displayTitle, slug]
        };

        try {
            // Use createOrReplace to make it idempotent (run multiple times safely)
            // ID is deterministic based on slug
            const id = `collection-${slug}`;
            await client.createOrReplace({ _id: id, ...doc });
            console.log(`✅ Migrated: ${data.displayTitle}`);
        } catch (err) {
            console.error(`❌ Failed to migrate ${slug}:`, (err as Error).message);
        }
    }

    console.log('\n✨ Migration Complete!');
    console.log('👉 You can now edit these pages in Sanity Studio.');
}

migrate();
