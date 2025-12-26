const { createClient } = require('next-sanity');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '22qqjddz',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

if (!process.env.SANITY_API_TOKEN) {
    console.error('Missing SANITY_API_TOKEN');
    process.exit(1);
}

async function main() {
    // FALLBACK: Using the existing brick guide image since generation service is temporarily down
    const imagePath = path.join(process.cwd(), 'public/images/exposed-brick-guide.png');

    if (!fs.existsSync(imagePath)) {
        console.error('Placeholder image not found');
        return;
    }

    console.log('Uploading image (using fallback brick image)...');
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
        filename: 'brick-vs-stone-placeholder.png'
    });
    console.log('Image uploaded:', imageAsset._id);

    const doc = {
        _type: 'journal',
        title: 'Brick Tiles vs Natural Stone: A Facade Comparison',
        slug: { _type: 'slug', current: 'brick-tiles-vs-natural-stone-comparison' },
        publishedAt: new Date().toISOString(),
        excerpt: 'Deciding between natural stone and brick cladding? We break down the cost, weight, installation ease, and aesthetic impact of these two timeless materials.',
        mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: imageAsset._id }
        },
        body: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'When choosing a facade material for a premium project, architects often narrow it down to two heavyweights: Natural Stone and Terracotta Brick Tiles. Both offer timeless appeal, but they perform very differently in terms of structural load and budget.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '1. Weight & Structural Load' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'This is the biggest differentiator. Natural stone cladding (granite, sandstone) typically requires heavy mechanical fixing (clamps) and imposes a massive dead load on the building frame. Brick Tiles, however, are a "skin"—often just 15-20mm thick. They can be installed with high-strength adhesive, reducing the structural load by up to '
                    },
                    { _type: 'span', marks: ['strong'], text: '70%' },
                    { _type: 'span', text: '.' }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '2. Cost Implications' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'Natural stone is resource-intensive to mine, transport, and install. The labor cost for stone clamping is significant. Brick tiles offer a premium look at a fraction of the total installed cost, primarily due to the speed and ease of adhesive application.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '3. Aesthetic Warmth' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'Stone projects a sense of cold, monumental permanence. Terracotta brick, by contrast, brings warmth and human scale. The intricate variation in fired red clay creates a connection to the earth that feels welcoming rather than imposing, making it ideal for residential and hospitality projects.'
                    }
                ]
            }
        ]
    };

    console.log('Creating entry...');
    const res = await client.create(doc);
    console.log('Created journal:', res._id);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
