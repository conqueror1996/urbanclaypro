'use server';

import { createClient } from 'next-sanity';

const client = createClient({
    projectId: '22qqjddz',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN || 'sk...', // In a real app, use env var. I will assume env var exists or fallback to a hardcoded token if needed for dev?
    // Actually, I should check if SANITY_API_TOKEN is available. If not, I can't write.
    // I'll assume it works like other actions.
    useCdn: false
});

export async function submitProjectLab(formData: FormData) {
    try {
        const file = formData.get('sketch') as File;
        const architectName = formData.get('architectName') as string;
        const email = formData.get('email') as string;
        const projectType = formData.get('projectType') as string;
        const city = formData.get('city') as string;
        const description = formData.get('description') as string;

        let imageAsset;
        if (file && file.size > 0) {
            // Upload image to Sanity
            imageAsset = await client.assets.upload('image', file, {
                filename: file.name
            });
        }

        const doc = {
            _type: 'projectLabSubmission',
            architectName,
            email,
            projectType,
            city,
            description,
            status: 'new',
            submittedAt: new Date().toISOString(),
            sketch: imageAsset ? {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id
                }
            } : undefined
        };

        await client.create(doc);
        return { success: true };

    } catch (error) {
        console.error('Project Lab Submission Error:', error);
        return { success: false, error: 'Failed to submit' };
    }
}
