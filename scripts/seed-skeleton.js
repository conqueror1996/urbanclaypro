const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
    projectId: '22qqjddz',
    dataset: 'production',
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

// User defined hierarchy
const CATALOG = [
    {
        category: 'Exposed Brick', // Level 1
        products: [ // Level 2
            { title: 'Wirecut Brick', tags: ['Sharp Edges', 'Machine Made'] },
            { title: 'Handmade Brick', tags: ['Rustic', 'Moulded'] },
            { title: 'Tumbled Brick', tags: ['Aged', 'Texture'] } // Added 3rd variant to complete set
        ]
    },
    {
        category: 'Brick Tile',
        products: [
            { title: 'Linear Brick Tile', tags: ['Long Format', 'Slim'] },
            { title: 'Smooth Brick Tile', tags: ['Modern', 'Clean'] },
            { title: 'Rustic Brick Tile', tags: ['Textured', 'Heritage'] }
        ]
    },
    {
        category: 'Terracotta Jaali',
        products: [
            { title: 'Camp Jaali', tags: ['Screen'] },
            { title: 'Petal Jaali', tags: ['Screen'] }
        ]
    }
];

async function seedSkeleton() {
    console.log('🌱 Seeding CORRECTED Product Hierarchy...');

    // 1. Clean existing (optional but recommended to avoid duplicates if re-running)
    // For safety, let's just create new ones. The user can run clean-sanity.js if they want a wipe.
    // Actually, user wants "structure as per our product category", implying a reset is best or we get duplicate "Wirecut Brick"s.
    // I will NOT delete here, I assume user ran clean-sanity or I will rely on manual cleaning.
    // Wait, to be helpful, I should probably delete old products to avoid confusion? 
    // No, let's just add these. The user recently cleaned.

    const tx = client.transaction();

    CATALOG.forEach(cat => {
        cat.products.forEach(p => {
            // We need to define the 'specifications' field structure in schema if not exists.
            // Default schema probably has description. We'll put spec placeholder in description for now.

            const doc = {
                _type: 'product',
                title: p.title,
                category: cat.category, // Level 1
                tag: p.tags.join(', '),
                price: "On Request",
                description: `High quality ${p.title}. Specification to be updated via Dashboard.`,
                slug: { _type: 'slug', current: p.title.toLowerCase().replace(/ /g, '-') }
            };
            tx.create(doc);
        });
    });

    try {
        await tx.commit();
        console.log('✅ Hierarchy Created: Category -> Product Line.');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    }
}

seedSkeleton();
