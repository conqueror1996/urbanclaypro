
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

        let emailResult: { success: boolean, error?: any } = { success: true };

        if (lead && lead.email) {
            try {
                if (status === 'shipped') {
                    emailResult = await import('@/lib/email').then(m => m.sendSampleShippedEmail({ ...lead, shippingInfo }));
                } else if (status === 'delivered') {
                    emailResult = await import('@/lib/email').then(m => m.sendSampleFollowUpEmail(lead));
                }
            } catch (e) {
                console.error("Email Import/Send Failed", e);
                emailResult = { success: false, error: 'Email module failed' };
            }
        }

        return { success: true, emailError: emailResult.success ? undefined : emailResult.error };
    } catch (error) {
        console.error('Failed to update sample status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}
