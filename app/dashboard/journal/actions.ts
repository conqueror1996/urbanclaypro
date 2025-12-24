'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function deleteJournalEntry(id: string) {
    try {
        await writeClient.delete(id)
        revalidatePath('/dashboard/journal')
        revalidatePath('/journal')
        return { success: true }
    } catch (error) {
        console.error('Delete failed:', error)
        return { success: false, error: 'Failed to delete entry' }
    }
}

export async function generateAIImage(prompt: string) {
    try {
        console.log("Generating AI Image for:", prompt);
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Architectural photography, professional, high detail, 8k, ${prompt}`,
            n: 1,
            size: "1024x1024",
        });

        if (!response.data || !response.data[0]) throw new Error("No image data returned from OpenAI");
        const imageUrl = response.data[0].url;
        if (!imageUrl) throw new Error("No image generated");

        // Fetch the image to upload to Sanity
        const imageRes = await fetch(imageUrl);
        const buffer = await imageRes.arrayBuffer();

        const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
            filename: `ai-${Date.now()}.png`
        });

        return { success: true, assetId: asset._id, imageUrl: asset.url };
    } catch (error: any) {
        console.error("AI Gen Failed:", error);

        // FALLBACK: Return a high-quality placeholder if AI fails (Unbreakable Mode)
        if (error?.message?.includes('Billing') || error?.status === 400 || error?.status === 429) {
            console.log("⚠️ Billing/Limit Error. Switching to Fallback Image.");

            // Fetch a reliable architectural placeholder
            const fallbackUrl = `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80`;
            const imageRes = await fetch(fallbackUrl);
            const buffer = await imageRes.arrayBuffer();

            const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
                filename: `fallback-${Date.now()}.jpg`
            });

            return { success: true, assetId: asset._id, imageUrl: asset.url, isFallback: true };
        }

        return { success: false, error: (error instanceof Error ? error.message : "Unknown error") };
    }
}

export async function uploadImage(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) throw new Error("No file provided");

        const buffer = await file.arrayBuffer();
        const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
            filename: file.name
        });

        return { success: true, assetId: asset._id, imageUrl: asset.url };
    } catch (error) {
        console.error("Upload Failed:", error);
        return { success: false, error: 'Upload Failed' };
    }
}

export async function createJournalEntry(data: { title: string; excerpt: string; date: string; imageId?: string }) {
    try {
        const doc: any = {
            _type: 'journal',
            title: data.title,
            slug: {
                _type: 'slug',
                current: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 96)
            },
            publishedAt: new Date(data.date).toISOString(),
            excerpt: data.excerpt,
            body: [],
        }

        if (data.imageId) {
            doc.mainImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: data.imageId
                }
            }
        }

        await writeClient.create(doc)
        revalidatePath('/dashboard/journal')
        // revalidatePath('/journal') // Redundant if revalidated in dashboard but good practice
        return { success: true }
    } catch (error) {
        console.error('Create failed:', error)
        return { success: false, error: 'Failed to create entry' }
    }
}
