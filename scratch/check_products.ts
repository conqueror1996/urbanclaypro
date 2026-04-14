
import { createClient } from 'next-sanity';

const client = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: '22qqjddz',
    useCdn: false,
});

async function checkProducts() {
    const products = await client.fetch(`*[_type == "product"] { title, "category": category->title, "slug": slug.current, "catSlug": category->slug.current }`);
    console.log(JSON.stringify(products, null, 2));
}

checkProducts();
