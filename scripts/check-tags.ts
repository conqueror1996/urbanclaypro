
import { createClient } from 'next-sanity';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: '2024-11-28',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

async function checkTags() {
    try {
        const products = await client.fetch(`*[_type == "product"]{title, tag, "categorySlug": category->slug.current}`);
        console.log('--- PRODUCTS & TAGS ---');
        products.forEach((p: any) => {
            console.log(`Product: "${p.title}" | Tag: "${p.tag}" | CatSlug: "${p.categorySlug}"`);
        });

        const categories = await client.fetch(`*[_type == "category"]{title, "slug": slug.current}`);
        console.log('\n--- CATEGORIES ---');
        categories.forEach((c: any) => {
            console.log(`Category: "${c.title}" | Slug: "${c.slug}"`);
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

checkTags();
