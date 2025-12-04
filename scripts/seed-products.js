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

const demoProducts = [
    // CLAY FLOOR TILES
    {
        _id: 'product-terracotta-floor-paver',
        _type: 'product',
        title: 'Terracotta Floor Paver',
        slug: { _type: 'slug', current: 'terracotta-floor-paver' },
        subtitle: 'Classic square pavers for patios and walkways.',
        tag: 'Floor Tiles', // Must match the value in schema
        priceRange: '₹95 - ₹110 / sq.ft',
        description: 'High-density terracotta pavers designed for heavy foot traffic. Perfect for garden pathways, patios, and rustic interiors. Naturally slip-resistant and cool underfoot.',
        specs: {
            size: '12" x 12"',
            thickness: '20mm',
            coverage: '1 sq.ft / tile',
            weight: '2.5 kg',
            waterAbsorption: '< 8%',
            compressiveStrength: '> 25 N/mm²',
            firingTemperature: '1050°C',
            efflorescence: 'Low'
        },
        // We will skip image upload in this script for simplicity, 
        // but in a real scenario we would upload assets first.
        // These will appear without images, which is fine for data testing.
        collections: [
            {
                _type: 'object',
                name: 'Clay Floor Tile Series',
                variants: [
                    { _type: 'object', name: 'Natural Red' },
                    { _type: 'object', name: 'Chocolate' }
                ]
            }
        ]
    },
    {
        _id: 'product-hexagon-clay-floor-tile',
        _type: 'product',
        title: 'Hexagon Clay Floor Tile',
        slug: { _type: 'slug', current: 'hexagon-clay-floor-tile' },
        subtitle: 'Geometric elegance in natural clay.',
        tag: 'Floor Tiles',
        priceRange: '₹120 - ₹140 / sq.ft',
        description: 'Add a touch of geometric sophistication with our Hexagon series. Ideal for kitchen floors, bathrooms, and feature areas.',
        specs: {
            size: '8" Side',
            thickness: '18mm',
            coverage: '0.8 sq.ft / tile',
            weight: '1.8 kg',
            waterAbsorption: '< 7%',
            compressiveStrength: '> 30 N/mm²',
            firingTemperature: '1100°C',
            efflorescence: 'None'
        },
        collections: [
            {
                _type: 'object',
                name: 'Clay Floor Tile Series',
                variants: [
                    { _type: 'object', name: 'Antique Red' },
                    { _type: 'object', name: 'Beige' }
                ]
            }
        ]
    },
    {
        _id: 'product-rustic-brick-floor',
        _type: 'product',
        title: 'Rustic Brick Floor',
        slug: { _type: 'slug', current: 'rustic-brick-floor' },
        subtitle: 'The timeless appeal of aged brick flooring.',
        tag: 'Floor Tiles',
        priceRange: '₹85 - ₹100 / sq.ft',
        description: 'Recreate the charm of old-world farmhouses with our Rustic Brick flooring. Each piece carries unique textures and color variations.',
        specs: {
            size: '9" x 4.5"',
            thickness: '25mm',
            coverage: '0.28 sq.ft / tile',
            weight: '1.2 kg',
            waterAbsorption: '< 10%',
            compressiveStrength: '> 20 N/mm²',
            firingTemperature: '1000°C',
            efflorescence: 'Low'
        },
        collections: [
            {
                _type: 'object',
                name: 'Clay Floor Tile Series',
                variants: [
                    { _type: 'object', name: 'Rustic Buff' },
                    { _type: 'object', name: 'Fired Umber' }
                ]
            }
        ]
    },

    // CLAY CEILING TILES
    {
        _id: 'product-exposed-ceiling-tile',
        _type: 'product',
        title: 'Exposed Ceiling Tile',
        slug: { _type: 'slug', current: 'exposed-ceiling-tile' },
        subtitle: 'Lightweight clay tiles for vaulted ceilings.',
        tag: 'Clay Ceiling Tile',
        priceRange: '₹60 - ₹75 / sq.ft',
        description: 'Designed for exposed ceiling systems (Jack Arch). Provides excellent thermal insulation and a stunning aesthetic from below.',
        specs: {
            size: '12" x 6"',
            thickness: '15mm',
            coverage: '0.5 sq.ft / tile',
            weight: '0.9 kg',
            waterAbsorption: '< 12%',
            compressiveStrength: '> 15 N/mm²',
            firingTemperature: '950°C',
            efflorescence: 'Low'
        },
        collections: [
            {
                _type: 'object',
                name: 'Clay Ceiling Tile Series',
                variants: [
                    { _type: 'object', name: 'Natural Terracotta' }
                ]
            }
        ]
    },
    {
        _id: 'product-decorative-ceiling-panel',
        _type: 'product',
        title: 'Decorative Ceiling Panel',
        slug: { _type: 'slug', current: 'decorative-ceiling-panel' },
        subtitle: 'Intricate patterns for ceiling accents.',
        tag: 'Clay Ceiling Tile',
        priceRange: '₹150 - ₹200 / sq.ft',
        description: 'Hand-pressed clay panels with decorative motifs. Use them as centerpieces or borders in your ceiling design.',
        specs: {
            size: '12" x 12"',
            thickness: '12mm',
            coverage: '1 sq.ft / tile',
            weight: '1.5 kg',
            waterAbsorption: '< 10%',
            compressiveStrength: 'N/A (Decorative)',
            firingTemperature: '1000°C',
            efflorescence: 'None'
        },
        collections: [
            {
                _type: 'object',
                name: 'Clay Ceiling Tile Series',
                variants: [
                    { _type: 'object', name: 'Floral Pattern' },
                    { _type: 'object', name: 'Geometric Pattern' }
                ]
            }
        ]
    },
    {
        _id: 'product-acoustic-clay-baffle',
        _type: 'product',
        title: 'Acoustic Clay Baffle',
        slug: { _type: 'slug', current: 'acoustic-clay-baffle' },
        subtitle: 'Sound-absorbing clay elements for modern spaces.',
        tag: 'Clay Ceiling Tile',
        priceRange: '₹200 - ₹250 / rft',
        description: 'Linear clay baffles that help reduce noise reverberation while adding warmth to corporate or commercial ceilings.',
        specs: {
            size: '4" x 2" x 24"',
            thickness: '10mm walls',
            coverage: 'Linear',
            weight: '2 kg / rft',
            waterAbsorption: '< 6%',
            compressiveStrength: '> 30 N/mm²',
            firingTemperature: '1150°C',
            efflorescence: 'None'
        },
        collections: [
            {
                _type: 'object',
                name: 'Clay Ceiling Tile Series',
                variants: [
                    { _type: 'object', name: 'Hollow Core' }
                ]
            }
        ]
    }
];

async function importData() {
    console.log('🚀 Starting import of demo products...');

    try {
        const transaction = client.transaction();

        demoProducts.forEach(product => {
            transaction.createOrReplace(product);
            console.log(`📦 Prepared: ${product.title}`);
        });

        const result = await transaction.commit();
        console.log('✅ Import successful!', result);
        console.log('🎉 Added 6 new products to Sanity.');
    } catch (err) {
        console.error('❌ Import failed:', err.message);
    }
}

importData();
