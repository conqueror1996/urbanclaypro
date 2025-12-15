'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { sendLeadAlertEmail } from '@/lib/email'

export async function submitLead(formData: any) {
    try {
        // 1. Calculate Seriousness Algorithm
        let seriousness = 'low'
        let isSerious = false

        // Extract numbers from quantity (e.g., "500 sqft" -> 500)
        const quantityNum = parseInt(formData.quantity?.replace(/[^0-9]/g, '') || '0')
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

        // 2. Save to Sanity
        const doc = {
            _type: 'lead',
            role: formData.role,
            product: formData.product,
            firmName: formData.firmName,
            city: formData.city,
            quantity: formData.quantity,
            timeline: formData.timeline,
            contact: formData.contact,
            notes: formData.notes,
            requirement: formData.notes, // Storing the variant/requirement string here as well for clarity in CMS
            seriousness: seriousness,
            isSerious: isSerious,
            status: 'new',
            submittedAt: new Date().toISOString(),
        }

        const result = await writeClient.create(doc)

        // 3. Email Notification for Serious Leads
        if (isSerious) {
            console.log('🚀 Serious Lead Detected:', result._id)
            try {
                // We don't await this to keep the response fast for the user
                sendLeadAlertEmail({ ...doc, _id: result._id }).catch((err: any) => console.error('Email send failed in background', err));
            } catch (e) {
                console.error('Failed to trigger email alert', e)
            }
        }

        return { success: true, id: result._id, isSerious }
    } catch (error) {
        console.error('Error submitting lead:', error)
        return { success: false, error: 'Failed to save lead' }
    }
}
