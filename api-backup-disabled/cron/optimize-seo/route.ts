import { NextRequest, NextResponse } from 'next/server';

// Allow longer timeout for AI processing
export const maxDuration = 300;

export async function GET(req: NextRequest) {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { writeClient } = await import('@/sanity/lib/write-client');
        const { generateSEOAttributes } = await import('@/lib/ai/seo-optimizer');

        // Fetch ALL products with their update time
        const products = await writeClient.fetch(`*[_type == "product"]{
            _id, 
            title, 
            description, 
            subtitle,
            tag,
            _updatedAt,
            "currentSeo": seo
        }`);

        console.log(`Starting SEO Cron Job for ${products.length} products...`);
        const results = [];

        for (const product of products) {
            // Check if update is needed
            const lastSeoUpdate = product.currentSeo?.lastAutomatedUpdate
                ? new Date(product.currentSeo.lastAutomatedUpdate)
                : new Date(0); // Epoch if never updated

            const productUpdatedAt = new Date(product._updatedAt);
            const daysSinceSeoUpdate = (new Date().getTime() - lastSeoUpdate.getTime()) / (1000 * 3600 * 24);

            // Update if:
            // 1. No SEO keywords exist
            // 2. SEO is older than 30 days (Periodic Refresh)
            // 3. Product content was updated AFTER the last SEO update (Smart Trigger)
            const needsUpdate =
                !product.currentSeo?.keywords?.length ||
                daysSinceSeoUpdate > 30 ||
                productUpdatedAt > lastSeoUpdate;

            if (!needsUpdate) {
                // console.log(`Skipping ${product.title} (Fresh)`);
                results.push({ id: product._id, status: 'skipped', title: product.title, reason: 'fresh' });
                continue;
            }

            console.log(`⚡️ Optimizing: ${product.title} (Reason: ${productUpdatedAt > lastSeoUpdate ? 'Content Changed' : 'Expired'})`);

            try {
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
                            aiInsights: newSeo.aiInsights,
                            lastAutomatedUpdate: new Date().toISOString()
                        }
                    }).commit();
                    results.push({ id: product._id, status: 'updated', title: product.title });
                    console.log(`✅ Updated SEO for ${product.title}`);
                }
            } catch (err: any) {
                console.error(`Failed ${product.title}:`, err);
                results.push({ id: product._id, status: 'failed', error: err.message });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
