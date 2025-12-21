
'use server'

import { writeClient } from '@/sanity/lib/write-client';

export async function publishBlog(draftId: string) {
    try {
        // Sanity client 'getDocument' might be named 'getElement' or just 'fetch'. 
        // Typically client.getDocument(id) exists. If not, use fetch.
        const draft = await writeClient.getDocument(draftId);

        if (!draft) {
            // Fallback if getDocument isn't available, try fetch
            const queried = await writeClient.fetch(`*[_id == $id][0]`, { id: draftId });
            if (!queried) throw new Error("Draft not found");
            // Use queried doc
            return await performPublish(queried, draftId);
        }

        return await performPublish(draft, draftId);

    } catch (error: any) {
        console.error("Publish Error:", error);
        return { success: false, error: error.message };
    }
}

async function performPublish(draft: any, draftId: string) {
    const publishedId = draftId.replace('drafts.', '');

    const transaction = writeClient.transaction();

    // Create the published document with the same data
    transaction.createOrReplace({
        ...draft,
        _id: publishedId
    });

    // Delete the draft
    transaction.delete(draftId);

    await transaction.commit();

    return {
        success: true,
        slug: draft.slug?.current,
        id: publishedId
    };
}
