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
    const imagePath = path.join(process.cwd(), 'public/images/breeze-block-interior.png');
    if (!fs.existsSync(imagePath)) {
        console.error('Image not found');
        return;
    }

    console.log('Uploading image...');
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
        filename: 'breeze-block-interior.png'
    });
    console.log('Image uploaded:', imageAsset._id);

    const doc = {
        _type: 'journal',
        title: 'The Breeze Block Revival: Jaali in Modern Homes',
        slug: { _type: 'slug', current: 'breeze-block-revival-modern-homes' },
        publishedAt: new Date().toISOString(),
        excerpt: 'Breeze blocks are back. Discover how terracotta jaalis are transforming modern interiors with light, air, and timeless geometry.',
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
                        text: 'Once a staple of mid-century tropical modernism, the humble breeze block—or jaali—is experiencing a sophisticated renaissance. Architects and interior designers are rediscovering the functional beauty of these perforated clay screens, using them not just for ventilation, but as defining pillars of interior aesthetic.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Sculpting with Light' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'As shown in the image above, a jaali wall does more than divide space; it manipulates light. The geometric patterns cast intricate, moving shadows that travel across the floor with the sun, acting as a dynamic sundial that connects the indoors with the passing of time.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'The Material Warmth' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'Terracotta adds a layer of earthy warmth that concrete simply cannot match. In modern minimalist interiors (like the one featured), the rich red-orange clay provides a vital contrast to polished concrete floors and white walls, grounding the space in natural material.'
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
