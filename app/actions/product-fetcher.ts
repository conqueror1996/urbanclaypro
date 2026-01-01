'use server'

import { createClient, groq } from 'next-sanity'

// Re-create simple client for server action (to avoid circular deps or config issues)
const client = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: '22qqjddz',
    useCdn: true,
});

export async function getProductDropdownData() {
    try {
        const products = await client.fetch(groq`*[_type == "product"] {
            _id,
            title,
            "category": category->title,
            priceRange
        }`);
        return products;
    } catch (error) {
        console.error("Error fetching products for dropdown:", error);
        return [];
    }
}
