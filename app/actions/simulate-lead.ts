'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { submitLead } from './submit-lead'

export async function createTestLead(email: string) {
    try {
        console.log("Creating test lead for:", email);

        // We reuse the submitLead action to ensure we test the EXACT flow
        // including the initial auto-reply email.
        const result = await submitLead({
            role: 'Architect',
            product: 'Test Sample Box',
            firmName: 'Test Studio Architects',
            city: 'Pune',
            quantity: 'Sample Box',
            timeline: 'Immediate',
            contact: '9999999999',
            email: email,
            address: '123 Test Street, Test Area, Pune - 411001',
            notes: 'This is a simulated test order to verify logistics flow.',
            isSampleRequest: true,
            sampleItems: ['Test Brick Red', 'Test Jali Pattern', 'Test Cladding Tile'],
            fulfillmentStatus: 'pending'
        });

        return result;
    } catch (error) {
        console.error('Error creating test lead:', error)
        return { success: false, error: 'Failed to create test lead' }
    }
}
