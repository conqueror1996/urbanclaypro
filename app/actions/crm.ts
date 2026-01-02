'use server';

import { client } from '@/sanity/lib/client';
import { writeClient } from '@/sanity/lib/write-client';

export async function getCRMLeads() {
    const query = `*[_type == "crmLead"] | order(nextFollowUp asc, _updatedAt desc) {
        ...,
        "interactionCount": count(interactions)
    }`;
    return await client.fetch(query);
}

export async function updateCRMLeadStage(leadId: string, stage: string) {
    return await writeClient
        .patch(leadId)
        .set({ stage })
        .commit();
}

export async function updateCRMLead(leadId: string, data: any) {
    return await writeClient
        .patch(leadId)
        .set(data)
        .commit();
}

export async function deleteCRMLead(leadId: string) {
    return await writeClient.delete(leadId);
}

export async function addCRMInteraction(leadId: string, interaction: {
    type: string;
    summary: string;
    nextAction: string;
    nextFollowUpDate?: string;
}) {
    const newInteraction = {
        _type: 'crmInteraction',
        _key: Math.random().toString(36).substring(2),
        date: new Date().toISOString(),
        type: interaction.type,
        summary: interaction.summary,
        nextAction: interaction.nextAction
    };

    const patch: any = {
        interactions: [newInteraction, ...((await client.fetch(`*[_id == "${leadId}"][0].interactions`)) || [])],
        lastContactDate: new Date().toISOString()
    };

    if (interaction.nextFollowUpDate) {
        patch.nextFollowUp = interaction.nextFollowUpDate;
    }

    return await writeClient
        .patch(leadId)
        .set(patch)
        .commit();
}

export async function createCRMLead(leadData: any) {
    try {
        console.log("Attempting to create CRM Lead with data:", leadData);
        const result = await writeClient.create({
            _type: 'crmLead',
            ...leadData,
            submittedAt: new Date().toISOString()
        });
        console.log("CRM Lead created successfully:", result._id);
        return result;
    } catch (error: any) {
        console.error("CRITICAL: Sanity Lead Creation Failed", error);
        // Throw detailed error to be caught by the frontend
        throw new Error(error.message || "Failed to create lead in Sanity");
    }
}

export async function saveGoogleContactsToSanity(contacts: any[]) {
    const BATCH_SIZE = 50;

    for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
        const batch = contacts.slice(i, i + BATCH_SIZE);
        const transaction = writeClient.transaction();

        for (const contact of batch) {
            const cleanPhone = contact.phone?.replace(/[^0-9]/g, '');
            const cleanEmail = contact.email?.replace(/[^a-zA-Z0-9]/g, '');
            const id = `contact-${cleanPhone || cleanEmail || Math.random().toString(36).substring(7)}`;

            transaction.createIfNotExists({
                _id: id,
                _type: 'crmContact',
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
                source: 'google',
                lastSyncedAt: new Date().toISOString()
            });
        }
        await transaction.commit();
    }
    return { success: true };
}

export async function getCRMContacts() {
    return await client.fetch(`*[_type == "crmContact"] | order(name asc)`);
}

export async function getLabours() {
    return await client.fetch(`*[_type == "labour"] | order(name asc)`);
}

export async function getSites() {
    return await client.fetch(`*[_type == "site"] | order(name asc)`);
}

export async function createSiteFromLead(lead: any) {
    try {
        const result = await writeClient.create({
            _type: 'site',
            name: `${lead.company || lead.clientName}'s Project`,
            client: lead.clientName,
            clientPhone: lead.phone,
            clientEmail: lead.email,
            status: 'planned',
            startDate: new Date().toISOString().split('T')[0],
            notes: `Converted from CRM Lead. Initial requirements: ${lead.requirements}`
        });
        return result;
    } catch (error: any) {
        console.error("Site Creation Failed", error);
        throw new Error(error.message);
    }
}

export async function addFeedback(feedback: { name: string, rating: number, comment: string, leadId?: string }) {
    try {
        const result = await writeClient.create({
            _type: 'feedback',
            name: feedback.name,
            rating: feedback.rating,
            comment: feedback.comment,
            submittedAt: new Date().toISOString()
        });
        return result;
    } catch (error: any) {
        console.error("Feedback Submission Failed", error);
        throw new Error(error.message);
    }
}
