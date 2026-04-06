
import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { enhanceProduct } from '@/lib/seo-content';

export async function GET() {
    const products = await client.fetch(`
        *[_type == "product"]{
            "slug": slug.current,
            title,
            description,
            "imageUrl": image.asset->url,
            "category": category->{
                title,
                "slug": slug.current
            },
            priceRange,
            sku
        }
    `);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>UrbanClay | Premium Terracotta Manufacturer</title>
        <link>https://claytile.in</link>
        <description>India's leading manufacturer of high-precision clay facades and architectural bricks.</description>
        ${products.map((p: any) => {
            const enhanced = enhanceProduct(p);
            const price = p.priceRange ? p.priceRange.replace(/[^0-9]/g, '') : '100'; // Fallback
            return `
        <item>
            <g:id>${p.slug}</g:id>
            <g:title>${p.title}</g:title>
            <g:description>${enhanced.description?.slice(0, 5000) || p.title}</g:description>
            <g:link>https://claytile.in/products/${p.category?.slug || 'collection'}/${p.slug}</g:link>
            <g:image_link>${p.imageUrl}</g:image_link>
            <g:condition>new</g:condition>
            <g:availability>in_stock</g:availability>
            <g:price>${price} INR</g:price>
            <g:brand>UrbanClay</g:brand>
            <g:google_product_category>Building Materials &gt; Wall Cladding &gt; Brick &amp; Stone</g:google_product_category>
        </item>`;
        }).join('')}
    </channel>
</rss>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate'
        }
    });
}
