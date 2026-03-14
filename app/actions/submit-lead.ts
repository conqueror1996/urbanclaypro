'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { sendLeadAlertEmail, sendUserConfirmationEmail } from '@/lib/email'
import { createZohoLead } from '@/lib/zoho'
import { headers } from 'next/headers'
import { LeadSchema, LeadInput } from '@/lib/validations/lead'

export async function submitLead(rawFormData: any) {
    try {
        // 1. Validate Input
        const validatedFields = LeadSchema.safeParse(rawFormData);
        
        if (!validatedFields.success) {
            console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
            return { success: false, error: 'Invalid form data. Please check all fields.' };
        }

        const formData = validatedFields.data;

        // 2. Calculate Seriousness Algorithm
        let seriousness = 'low'
        let isSerious = false

        // Extract numbers from quantity (e.g., "500 sqft" -> 500)
        const quantityNum = parseInt(formData.quantity?.replace(/[^0-9]/g, '') || '0')

        // Capture IP for Footprint Linking
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || 'unknown'

        const highValueRoles = ['Architect', 'Builder', 'Contractor']

        // Logic: High Value Role OR High Quantity (>1000) OR Detailed Notes
        if (highValueRoles.includes(formData.role) || quantityNum > 1000) {
            seriousness = 'high'
            isSerious = true
        } else if (quantityNum > 200) {
            seriousness = 'medium'
        }

        if (formData.notes && formData.notes.length > 50) {
            // Detailed notes often imply seriousness
            seriousness = 'high'
            isSerious = true
        }

        // 3. Save to Sanity
        const doc = {
            _type: 'lead',
            name: formData.name,
            role: formData.role,
            product: formData.product,
            firmName: formData.firmName,
            city: formData.city,
            country: formData.country,
            quantity: formData.quantity,
            timeline: formData.timeline,
            contact: formData.contact || formData.phone || formData.email,
            email: formData.email,
            notes: formData.notes,
            requirement: formData.notes,
            seriousness: seriousness,
            isSerious: isSerious,
            status: 'new',
            submittedAt: new Date().toISOString(),
            address: formData.address,
            isSampleRequest: formData.isSampleRequest,
            sampleItems: formData.sampleItems,
            fulfillmentStatus: formData.isSampleRequest ? 'pending' : undefined,
            shippingInfo: formData.shippingInfo,
            ip,
        }

        const result = await writeClient.create(doc)

        // 3. Email Automation
        // 3. Email Automation
        // 3. Email Automation
        // A. Admin Alert (Send for ALL leads now)
        console.log('🚀 New Lead Saved:', result._id);

        // A. Admin Alert & User Confirmation (Run in background to avoid blocking UI)
        sendLeadAlertEmail({ ...doc, _id: result._id }).catch(err => console.error('Admin Alert Failed', err));
        
        if (doc.email && doc.email.includes('@')) {
            sendUserConfirmationEmail({ ...doc, _id: result._id }).catch(err => console.error('Auto-Reply Failed', err));
        }


        // 4. Send to Zoho CRM
        // We do this asynchronously so we don't block the UI response too much (emails are fast enough)
        createZohoLead({
            ...formData,
            // Ensure simple defaults if missing
            name: formData.name || formData.firmName?.split(' ')[0] || 'Unknown',
        }).catch(err => console.error('Zoho Sync Failed:', err));

        return {
            success: true,
            id: result._id,
            isSerious
        }
    } catch (error) {
        console.error('Error submitting lead:', error)
        return { success: false, error: 'Failed to save lead' }
    }
}
