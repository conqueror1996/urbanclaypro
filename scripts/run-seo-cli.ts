
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Use relative imports because typical tsx alias resolution can be flaky without extra config
// Assuming this script is in /scripts/
import { writeClient } from '../sanity/lib/write-client';
import { generateSEOAttributes } from '../lib/ai/seo-optimizer';

async function runSEO() {
    console.log('🚀 Starting Manual SEO Optimization...');

    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Missing GEMINI_API_KEY in .env.local'); // Fixed: Changed CRON_SECRET to GEMINI_API_KEY as that's what matters for the logic
        process.exit(1);
    }

    try {
        // Fetch ALL products
        const products = await writeClient.fetch(`*[_type == "product"]{
            _id, 
            title, 
            description, 
            subtitle,
            tag,
            "currentSeo": seo
        }`);

        console.log(`Found ${products.length} products.`);

        for (const product of products) {
            // Check if update is needed (missing keywords OR older than 7 days)
            const lastUpdate = product.currentSeo?.lastAutomatedUpdate ? new Date(product.currentSeo.lastAutomatedUpdate) : null;
            const daysSinceUpdate = lastUpdate ? (new Date().getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24) : 999;
            const needsUpdate = !product.currentSeo?.keywords?.length || daysSinceUpdate > 7;

            // OVERRIDE: For manual run, maybe we want to force force update?
            // Let's stick to the logic but log "Force update" if user passed argument, otherwise standard check.
            const force = process.argv.includes('--force');

            if (!needsUpdate && !force) {
                console.log(`⚪️ Skipping "${product.title}" (Fresh: ${Math.round(daysSinceUpdate)} days)`);
                continue;
            }

            console.log(`✨ Optimizing "${product.title}"...`);

            const newSeo = await generateSEOAttributes({
                title: product.title,
                description: product.description || product.subtitle || '',
                currentTags: product.tag ? [product.tag] : []
            });

            if (newSeo) {
                await writeClient.patch(product._id).set({
                    seo: {
                        metaTitle: newSeo.metaTitle,
                        metaDescription: newSeo.metaDescription,
                        keywords: newSeo.keywords,
                        lastAutomatedUpdate: new Date().toISOString()
                    }
                }).commit();
                console.log(`   ✅ Updated!`);
            } else {
                console.log(`   ⚠️ Failed to generate SEO data.`);
            }

            // Artificial delay to respect rate limits if any
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('🎉 SEO Optimization Complete!');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

runSEO();
