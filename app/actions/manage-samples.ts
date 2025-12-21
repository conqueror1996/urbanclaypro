
'use server'

import { writeClient } from '@/sanity/lib/write-client';

export async function updateSampleStatus(leadId: string, status: string, shippingInfo?: any) {
    try {
        const updateData: any = {
            fulfillmentStatus: status
        };

        if (status === 'shipped' && shippingInfo) {
            updateData.shippingInfo = {
                ...shippingInfo,
                dispatchedDate: new Date().toISOString()
            };
        }

        await writeClient.patch(leadId).set(updateData).commit();

        // Trigger Emails
        const lead = await writeClient.fetch(`*[_id == $id][0]`, { id: leadId });

        if (lead && lead.email) {
            if (status === 'shipped') {
                await import('@/lib/email').then(m => m.sendSampleShippedEmail({ ...lead, shippingInfo }));
            } else if (status === 'delivered') {
                await import('@/lib/email').then(m => m.sendSampleFollowUpEmail(lead));
            }
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to update sample status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}
