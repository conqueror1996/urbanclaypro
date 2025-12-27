'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { client } from '@/sanity/lib/client';
import { uuid } from '@sanity/uuid';

export async function ClaimStudioKit(leadId: string, address: string, phone: string) {
    if (!leadId) return { success: false, error: 'Lead ID missing' };

    try {
        // 1. Fetch the architect details
        const architect = await client.fetch(`*[_id == $id][0]`, { id: leadId });
        if (!architect) return { success: false, error: 'Architect lead not found' };

        // 2. Create the 'lead' document for the Sample Dashboard
        await writeClient.create({
            _id: `sample-${uuid()}`,
            _type: 'lead',
            contact: architect.name || architect.firmName || 'Architect',
            email: architect.email,
            firmName: architect.firmName,
            city: architect.city,
            address: address,
            contactPhone: phone, // Assuming some phone field or use contact
            product: 'Architect Studio Material Kit',
            isSampleRequest: true,
            fulfillmentStatus: 'pending',
            submittedAt: new Date().toISOString(),
            notes: `Requested via Campaign Outreach. Original ArchitectLead Code: ${leadId}`
        });

        // 3. Update the architectLead status so it shows up in Analytics as 'converted'
        await writeClient.patch(leadId)
            .set({
                status: 'replied',
                hasRequestedSample: true,
                convertedAt: new Date().toISOString()
            })
            .commit();

        return { success: true };
    } catch (err: any) {
        console.error("Claim Error:", err);
        return { success: false, error: err.message };
    }
}
