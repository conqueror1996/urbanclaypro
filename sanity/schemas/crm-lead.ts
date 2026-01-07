export default {
    name: 'crmLead',
    title: 'CRM Lead',
    type: 'document',
    fields: [
        {
            name: 'clientName',
            title: 'Client Name',
            type: 'string',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'role',
            title: 'Client Role',
            type: 'string',
            options: {
                list: [
                    { title: 'Architect', value: 'architect' },
                    { title: 'Interior Designer', value: 'designer' },
                    { title: 'Contractor / Builder', value: 'contractor' },
                    { title: 'End User / Owner', value: 'owner' }
                ]
            }
        },
        {
            name: 'requirements',
            title: 'Detailed Requirements',
            type: 'text',
            description: 'What products are they looking for? (e.g. 500sqft Jaali)'
        },
        {
            name: 'company',
            title: 'Company / Project Name',
            type: 'string'
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string'
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
            validation: (Rule: any) => Rule.required()
        },
        {
            name: 'location',
            title: 'Client Location',
            type: 'string',
            description: 'City or Region of the project/client'
        },
        {
            name: 'leadDate',
            title: 'Lead Date',
            type: 'date',
            description: 'The date the lead was received'
        },
        {
            name: 'leadTime',
            title: 'Lead Time',
            type: 'string',
            description: 'The time the lead was received'
        },
        {
            name: 'address',
            title: 'Site / Shipping Address',
            type: 'text'
        },
        {
            name: 'isSerious',
            title: 'High Priority (Hot Deal)',
            type: 'boolean',
            initialValue: false
        },
        {
            name: 'category',
            title: 'Lead Source',
            type: 'string',
            options: {
                list: [
                    { title: 'Website Quote', value: 'website' },
                    { title: 'Google Contacts', value: 'google' },
                    { title: 'Referral', value: 'referral' },
                    { title: 'Direct Call', value: 'call' }
                ]
            }
        },
        {
            name: 'stage',
            title: 'Deal Stage',
            type: 'string',
            initialValue: 'new',
            options: {
                list: [
                    { title: 'New / Inquiry', value: 'new' },
                    { title: 'Qualified / Discussion', value: 'qualified' },
                    { title: 'Sample Dispatched', value: 'sample' },
                    { title: 'Quoted', value: 'quoted' },
                    { title: 'Negotiating', value: 'negotiating' },
                    { title: 'Won', value: 'won' },
                    { title: 'Lost', value: 'lost' }
                ]
            }
        },
        {
            name: 'statusIndicator',
            title: 'Current Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Waiting for Client', value: 'waiting_client' },
                    { title: 'Action Needed - UrbanClay', value: 'action_needed' },
                    { title: 'Price Objection', value: 'price_objection' },
                    { title: 'Color/Quality Concern', value: 'quality_objection' },
                    { title: 'Timeline Issue', value: 'timeline_issue' },
                    { title: 'Decision Pending', value: 'pending' }
                ]
            }
        },
        {
            name: 'projectTimeline',
            title: 'Project Stage / Site Readiness',
            type: 'string',
            options: {
                list: [
                    { title: 'Concept / Architect Planning', value: 'planning' },
                    { title: 'Foundation / Brickwork', value: 'foundation' },
                    { title: 'Finishing / Plastering', value: 'finishing' },
                    { title: 'Immediate Requirement', value: 'immediate' }
                ]
            }
        },
        {
            name: 'potentialValue',
            title: 'Potential Value (₹)',
            type: 'number'
        },
        {
            name: 'nextFollowUp',
            title: 'Next Follow-up Date',
            type: 'datetime'
        },
        {
            name: 'lastContactDate',
            title: 'Last Contact Date',
            type: 'datetime'
        },
        {
            name: 'interactions',
            title: 'Interaction History',
            type: 'array',
            of: [{ type: 'crmInteraction' }]
        },
        {
            name: 'freightEstimate',
            title: 'Estimated Freight Cost (₹)',
            type: 'number'
        },
        {
            name: 'productName',
            title: 'Initial Product Choice',
            type: 'string'
        },
        {
            name: 'quantity',
            title: 'Initial Quantity',
            type: 'string'
        },
        {
            name: 'totalWeightKg',
            title: 'Total Project Weight (kg)',
            type: 'number'
        },
        {
            name: 'notes',
            title: 'Internal Notes',
            type: 'text'
        }
    ],
    preview: {
        select: {
            title: 'clientName',
            subtitle: 'company',
            stage: 'stage'
        },
        prepare(selection: any) {
            const { title, subtitle, stage } = selection;
            return {
                title,
                subtitle: `${subtitle || 'Individual'} | Stage: ${stage}`
            }
        }
    }
}
