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
    const imagePath = path.join(process.cwd(), 'public/images/exposed-brick-guide.png');
    if (!fs.existsSync(imagePath)) {
        console.error('Image not found');
        return;
    }

    console.log('Uploading image...');
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
        filename: 'exposed-brick-guide.png'
    });
    console.log('Image uploaded:', imageAsset._id);

    const doc = {
        _type: 'journal',
        title: 'The Ultimate Guide to Exposed Brick Masonry',
        slug: { _type: 'slug', current: 'ultimate-guide-exposed-brick-masonry' },
        publishedAt: new Date().toISOString(),
        excerpt: 'Master the art of exposed brickwork. From selecting the right mortar to understanding bond patterns, this guide covers everything you need to know about building timeless facades.',
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
                        text: 'Exposed brick masonry is more than a construction method; it is an architectural philosophy that celebrates the raw, unadorned beauty of fired clay. When executed correctly, as seen in the detail shot above, it creates a facade that is structurally sound, visually arresting, and effectively maintenance-free.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '1. The Importance of The Joint' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'The mortar joint constitutes about 15-20% of your wall purely by surface area. For exposed work, we recommend a consistent 10mm recessed or "raked" joint. This shadow line adds depth and highlights the individual character of each brick.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '2. Selecting the Right Brick' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'Not all bricks are suitable for exposed use. You need high-density wirecut or machine-pressed bricks with low water absorption (ideally <12%) to prevent efflorescence (the white patchy salt deposits). Our UrbanClay wirecut series is specifically fired at 1000°C+ to ensure this durability.'
                    }
                ]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: '3. Timeless Bond Patterns' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        text: 'While the Stretcher bond (running bond) is the most common, exploring Flemish or English bonds can add significant heritage character to contemporary buildings. The texture and light-play change dramatically based simply on how the bricks are stacked.'
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
