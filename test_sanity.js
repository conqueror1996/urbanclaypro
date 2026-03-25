const { createClient } = require('@sanity/client');

const client = createClient({
    projectId: '22qqjddz',
    dataset: 'production',
    useCdn: false,
    token: 'skbKrEdCCtaP4BkQBuTv963GhOexpLassIeUejFiy2JWNmTCSNYvE4NpsGvDrWHOdchJF97PVARB4enIvMud3MvLsWXon8ZpVxicLmfog0fsK7eZflfwyN4zS1mv6UyfMExgy31xDuLw1Jn9oCZTyKhS0aklYwQM9kF3C1kWtCb5A45iLBMk',
    apiVersion: '2024-11-28',
});

async function test() {
    try {
        console.log("Testing Sanity connection...");
        const doc = {
            _type: 'project',
            title: 'Test Project ' + Date.now(),
            slug: { current: 'test-project-' + Date.now(), _type: 'slug' },
            location: 'Test Location',
            type: 'Residential'
        };
        const result = await client.create(doc);
        console.log("Success! Created project:", result._id);
        await client.delete(result._id);
        console.log("Cleaned up test project.");
    } catch (err) {
        console.error("Sanity Error:", err.message);
        if (err.response) {
            console.error("Response body:", err.response.body);
        }
    }
}

test();
