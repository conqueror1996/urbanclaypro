import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';
import { generateSEOAttributes } from '@/lib/ai/seo-optimizer';

export const maxDuration = 60; // Allow 60 seconds for processing

export async function GET(req: NextRequest) {
    // 1. Verify Authentication
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // 2. Fetch Products
        const products = await writeClient.fetch(`
      *[_type == "product"] {
        _id,
        title,
        description,
        "currentSeo": seo
      }
    `);

        console.log(`Analyzing ${products.length} products for SEO optimization...`);

        const results = [];

        // 3. Iterate and Optimize
        for (const product of products) {
            // Skip if description is missing
            if (!product.description) continue;

            console.log(`Optimizing: ${product.title}`);

            const newSeo = await generateSEOAttributes({
                title: product.title,
                description: product.description,
                currentTags: product.currentSeo?.keywords
            });

            if (newSeo) {
                // 4. Update Sanity
                await writeClient
                    .patch(product._id)
                    .set({
                        seo: {
                            metaTitle: newSeo.metaTitle,
                            metaDescription: newSeo.metaDescription,
                            keywords: newSeo.keywords,
                            aiInsights: newSeo.aiInsights,
                            lastAutomatedUpdate: new Date().toISOString()
                        }
                    })
                    .commit();

                results.push({ id: product._id, title: product.title, status: 'updated' });
            } else {
                results.push({ id: product._id, title: product.title, status: 'failed_generation' });
            }
        }

        return NextResponse.json({
            success: true,
            message: "SEO Optimization Complete",
            processed: results.length,
            details: results
        });

    } catch (error) {
        console.error('Cron Job Failed:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
