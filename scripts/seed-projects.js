const { createClient } = require('@sanity/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false, // We need fresh data for writes
});

const demoProjects = [
    {
        _id: 'project-bhairavi-residence',
        _type: 'project',
        title: 'Bhairavi Residence',
        slug: { _type: 'slug', current: 'bhairavi-residence' },
        location: 'Mumbai, Maharashtra',
        type: 'Residential',
        description: 'A contemporary home featuring extensive use of our Wirecut Bricks to create a warm, earthy facade that stands out in the urban jungle.',
        productsUsed: [
            { _type: 'reference', _ref: 'product-terracotta-floor-paver' } // Linking to one of our new products
        ]
        // Image will be missing, need to upload manually
    },
    {
        _id: 'project-diplomat-enclave',
        _type: 'project',
        title: 'Diplomat Enclave',
        slug: { _type: 'slug', current: 'diplomat-enclave' },
        location: 'New Delhi',
        type: 'Commercial',
        description: 'A high-end commercial complex utilizing our Cladding Tiles for a sophisticated, maintenance-free exterior.',
        productsUsed: [
            { _type: 'reference', _ref: 'product-exposed-ceiling-tile' }
        ]
    },
    {
        _id: 'project-tech-park-lobby',
        _type: 'project',
        title: 'Tech Park Lobby',
        slug: { _type: 'slug', current: 'tech-park-lobby' },
        location: 'Bangalore, Karnataka',
        type: 'Commercial',
        description: 'The main lobby of this tech park uses our Acoustic Clay Baffles to manage sound while providing a stunning visual ceiling.',
        productsUsed: [
            { _type: 'reference', _ref: 'product-acoustic-clay-baffle' }
        ]
    },
    {
        _id: 'project-courtyard-house',
        _type: 'project',
        title: 'Courtyard House',
        slug: { _type: 'slug', current: 'courtyard-house' },
        location: 'Pune, Maharashtra',
        type: 'Residential',
        description: 'A traditional courtyard home reimagined with modern Terracotta Jaali screens for ventilation and privacy.',
        productsUsed: [
            { _type: 'reference', _ref: 'product-decorative-ceiling-panel' }
        ]
    }
];

async function importProjects() {
    console.log('🚀 Starting import of demo projects...');

    try {
        const transaction = client.transaction();

        demoProjects.forEach(project => {
            transaction.createOrReplace(project);
            console.log(`📦 Prepared: ${project.title}`);
        });

        const result = await transaction.commit();
        console.log('✅ Import successful!', result);
        console.log('🎉 Added 4 new projects to Sanity.');
    } catch (err) {
        console.error('❌ Import failed:', err.message);
    }
}

importProjects();
