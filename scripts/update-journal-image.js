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
    const imagePath = path.join(process.cwd(), 'public/images/uploaded-brick-vs-stone.jpg');

    if (!fs.existsSync(imagePath)) {
        console.error('Image not found at: ', imagePath);
        return;
    }

    console.log('Uploading new image...');
    const imageAsset = await client.assets.upload('image', fs.createReadStream(imagePath), {
        filename: 'uploaded-brick-vs-stone.jpg'
    });
    console.log('Image uploaded:', imageAsset._id);

    const slug = 'brick-tiles-vs-natural-stone-comparison';
    console.log(`Finding journal with slug: ${slug}...`);

    // Find the document ID
    const query = `*[_type == "journal" && slug.current == $slug][0]._id`;
    const docId = await client.fetch(query, { slug });

    if (!docId) {
        console.error('Journal entry not found!');
        return;
    }

    console.log(`Updating document ${docId}...`);

    await client.patch(docId)
        .set({
            mainImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: imageAsset._id }
            }
        })
        .commit();

    console.log('Journal entry updated successfully!');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
