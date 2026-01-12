'use server'

import { writeClient } from '@/sanity/lib/write-client'
import { revalidatePath } from 'next/cache'

export async function updateLeadStatus(leadId: string, newStatus: string) {
    try {
        await writeClient
            .patch(leadId)
            .set({ status: newStatus })
            .commit()

        revalidatePath('/dashboard/leads')
        return { success: true }
    } catch (error) {
        console.error('Error updating status:', error)
        return { success: false, error: 'Failed to update status' }
    }
}

export async function deleteLead(leadId: string) {
    try {
        await writeClient.delete(leadId)
        revalidatePath('/dashboard/leads')
        return { success: true }
    } catch (error) {
        console.error('Error deleting lead:', error)
        // Check if token exists
        if (!process.env.SANITY_API_TOKEN) {
            console.error('CRITICAL: SANITY_API_TOKEN is missing in server environment!')
        }
        return { success: false, error: 'Failed to delete lead' }
    }
}

export async function addAdminNote(leadId: string, note: string) {
    try {
        const newNote = {
            _key: Math.random().toString(36).substring(7),
            note,
            timestamp: new Date().toISOString(),
            author: 'Admin'
        }

        await writeClient
            .patch(leadId)
            .setIfMissing({ adminNotes: [] })
            .append('adminNotes', [newNote])
            .commit()

        revalidatePath('/dashboard/leads')
        return { success: true, note: newNote }
    } catch (error) {
        console.error('Error adding note:', error)
        return { success: false, error: 'Failed to add note' }
    }
}
