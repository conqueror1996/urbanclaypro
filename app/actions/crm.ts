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
    return await writeClient.create({
        _type: 'crmLead',
        ...leadData,
        submittedAt: new Date().toISOString()
    });
}
