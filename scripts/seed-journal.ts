
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

const journalPosts = [
    {
        title: "Best Terracotta Tiles for Indian Homes 2025: Complete Buying Guide",
        slug: { _type: 'slug', current: 'best-terracotta-tiles-india-2025' },
        excerpt: "Discover the best terracotta tiles for Indian homes in 2025. Compare wirecut, handmade & pressed options. Prices, installation tips & buying guide.",
        publishedAt: new Date().toISOString(),
        author: "UrbanClay Team",
        category: "Product Guide",
        body: [
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Best Terracotta Tiles for Indian Homes in 2025: Complete Buying Guide" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Terracotta tiles have made a stunning comeback in Indian architecture, combining traditional aesthetics with modern sustainability. Whether you're building a new home or renovating, this comprehensive guide will help you choose the perfect terracotta tiles for your space." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Why Terracotta Tiles Are Perfect for Indian Homes" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "1. Natural Cooling Properties" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "India's tropical climate demands materials that can regulate temperature naturally. Terracotta tiles have excellent thermal mass, keeping interiors cool in summer and warm in winter. This can reduce your AC bills by up to 30%." }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "2. Sustainable & Eco-Friendly" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Made from natural clay, terracotta tiles are 100% recyclable and biodegradable. They're the perfect choice for green building projects and LEED certification." }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "3. Timeless Aesthetic" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "From rustic farmhouses to modern minimalist homes, terracotta tiles complement every architectural style popular in India." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Types of Terracotta Tiles: A Quick Comparison" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "Wirecut Bricks" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Best For: Modern facades, contemporary homes" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Characteristics: Sharp edges, uniform size, smooth finish" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Price Range: ₹65-120 per sq ft" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Water Absorption: 10-12%" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "Handmade Bricks" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Best For: Heritage homes, rustic interiors" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Characteristics: Unique variations, organic texture" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Price Range: ₹80-150 per sq ft" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Water Absorption: 12-15%" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "Pressed Bricks" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Best For: High-traffic flooring, paving" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Characteristics: Extremely dense, low absorption" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Price Range: ₹90-180 per sq ft" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Water Absorption: 6-8%" }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "How to Choose the Right Terracotta Tiles" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Selecting the right tile goes beyond just looks. Here is what you need to consider:" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "1. Consider Your Climate" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Hot & Humid (Mumbai, Chennai): Choose low-absorption pressed tiles to prevent algae growth." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Dry & Hot (Rajasthan, Gujarat): Wirecut or handmade work well and provide excellent insulation." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Moderate (Bangalore, Pune): All types are suitable." }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "2. Application Area" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Exterior Walls: Wirecut or pressed (low efflorescence risk)." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Interior Walls: Handmade for character, wirecut for a modern industrial look." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Flooring: Pressed tiles for high durability." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Maintenance Guide" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Daily: Sweep or vacuum to remove grit." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Weekly: Mop with a mild soap solution." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Yearly: Reseal exterior tiles to maintain water resistance." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Conclusion" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Terracotta tiles are an investment in beauty, sustainability, and comfort. With proper selection and installation, they'll enhance your home for decades to come." }]
            }
        ],
        mainImage: "https://placehold.co/800x600/e2725b/ffffff?text=Terracotta+Tiles+Guide"
    },
    {
        title: "Terracotta vs Ceramic Tiles: Which is Better for Indian Homes?",
        slug: { _type: 'slug', current: 'terracotta-vs-ceramic-tiles-india' },
        excerpt: "Complete comparison of terracotta and ceramic tiles. Compare price, durability, maintenance & aesthetics. Make the right choice for your home.",
        publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        author: "UrbanClay Team",
        category: "Product Guide",
        body: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Both materials have their place in Indian homes. Terracotta wins on sustainability, thermal performance, and longevity. Ceramic wins on versatility, maintenance, and initial cost." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Head-to-Head Comparison" }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "1. Material & Manufacturing" }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "Terracotta" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Natural clay, fired at 900-1000°C. Can be handmade or machine-made with a porous structure that breathes." }]
            },
            {
                _type: 'block',
                style: 'h4',
                children: [{ _type: 'span', text: "Ceramic" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Clay mixed with minerals, fired at 1200°C+. Always machine-made with a glazed, sealed surface." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "2. Aesthetics" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Terracotta offers earthy, warm tones with natural variations and rustic charm. Ceramic can mimic any material and comes in endless uniform colors and modern finishes." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "3. Durability" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Terracotta has a lifespan of 50+ years and improves with age (patina). varying resistance to impact. Ceramic lasts 20-30 years, is chip-resistant, but the glaze can wear off over time." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "4. Cost Breakdown (per sq ft)" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Terracotta Material: ₹45-180 | Installation: ₹30-50 | Total (10 yrs): High value due to longevity." }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Ceramic Material: ₹30-150 | Installation: ₹25-40 | Total (10 yrs): Lower initial cost." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Conclusion: What is right for you?" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Use Terracotta if you are building a green, sustainable home, love the traditional aesthetic, or live in a hot climate and need natural cooling. Choose Ceramic for budget-conscious projects, wet areas like bathrooms, or if you need zero maintenance." }]
            }
        ],
        mainImage: "https://placehold.co/800x600/8b4513/ffffff?text=Terracotta+Vs+Ceramic"
    },
    {
        title: "How to Choose Clay Tiles: Complete Guide for Architects & Builders",
        slug: { _type: 'slug', current: 'how-to-choose-clay-tiles' },
        excerpt: "Expert guide on selecting clay tiles for your project. Learn about specifications, quality checks, pricing & installation. For architects & builders.",
        publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        author: "UrbanClay Team",
        category: "Architecture",
        body: [
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Architect's Guide to Clay Tiles" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Choosing the right clay tiles requires balancing aesthetics, performance, and budget. This guide breaks down the technical specifications you need to know." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "1. Water Absorption Rate" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Critical for exterior durability:" }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Class I (<3%): Vitreous, highest durability." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Class II (3-6%): Semi-vitreous, good for most exteriors." }]
            },
            {
                _type: 'block',
                listItem: 'bullet',
                children: [{ _type: 'span', text: "Class III (6-10%): Semi-porous, best for protected areas." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "2. Compressive Strength" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Minimum for load-bearing: 75 kg/cm². Minimum for cladding: 35 kg/cm². Premium tiles: 100+ kg/cm²." }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: "3. Efflorescence Rating" }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: "Always choose tiles with Low Efflorescence rating (<10% surface coverage) for Indian conditions to avoid white salt patches over time." }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Quality Checks Before Buying" }]
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: "Visual Inspection: Check for color consistency and clean edges." }]
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: "Ring Test: Tap the tile; a clear metallic ring indicates good firing." }]
            },
            {
                _type: 'block',
                listItem: 'number',
                children: [{ _type: 'span', text: "Water Drop Test: Drop water on the surface; if sealed, it should bead up." }]
            }
        ],
        mainImage: "https://placehold.co/800x600/a52a2a/ffffff?text=Clay+Tiles+Guide"
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

async function seedJournal() {
    console.log('📰 Seeding Journal posts...');

    try {
        for (const post of journalPosts) {
            console.log(`Processing: ${post.title}`);

            // Upload main image
            if (post.mainImage) {
                const asset = await uploadImage(post.mainImage);
                if (asset) {
                    // @ts-ignore
                    post.mainImage = {
                        _type: 'image',
                        asset: { _type: 'reference', _ref: asset._id }
                    };
                } else {
                    // @ts-ignore
                    delete post.mainImage;
                }
            }

            const doc = {
                _type: 'journal',
                ...post
            };

            const res = await client.createOrReplace({
                _id: `journal-${post.slug.current}`,
                ...doc
            });
            console.log(`✅ Created journal post: ${res.title}`);
        }
        console.log('✨ Journal seeding complete!');
    } catch (error) {
        console.error('❌ Error seeding journal:', error);
    }
}

seedJournal();
