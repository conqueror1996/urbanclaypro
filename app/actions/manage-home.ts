'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'

export async function updateHomePageFirms(firms: { name: string }[]) {
    try {
        // Fetch the home page document ID first (usually there's only one)
        const homePage = await writeClient.fetch(`*[_type == "homePage"][0] { _id }`);

        if (!homePage?._id) {
            return { success: false, error: 'Home Page document not found' };
        }

        await writeClient
            .patch(homePage._id)
            .set({ trustedFirms: firms })
            .commit();

        revalidatePath('/');
        revalidatePath('/dashboard/content');
        return { success: true };
    } catch (error) {
        console.error('Error updating home page firms:', error);
        return { success: false, error: 'Failed to update firms' };
    }
}
