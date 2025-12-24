
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN, // Needs write access
    apiVersion: '2024-01-01',
    useCdn: false,
});

const BLOG_POSTS = [
    {
        title: "Terracotta Tiles for Indian Climate: Why They Work Best",
        slug: "terracotta-tiles-indian-climate",
        excerpt: "Discover why traditional terracotta is the ultimate sustainable choice for India's diverse weather conditions, offering natural cooling and timeless durability.",
        category: "Sustainability",
        content: [
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Natural Cooling Properities' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Terracotta has inherent thermal insulation properties that make it ideal for the tropical Indian climate. Unlike concrete which traps heat, baked clay breathes, reducing the internal temperature of buildings naturally.' }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Monsoon Resistance' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'High-quality wirecut terracotta tiles are fired at high temperatures, making them extremely low in porosity. This means they resist water absorption, preventing moss growth and dampness during heavy monsoons in cities like Mumbai and Bangalore.' }]
            }
        ]
    },
    {
        title: "Brick Tiles vs Natural Stone: A Facade Comparison",
        slug: "brick-tiles-vs-natural-stone",
        excerpt: "Compare the pros and cons of exposed brick cladding versus natural stone. Learn about cost, maintenance, and aesthetic versatility for your next project.",
        category: "Product Guide",
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Choosing the right facade material is critical for both aesthetics and structural load. Here is how wirecut brick tiles stack up against natural stone cladding.' }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Weight and Installation' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Brick tiles are significantly lighter than stone slabs. This reduces the dead load on the building structure and makes installation faster and cheaper using standard tile adhesives.' }]
            }
        ]
    },
    {
        title: "Best Wall Cladding for Commercial Facades",
        slug: "best-cladding-commercial-buildings",
        excerpt: "Explore top-rated exterior cladding options for offices and malls. From ventilated terracotta panels to sleek wirecut bricks, find the modern look that lasts.",
        category: "Architecture",
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Commercial facades need to balance brand identity with low maintenance costs. Terracotta facade systems offer a "install and forget" solution that ages gracefully.' }]
            }
        ]
    },
    {
        title: "The Breeze Block Revival: Jaali in Modern Homes",
        slug: "breeze-blocks-modern-homes-jaali",
        excerpt: "The mid-century breeze block is back. meaningful functionality meets decorative art in these terracotta jaali patterns perfect for partitions and balcony screens.",
        category: "Design",
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Campostela or "Jaali" blocks allow air and light to filter through while providing privacy. They are making a massive comeback in modern Indian apartments where ventilation is key but privacy is scarce.' }]
            }
        ]
    },
    {
        title: "Guide to Exposed Brick Masonry",
        slug: "guide-exposed-brick-masonry",
        excerpt: "Everything you need to know about achieving the perfect exposed brick wall. Pointing techniques, sealing, and choosing the right wirecut brick shade.",
        category: "Product Guide",
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'Exposed brick masonry is a timeless aesthetic. Whether using full bricks or cladding tiles, the key lies in the "pointing" - the mortar finish between the bricks.' }]
            }
        ]
    }
];

async function seedContent() {
    console.log('🌱 Seeding SEO Content...');

    for (const post of BLOG_POSTS) {
        try {
            const doc = {
                _type: 'journal',
                title: post.title,
                slug: { current: post.slug },
                excerpt: post.excerpt,
                category: post.category,
                publishedAt: new Date().toISOString(),
                author: "UrbanClay Team",
                body: post.content
            };

            await client.createOrReplace({
                _id: `drafts.${post.slug}`, // Create as draft first so they can be reviewed? Or publish directly? Let's publish.
                ...doc
            });

            // Actually, let's just create them as published documents to be instant
            await client.createOrReplace({
                _id: `article-${post.slug}`,
                ...doc
            });

            console.log(`✅ Created: ${post.title}`);
        } catch (err) {
            console.error(`❌ Failed: ${post.title}`, err);
        }
    }
    console.log('🚀 Content Seed Complete!');
}

seedContent();
