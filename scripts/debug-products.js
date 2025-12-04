const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const { createClient } = require('next-sanity');

const client = createClient({
    apiVersion: '2024-11-28',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: false,
});

async function debugProducts() {
    // Fetch EVERYTHING for products to see structure
    const query = `*[_type == "product"]`;

    try {
        console.log("Fetching FULL product data from Sanity...");
        const products = await client.fetch(query);
        console.log(JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

debugProducts();
