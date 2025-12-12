import { authenticatedFetch } from '@/lib/auth-utils';
import { getProducts } from '@/lib/products';

interface SEOUpdateResult {
    slug: string;
    success: boolean;
    error?: string;
    keywordsGenerated?: string[];
}

/**
 * Automates the SEO update process for all products.
 * 1. Fetches all products
 * 2. identifying those with missing or outdated SEO data
 * 3. Calls the AI generation endpoint
 * 4. Saves the updated metadata back to the CMS
 */
export async function runSEOAutomation(): Promise<SEOUpdateResult[]> {
    console.log("🚀 Starting SEO Automation...");
    const results: SEOUpdateResult[] = [];

    try {
        const products = await getProducts();

        // Filter products that need updates (e.g., missing keywords or description)
        // For now, we'll process a batch of 5 to avoid timeouts/rate limits
        const productsToUpdate = products.filter(p =>
            !p.seo?.keywords || p.seo.keywords.length < 5
        ).slice(0, 5);

        console.log(`📋 Found ${productsToUpdate.length} products requiring SEO updates.`);

        for (const product of productsToUpdate) {
            try {
                console.log(`🤖 Generating SEO for: ${product.title}`);

                // 1. Generate SEO Data
                const genRes = await authenticatedFetch('/api/ai/generate-seo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: product.title,
                        description: product.description || product.subtitle,
                        currentTags: product.tag ? [product.tag] : []
                    })
                });

                const genJson = await genRes.json();

                if (!genJson.success) {
                    throw new Error(genJson.error || "Generation failed");
                }

                const seoData = genJson.data;

                // 2. Save to CMS
                const saveRes = await authenticatedFetch('/api/products/manage', {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'update_product',
                        data: {
                            _id: product._id,
                            seo: {
                                metaTitle: seoData.metaTitle,
                                metaDescription: seoData.metaDescription,
                                keywords: seoData.keywords
                            }
                        }
                    })
                });

                if (!saveRes.ok) throw new Error("Failed to save to CMS");

                results.push({
                    slug: product.slug,
                    success: true,
                    keywordsGenerated: seoData.keywords
                });

                console.log(`✅ Updated SEO for ${product.title}`);

            } catch (err: any) {
                console.error(`❌ Failed to update ${product.title}:`, err.message);
                results.push({
                    slug: product.slug,
                    success: false,
                    error: err.message
                });
            }
        }

    } catch (e: any) {
        console.error("🔥 Critical SEO Automation Error:", e);
    }

    return results;
}
