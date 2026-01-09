import { getProducts } from '@/lib/products';
import RSS from 'rss';

export async function GET() {
    const products = await getProducts();
    const siteUrl = 'https://claytile.in';

    // 1. Configure Feed
    const feed = new RSS({
        title: 'UrbanClay Product Catalogue',
        description: 'Premium Terracotta Facade Panels, Wirecut Bricks, and Architectural Clay Products.',
        site_url: siteUrl,
        feed_url: `${siteUrl}/feed.xml`,
        image_url: `${siteUrl}/urbanclay-logo.png`,
        language: 'en-IN',
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}, UrbanClay`,
        custom_namespaces: {
            'g': 'http://base.google.com/ns/1.0'
        },
    });

    // 2. Add Products as Items
    products.forEach((product) => {
        // Main Product
        const categorySlug = product.category?.slug || 'collection';
        const productUrl = `${siteUrl}/products/${categorySlug}/${product.slug}`;

        feed.item({
            title: product.title,
            description: product.description || `Buy ${product.title} from UrbanClay. ${product.subtitle || ''}`,
            url: productUrl,
            guid: product._id, // Unique ID for deduplication
            categories: [product.category?.title || 'Terracotta', ...(product.tag ? [product.tag] : [])],
            date: new Date(), // Using current date as fallback if no updatedAt
            enclosure: product.imageUrl ? {
                url: product.imageUrl,
                type: 'image/jpeg'
            } : undefined,
            custom_elements: [
                { 'g:price': `${product.priceRange?.split('/')[0].replace(/[^\d.]/g, '') || '0'} INR` },
                { 'g:availability': 'in stock' },
                { 'g:condition': 'new' },
                { 'g:brand': 'UrbanClay' },
                { 'g:image_link': product.imageUrl },
            ]
        });

        // Add Variants as separate items ? 
        // Pinterest recommends distinct items for distinct visuals.
        // Let's add variants as separate feed items to maximize Pinterest reach.
        if (product.variants && product.variants.length > 0) {
            product.variants.forEach((variant: any) => {
                if (!variant.imageUrl) return;

                // Unique URL for variant
                const variantUrl = `${productUrl}?variant=${encodeURIComponent(variant.name)}`;
                const variantId = `${product._id}-${variant.name.replace(/\s+/g, '-')}`;

                feed.item({
                    title: `${product.title} - ${variant.name}`,
                    description: `Premium ${variant.name} variant of ${product.title}. ${product.description || ''}`,
                    url: variantUrl,
                    guid: variantId,
                    categories: [product.category?.title || 'Terracotta', 'Architectural Clay'],
                    date: new Date(),
                    enclosure: {
                        url: variant.imageUrl,
                        type: 'image/jpeg'
                    },
                    custom_elements: [
                        { 'g:price': `${product.priceRange?.split('/')[0].replace(/[^\d.]/g, '') || '0'} INR` },
                        { 'g:availability': 'in stock' },
                        { 'g:condition': 'new' },
                        { 'g:brand': 'UrbanClay' },
                        { 'g:image_link': variant.imageUrl },
                        { 'g:item_group_id': product._id } // Groups variants together
                    ]
                });
            });
        }
    });

    // 3. Output XML
    return new Response(feed.xml({ indent: true }), {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
