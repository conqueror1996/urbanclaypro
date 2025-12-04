// @ts-nocheck
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-28';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('❌ Missing required environment variables.');
    console.error('Please ensure .env.local contains:');
    console.error('- NEXT_PUBLIC_SANITY_PROJECT_ID');
    console.error('- NEXT_PUBLIC_SANITY_DATASET');
    console.error('- SANITY_API_TOKEN (Write token)');
    process.exit(1);
}

// Initialize client with token for write access
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
});

const demoProducts = [
    {
        _type: 'product',
        title: 'Brick Wall Tiles Series',
        slug: { _type: 'slug', current: 'brick-wall-tiles' },
        tag: 'Brick Wall Tiles',
        subtitle: 'Cladding • Facades • Interiors',
        priceRange: '₹85 - ₹130 / sq.ft',
        description: 'Versatile brick tiles for cladding and interiors, available in various textures from rustic to sleek linear profiles.',
        specs: {
            size: '9″ × 3″ × 18mm',
            waterAbsorption: '12–14%',
            compressiveStrength: '≥ 40 kg/cm²',
            firingTemperature: '≈ 1200°C'
        },
        collections: [
            {
                name: 'Linear Series',
                variants: [
                    { name: 'Red Linear', imageUrl: 'https://placehold.co/100x100/8B3A3A/ffffff?text=Red' },
                    { name: 'Black Linear', imageUrl: 'https://placehold.co/100x100/2A1E16/ffffff?text=Black' },
                    { name: 'Grey Linear', imageUrl: 'https://placehold.co/100x100/808080/ffffff?text=Grey' },
                    { name: 'White Linear', imageUrl: 'https://placehold.co/100x100/f0f0f0/333333?text=White' },
                    { name: 'Beige Linear', imageUrl: 'https://placehold.co/100x100/F5F5DC/333333?text=Beige' }
                ]
            },
            {
                name: 'Rustic Series',
                variants: [
                    { name: 'Antique Red', imageUrl: 'https://placehold.co/100x100/8B4513/ffffff?text=Antique' },
                    { name: 'Weathered Brown', imageUrl: 'https://placehold.co/100x100/5D4037/ffffff?text=Brown' },
                    { name: 'Vintage Buff', imageUrl: 'https://placehold.co/100x100/D2B48C/ffffff?text=Buff' },
                    { name: 'Charcoal Rustic', imageUrl: 'https://placehold.co/100x100/36454F/ffffff?text=Charcoal' },
                    { name: 'Mossy Red', imageUrl: 'https://placehold.co/100x100/800000/ffffff?text=Mossy' }
                ]
            },
            {
                name: 'Smooth Series',
                variants: [
                    { name: 'Natural Red', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Red' },
                    { name: 'Chocolate', imageUrl: 'https://placehold.co/100x100/3E2723/ffffff?text=Choco' },
                    { name: 'Beige', imageUrl: 'https://placehold.co/100x100/F5F5DC/000000?text=Beige' },
                    { name: 'Terracotta', imageUrl: 'https://placehold.co/100x100/E2725B/ffffff?text=Terra' }
                ]
            }
        ]
    },
    {
        _type: 'product',
        title: 'Exposed Bricks Collection',
        slug: { _type: 'slug', current: 'exposed-bricks' },
        tag: 'Exposed Bricks',
        subtitle: 'Wirecut • Pressed • Handmade',
        priceRange: '₹18 - ₹45 / piece',
        description: 'Comprehensive collection of exposed clay bricks ranging from precise wirecut textures to rustic handmade finishes.',
        specs: {
            size: '230 × 75 × 115mm',
            waterAbsorption: '10–12%',
            compressiveStrength: '≥ 35 kg/cm²',
            firingTemperature: '≈ 1100°C'
        },
        collections: [
            {
                name: 'Wirecut Series',
                variants: [
                    { name: 'Wirecut Red', imageUrl: 'https://placehold.co/100x100/8B3A3A/ffffff?text=Wirecut' },
                    { name: 'Wirecut Brown', imageUrl: 'https://placehold.co/100x100/5D4037/ffffff?text=Brown' },
                    { name: 'Wirecut Black', imageUrl: 'https://placehold.co/100x100/000000/ffffff?text=Black' },
                    { name: 'Wirecut Grey', imageUrl: 'https://placehold.co/100x100/808080/ffffff?text=Grey' }
                ]
            },
            {
                name: 'Handmade Series',
                variants: [
                    { name: 'Handmade Antique', imageUrl: 'https://placehold.co/100x100/8B4513/ffffff?text=Antique' },
                    { name: 'Handmade Buff', imageUrl: 'https://placehold.co/100x100/D2B48C/ffffff?text=Buff' },
                    { name: 'Handmade Red', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Red' }
                ]
            }
        ]
    },
    {
        _type: 'product',
        title: 'Terracotta Jaali Collection',
        slug: { _type: 'slug', current: 'terracotta-jaali' },
        tag: 'Jaali',
        subtitle: 'Ventilation • Light • Decorative',
        priceRange: '₹150 - ₹250 / piece',
        description: 'Decorative jaali panels for natural ventilation and light filtration. Available in a wide range of geometric and organic patterns.',
        specs: {
            size: '200mm × 200mm × 60mm',
            waterAbsorption: '8–10%',
            compressiveStrength: '≥ 50 kg/cm²',
            firingTemperature: '≈ 1250°C'
        },
        collections: [
            {
                name: 'Geometric Patterns',
                variants: [
                    { name: 'Square Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Square' },
                    { name: 'Cross Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Cross' },
                    { name: 'Diamond Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Diamond' },
                    { name: 'Triangle Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Triangle' }
                ]
            },
            {
                name: 'Organic Patterns',
                variants: [
                    { name: 'Petal Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Petal' },
                    { name: 'Leaf Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Leaf' },
                    { name: 'Wave Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Wave' },
                    { name: 'Floral Jaali', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Floral' }
                ]
            }
        ]
    },
    {
        _type: 'product',
        title: 'Roof Tiles — Premium Clay',
        slug: { _type: 'slug', current: 'roof-tiles' },
        tag: 'Roof Tile',
        subtitle: 'Weather Proof • Thermal Insulation',
        priceRange: '₹45 - ₹85 / piece',
        description: 'High-performance clay roof tiles offering superior weather protection and thermal insulation.',
        specs: {
            size: 'Standard Roofing Profiles',
            waterAbsorption: '5–7%',
            compressiveStrength: '≥ 60 kg/cm²',
            firingTemperature: '≈ 1300°C'
        },
        collections: [
            {
                name: 'Standard Profiles',
                variants: [
                    { name: 'Mangalore Tile', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Mangalore' },
                    { name: 'Euro Tile', imageUrl: 'https://placehold.co/100x100/A52A2A/ffffff?text=Euro' },
                    { name: 'Flat Tile', imageUrl: 'https://placehold.co/100x100/333333/ffffff?text=Flat' }
                ]
            },
            {
                name: 'Premium Glazed',
                variants: [
                    { name: 'Blue Glaze', imageUrl: 'https://placehold.co/100x100/0000FF/ffffff?text=Blue' },
                    { name: 'Green Glaze', imageUrl: 'https://placehold.co/100x100/008000/ffffff?text=Green' },
                    { name: 'Black Glaze', imageUrl: 'https://placehold.co/100x100/000000/ffffff?text=Black' }
                ]
            }
        ]
    }
];

const demoProjects = [
    {
        _type: 'project',
        title: 'The Terracotta House',
        slug: { _type: 'slug', current: 'the-terracotta-house' },
        location: 'Bangalore, India',
        type: 'Residential',
        description: 'A sustainable residence that uses exposed wirecut bricks to create a breathable, eco-friendly envelope.',
    },
    {
        _type: 'project',
        title: 'Urban Cafe',
        slug: { _type: 'slug', current: 'urban-cafe' },
        location: 'Mumbai, India',
        type: 'Commercial',
        description: 'A trendy cafe interior featuring our handmade brick slips for a rustic, industrial look.',
    }
];

async function uploadImage(url: string) {
    try {
        console.log(`   Downloading image: ${url}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        console.log(`   Uploading asset to Sanity...`);
        const asset = await client.assets.upload('image', buffer, {
            filename: url.split('/').pop() || 'image.jpg'
        });
        console.log(`   ✅ Uploaded asset: ${asset._id}`);
        return asset;
    } catch (error) {
        console.error(`   ❌ Failed to upload image from ${url}:`, error);
        return null;
    }
}

async function seed() {
    console.log('🌱 Seeding demo data...');

    try {
        // Create Products
        for (const product of demoProducts) {
            // Process collections images
            if (product.collections) {
                for (const collection of product.collections) {
                    if (collection.variants) {
                        for (const variant of collection.variants) {
                            if (variant.imageUrl) {
                                const asset = await uploadImage(variant.imageUrl);
                                if (asset) {
                                    // @ts-ignore
                                    variant.image = {
                                        _type: 'image',
                                        asset: { _type: 'reference', _ref: asset._id }
                                    };
                                    // Remove raw URL string as we now have the asset
                                    // @ts-ignore
                                    delete variant.imageUrl;
                                }
                            }
                        }
                    }
                }
            }

            // Process direct variants images
            if (product.variants) {
                for (const variant of product.variants) {
                    if (variant.imageUrl) {
                        const asset = await uploadImage(variant.imageUrl);
                        if (asset) {
                            // @ts-ignore
                            variant.image = {
                                _type: 'image',
                                asset: { _type: 'reference', _ref: asset._id }
                            };
                            // @ts-ignore
                            delete variant.imageUrl;
                        }
                    }
                }
            }

            // Set top-level image from first available variant/collection image
            // @ts-ignore
            if (!product.images || product.images.length === 0) {
                let firstImage = null;

                // Try to find in collections
                if (product.collections && product.collections.length > 0) {
                    for (const col of product.collections) {
                        if (col.variants && col.variants.length > 0 && col.variants[0].image) {
                            firstImage = col.variants[0].image;
                            break;
                        }
                    }
                }

                // Try to find in direct variants if not found yet
                if (!firstImage && product.variants && product.variants.length > 0 && product.variants[0].image) {
                    firstImage = product.variants[0].image;
                }

                if (firstImage) {
                    // @ts-ignore
                    product.images = [firstImage];
                }
            }

            const res = await client.createOrReplace({
                _id: `product-${product.slug.current}`,
                ...product
            });
            console.log(`✅ Created product: ${res.title}`);
        }

        // Create Projects
        for (const project of demoProjects) {
            const res = await client.createOrReplace({
                _id: `project-${project.slug.current}`,
                ...project
            });
            console.log(`✅ Created project: ${res.title}`);
        }

        console.log('✨ Seeding complete! Check your Sanity Studio.');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
    }
}

seed();
