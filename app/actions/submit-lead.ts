'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { sendLeadAlertEmail, sendUserConfirmationEmail } from '@/lib/email'

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
            email: formData.email, // Save email if schema supports it
            notes: formData.notes,
            requirement: formData.notes,
            seriousness: seriousness,
            isSerious: isSerious,
            status: 'new',
            submittedAt: new Date().toISOString(),
        }

        const result = await writeClient.create(doc)

        // 3. Email Automation
        // A. Admin Alert (for Serious Leads)
        if (isSerious) {
            console.log('🚀 Serious Lead Detected:', result._id)
            sendLeadAlertEmail({ ...doc, _id: result._id }).catch(err => console.error('Admin Alert Failed', err));
        }

        // B. User Auto-Reply (Always send for valid email)
        if (doc.email && doc.email.includes('@')) {
            sendUserConfirmationEmail({ ...doc, _id: result._id }).catch(err => console.error('Auto-Reply Failed', err));
        }

        return { success: true, id: result._id, isSerious }
    } catch (error) {
        console.error('Error submitting lead:', error)
        return { success: false, error: 'Failed to save lead' }
    }
}
