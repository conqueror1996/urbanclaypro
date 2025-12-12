import { NextRequest, NextResponse } from 'next/server';
import { runSEOAutomation } from '@/lib/automation/seo'; // unused but kept for reference if we switch back
// Actually, let's just remove it to be clean.

// Allow longer timeout for AI processing
export const maxDuration = 300;

export async function GET(req: NextRequest) {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // We need to adapt runSEOAutomation for server-side usage or write specific server logic here.
        // Actually, let's keep the dedicated server logic here which is already robust, 
        // but perhaps update it to ensure it covers all cases.

        // Re-implementing explicitly to be sure it matches our latest standards
        const { writeClient } = await import('@/sanity/lib/write-client');
        const { generateSEOAttributes } = await import('@/lib/ai/seo-optimizer');

        // Fetch ALL products
        const products = await writeClient.fetch(`*[_type == "product"]{
            _id, 
            title, 
            description, 
            subtitle,
            tag,
            "currentSeo": seo
        }`);

        console.log(`Starting SEO Cron Job for ${products.length} products...`);
        const results = [];

        for (const product of products) {
            // Check if update is needed (missing keywords OR older than 7 days)
            const lastUpdate = product.currentSeo?.lastAutomatedUpdate ? new Date(product.currentSeo.lastAutomatedUpdate) : null;
            const daysSinceUpdate = lastUpdate ? (new Date().getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24) : 999;
            const needsUpdate = !product.currentSeo?.keywords?.length || daysSinceUpdate > 7;

            if (!needsUpdate) {
                console.log(`Skipping ${product.title} (Fresh: ${Math.round(daysSinceUpdate)} days)`);
                results.push({ id: product._id, status: 'skipped', title: product.title, reason: 'fresh' });
                continue;
            }

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
