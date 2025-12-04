const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { createClient } = require('next-sanity');

const client = createClient({
    apiVersion: '2024-11-28',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function cleanup() {
    console.log('🧹 Cleaning up duplicate and old products...');

    try {
        // Fetch all products
        const query = `*[_type == "product"] { _id, title, slug }`;
        const products = await client.fetch(query);

        console.log(`Found ${products.length} products total`);

        // Keep only the products with proper IDs (from seed script)
        const keepIds = [
            'product-brick-wall-tiles',
            'product-exposed-bricks',
            'product-terracotta-jaali',
            'product-roof-tiles'
        ];

        // Delete products that are NOT in the keep list
        for (const product of products) {
            if (!keepIds.includes(product._id)) {
                console.log(`🗑️  Deleting: ${product.title} (${product._id})`);
                await client.delete(product._id);
            } else {
                console.log(`✅ Keeping: ${product.title} (${product._id})`);
            }
        }

        console.log('✨ Cleanup complete!');
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    }
}

cleanup();
