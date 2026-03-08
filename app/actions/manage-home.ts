'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'

export async function updateHomePageFirms(firms: { name: string }[]) {
    try {
        // Fetch the home page document ID first
        let homePage = await writeClient.fetch(`*[_type == "homePage"][0] { _id }`);

        // Add keys to firms if missing (required for Sanity arrays)
        const firmsWithKeys = firms.map((f, i) => ({
            ...f,
            _key: (f as any)._key || `firm-${Date.now()}-${i}`
        }));

        if (!homePage?._id) {
            // Create the first homePage document if it doesn't exist
            const newDoc = await writeClient.create({
                _type: 'homePage',
                title: 'Main Home Page',
                trustedFirms: firmsWithKeys
            });
            homePage = { _id: newDoc._id };
        } else {
            await writeClient
                .patch(homePage._id)
                .set({ trustedFirms: firmsWithKeys })
                .commit();
        }

        revalidatePath('/');
        revalidatePath('/dashboard/content');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating home page firms:', error);
        return { success: false, error: error.message || 'Failed to update firms' };
    }
}

export async function updateTechnicalEdgeImage(assetId: string) {
    try {
        let homePage = await writeClient.fetch(`*[_type == "homePage"][0] { _id }`);

        const imagePatch = {
            technicalEdgeImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            }
        };

        if (!homePage?._id) {
            // Create it if missing
            await writeClient.create({
                _type: 'homePage',
                title: 'Main Home Page',
                ...imagePatch
            });
        } else {
            await writeClient
                .patch(homePage._id)
                .set(imagePatch)
                .commit();
        }

        revalidatePath('/');
        revalidatePath('/dashboard/content');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating Technical Edge image:', error);
        return { success: false, error: error.message || 'Failed to update image' };
    }
}

export async function updateSpecifierToolkitImage(assetId: string) {
    try {
        let homePage = await writeClient.fetch(`*[_type == "homePage"][0] { _id }`);

        const imagePatch = {
            specifierToolkitImage: {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId }
            }
        };

        if (!homePage?._id) {
            await writeClient.create({
                _type: 'homePage',
                title: 'Main Home Page',
                ...imagePatch
            });
        } else {
            await writeClient
                .patch(homePage._id)
                .set(imagePatch)
                .commit();
        }

        revalidatePath('/');
        revalidatePath('/dashboard/content');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating Specifier Toolkit image:', error);
        return { success: false, error: error.message || 'Failed to update image' };
    }
}
