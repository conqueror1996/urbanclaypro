const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: '22qqjddz',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

async function cleanSanity() {
    console.log('🧹 Starting Aggressive Sanity Cleanup...');

    try {
        // 1. Delete ALL Projects FIRST (to remove references)
        console.log('Finding ALL projects...');
        const projects = await client.fetch('*[_type == "project"]{_id}');
        if (projects.length > 0) {
            console.log(`Deleting ${projects.length} projects...`);
            const tx = client.transaction();
            projects.forEach(p => tx.delete(p._id));
            await tx.commit();
            console.log('✅ All projects deleted.');
        }

        // 2. Delete ALL Products SECOND
        console.log('Finding ALL products...');
        const products = await client.fetch('*[_type == "product"]{_id}');
        if (products.length > 0) {
            console.log(`Deleting ${products.length} products...`);
            const tx = client.transaction();
            products.forEach(p => tx.delete(p._id));
            await tx.commit();
            console.log('✅ All products deleted.');
        }

        // 3. Delete ANY remaining references just in case (e.g. sampleBox if any)
        // Optional

        console.log('✨ Cleanup Complete. Dataset is empty.');

    } catch (err) {
        console.error('❌ Error cleaning Sanity:', err.message);
    }
}

cleanSanity();
