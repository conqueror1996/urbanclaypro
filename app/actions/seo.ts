'use server';

import { createClient } from 'next-sanity';
import { revalidatePath } from 'next/cache';

const writeClient = createClient({
    apiVersion: '2024-11-28',
    dataset: 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '22qqjddz',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN // Must be set in .env.local
});

export async function updateCollectionSeo(id: string, data: any) {
    if (!writeClient.config().token) {
        return { success: false, error: "Server configuration error: Write token missing." };
    }

    try {
        await writeClient.patch(id).set({
            title: data.title,
            description: data.description,
            seo: {
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                keywords: data.keywords
            }
        }).commit();

        revalidatePath('/products/[...slug]', 'page');
        revalidatePath('/dashboard/seo');
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update SEO:", error);
        return { success: false, error: error.message };
    }
}
