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
    // 2. Add Products as Items
    products.forEach((product) => {
        // Helper to parse price
        const parsePrice = (range: string | undefined) => {
            if (!range) return '0';
            // Extract first number found
            const match = range.match(/(\d+)/);
            return match ? match[0] : '0';
        };

        const priceStr = parsePrice(product.priceRange);
        const priceVal = parseInt(priceStr, 10);

        // Skip if price is invalid or 0 (Google rejects these)
        if (priceVal <= 0) return;

        // Skip if no main image
        if (!product.imageUrl) return;

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
            enclosure: {
                url: product.imageUrl,
                type: 'image/jpeg'
            },
            custom_elements: [
                { 'g:price': `${priceStr} INR` },
                { 'g:availability': 'in stock' },
                { 'g:condition': 'new' },
                { 'g:brand': 'UrbanClay' },
                { 'g:image_link': product.imageUrl },
                { 'g:shipping_weight': '1500 g' }, // Default weight for validation
                { 'g:identifier_exists': 'no' }, // Since we don't have GTIN/MPN
            ]
        });

        // Add Variants
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
                        { 'g:price': `${priceStr} INR` },
                        { 'g:availability': 'in stock' },
                        { 'g:condition': 'new' },
                        { 'g:brand': 'UrbanClay' },
                        { 'g:image_link': variant.imageUrl },
                        { 'g:item_group_id': product._id }, // Groups variants together
                        { 'g:shipping_weight': '1500 g' },
                        { 'g:identifier_exists': 'no' }, // Since we don't have GTIN/MPN
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
